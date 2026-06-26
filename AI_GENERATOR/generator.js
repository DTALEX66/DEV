/**
 * 规则怪谈剧情生成器 v1.0
 * 用法: node generator.js <主题>
 * 示例: node generator.js 电梯
 */

const fs = require('fs');
const path = require('path');

// ====== 配置 ======
const BASE = __dirname;
const THEMES_FILE = path.join(BASE, 'prompts', 'themes.json');
const ARCS_FILE = path.join(BASE, 'templates', 'story-arcs.json');
const CONTENT_FILE = path.join(BASE, 'templates', 'content-templates.json');
const OUTPUT_DIR = path.join(BASE, 'output');

// ====== 工具 ======
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickRemove(arr) { var i = Math.floor(Math.random() * arr.length); var v = arr[i]; arr.splice(i, 1); return v; }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function uid() { return 'ch_' + Math.random().toString(36).substring(2, 6); }

// ====== 加载数据 ======
var themes = JSON.parse(fs.readFileSync(THEMES_FILE, 'utf8')).themes;
var arcs = JSON.parse(fs.readFileSync(ARCS_FILE, 'utf8'));
var contentTpl = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));

// ====== 生成器 ======
function generateStory(subject) {
  // 查找主题
  var theme = themes[subject];
  if (!theme) {
    console.log('未找到主题: ' + subject);
    console.log('可用主题: ' + Object.keys(themes).join(', '));
    return null;
  }

  // 选择故事弧
  var arcNames = Object.keys(arcs.story_archetypes);
  var arc = arcs.story_archetypes[arcNames[Math.floor(Math.random() * arcNames.length)]];
  
  // 决定章节数
  var chCount = Math.floor(Math.random() * (arc.chapter_count.max - arc.chapter_count.min + 1)) + arc.chapter_count.min;
  
  // 抽取规则
  var rulesPool = JSON.parse(JSON.stringify(theme.rules));
  var usedRules = [];
  for (var i = 0; i < Math.min(arc.required_rules, rulesPool.length); i++) {
    usedRules.push(pickRemove(rulesPool));
  }
  
  // ====== 生成章节 ======
  var chapters = {};
  var prevId = null;
  var startId = null;
  
  // 生成第1章（醒来）
  var c1Id = uid();
  startId = c1Id;
  var c1 = buildChapter(c1Id, 1, '第一幕 · ' + pick(['醒来', '开始', '进入', '到达', '初入']),
    null, theme, usedRules, contentTpl, true);
  chapters[c1Id] = c1;
  prevId = c1Id;
  
  // 生成中间章节
  for (var i = 2; i <= chCount; i++) {
    var cId = uid();
    var chTitle = buildChapterTitle(i, chCount, arc.structure);
    var hasRule = (i <= usedRules.length && Math.random() < 0.6);
    var ch = buildChapter(cId, i, chTitle,
      prevId, theme, usedRules, contentTpl, hasRule);
    chapters[cId] = ch;
    
    // 更新上一个章节的最后一个选项指向这个章节
    if (prevId && chapters[prevId]) {
      var prevCh = chapters[prevId];
      if (prevCh.choices && prevCh.choices.length > 0) {
        var lastChoice = prevCh.choices[prevCh.choices.length - 1];
        if (!lastChoice._linked) {
          lastChoice.next = cId;
          lastChoice._linked = true;
        }
      }
    }
    prevId = cId;
  }
  
  // 生成结局分支（从最后一章发出）
  var lastCh = chapters[prevId];
  if (lastCh) {
    // 清理最后一个章节原来的选项，改为结局分支
    var endings = generateEndings(theme, contentTpl);
    
    // 好结局
    var egId = 'ending_good';
    chapters[egId] = endings.good;
    
    // 坏结局
    var ebId = 'ending_bad';
    chapters[ebId] = endings.bad;
    
    // 隐藏结局
    var esId = 'ending_secret';
    chapters[esId] = endings.secret;
    
    // 最后一章的选项指向三个结局
    lastCh.choices = [
      {
        "text": buildChoiceText("安全的选择", pick(contentTpl.content_templates.escalation.escalation_factors), theme),
        "next": egId,
        "effects": { "sanity": 10 }
      },
      {
        "text": buildChoiceText("冒险的选择", pick(contentTpl.content_templates.revelation.discovery_actions), theme),
        "next": ebId,
        "effects": { "sanity": -15, "flag": "took_risk" }
      },
      {
        "text": buildChoiceText("相信直觉", pick(contentTpl.pressure_descriptions), theme),
        "next": esId,
        "effects": { "trust": 15, "flag": "followed_instinct" }
      }
    ];
    // 隐藏结局条件设置（需要特定flag）
    lastCh.choices[2].condition = { "flag": "followed_instinct" };
  }
  
  // 构建剧情树
  var charCount = Object.keys(chapters).length;
  
  // 输出
  var story = {
    title: subject + ' · 规则怪谈',
    version: '2.0.0',
    start: startId,
    generated_by: 'AI_GENERATOR v1.0',
    generated_at: new Date().toISOString(),
    subject: subject,
    archetype: arc.description,
    total_chapters: charCount,
    stats: {
      rules: usedRules.length,
      endings: 3,
      hidden_routes: 1,
      plot_twists: 1
    },
    chapters: chapters
  };
  
  // 生成剧情图
  var graph = {
    title: story.title,
    nodes: [],
    edges: []
  };
  
  for (var id in chapters) {
    var ch = chapters[id];
    graph.nodes.push({
      id: id,
      title: ch.title,
      type: ch.choices && ch.choices.length > 0 ? 'chapter' : 'ending',
      choiceCount: ch.choices ? ch.choices.length : 0
    });
    if (ch.choices) {
      for (var j = 0; j < ch.choices.length; j++) {
        graph.edges.push({
          from: id,
          to: ch.choices[j].next,
          label: ch.choices[j].text.substring(0, 20) + '...'
        });
      }
    }
  }
  
  return { story: story, graph: graph };
}

// ====== 章节构建 ======
function buildChapter(id, index, title, prevId, theme, rulesPool, tpl, hasRule) {
  var anomalies = theme.anomalies;
  var pressures = theme.pressures;
  var locations = theme.locations;
  var objects = theme.objects;
  var contentTemplates = tpl.content_templates;
  var pressureDescs = tpl.pressure_descriptions;
  
  // 决定是否在此章显示规则
  var ruleText = null;
  if (hasRule && rulesPool.length > 0) {
    ruleText = pickRemove(rulesPool);
  }
  
  // 构建内容
  var anomalyText = pick(anomalies);
  var anomaly2 = pick(anomalies);
  var pressureText = pick(pressures.concat(pressureDescs));
  var pressure2 = pick(pressures.concat(pressureDescs));
  
  var parts = [];
  if (ruleText) {
    parts.push('[规则说明]
' + ruleText);
  }
  parts.push('[当前异常]
' + anomalyText + '
' + anomaly2);
  parts.push('[心理压迫]
' + pressureText + '
' + pressure2);
  var content = parts.join('

');
  
  // 构建选项
  var choices = [];
  var choiceCount = 2 + Math.floor(Math.random() * 2); // 2-3个
  
  // 收集使用的nextIds
  var usedNextIds = [];
  
  for (var i = 0; i < choiceCount; i++) {
    var nextId = null;
    var isLast = (i === choiceCount - 1);
    
    if (isLast && prevId && Math.random() < 0.5) {
      // 留空，由上层设置指向下一章
    } else {
      nextId = uid();  // 临时ID，会被上层覆盖
    }
    
    var choiceText = buildChoiceText(
      pick(["遵守规则", "打破规则", "观察四周", "向前探索", "后退", "使用工具", "呼叫求助", "保持沉默", "主动出击"]),
      pick(anomalies.concat(pressureDescs)),
      theme
    );
    
    // 加后果暗示
    var hint = pick(tpl.consequence_hints || []);
    choiceText = choiceText + '（' + hint.replace(/[（）()]/g, '') + '）';
    
    var effects = {
      "sanity": Math.floor(Math.random() * 21) - 10,
      "trust": Math.floor(Math.random() * 11) - 5
    };
    if (Math.random() < 0.3) {
      effects.flag = 'flag_' + Math.random().toString(36).substring(2, 5);
    }
    
    choices.push({
      "text": choiceText,
      "next": nextId || '__PLACEHOLDER__',
      "effects": effects,
      "_linked": isLast && !nextId
    });
  }
  
  var chapterTitle = title || '第' + index + '幕';
  return {
    "id": id,
    "title": chapterTitle,
    "content": content,
    "choices": choices
  };
}

function buildChapterTitle(index, total, structure) {
  var namePool = [
    '初识', '探寻', '深入', '转折', '逼近', '崩溃', '真相', '终局',
    '裂隙', '回声', '边界', '沉没', '镜像', '循环', '出口'
  ];
  var n = pick(namePool);
  return '第' + romanNum(index) + '幕 · ' + n;
}

function romanNum(n) {
  var map = {1:'I',2:'II',3:'III',4:'IV',5:'V',6:'VI',7:'VII',8:'VIII'};
  return map[n] || n;
}

// ====== 结局生成 ======
function generateEndings(theme, tpl) {
  var pDescs = tpl.pressure_descriptions;
  var endingTypes = tpl.ending_archetypes;
  
  return {
    "good": {
      "id": "ending_good",
      "title": "结局 · 幸存者",
      "content": "[结局说明]
你走出来了。" + pick(pDescs) + "

你活下来了。但有些东西永远改变了。

【完】",
      "choices": []
    },
    "bad": {
      "id": "ending_bad",
      "title": "结局 · 替代",
      "content": "[系统提示]
你的意识开始模糊。" + pick(pDescs) + "

[结局说明]
你失败了。规则找到了新的维护者。

【实验体 · 淘汰】",
      "choices": [
        { "text": "重新开始", "next": "chapter_1" }
      ]
    },
    "secret": {
      "id": "ending_secret",
      "title": "隐藏结局 · 觉醒",
      "content": "[系统提示]
你发现了真相。" + pick(pDescs) + "

[结局说明]
你按下了终止键。所有屏幕同时熄灭。

【真正的结局：你自由了。他们也自由了。】",
      "choices": [
        { "text": "再来一次", "next": "chapter_1" }
      ]
    }
  };
}

// ====== 选项文本生成 ======
function buildChoiceText(action, context, theme) {
  var loc = pick(theme.locations);
  var obj = pick(theme.objects);
  var variations = [
    action + '——' + context.substring(0, 15),
    '走向' + loc + '，' + action,
    '使用' + obj + '来' + action,
    action + '，尽管' + context.substring(0, 12)
  ];
  return pick(variations);
}

// ====== 后处理 ======
function finalizeStory(story) {
  // 将占位符链接修正
  var chapterIds = Object.keys(story.chapters);
  for (var i = 0; i < chapterIds.length; i++) {
    var ch = story.chapters[chapterIds[i]];
    if (ch.choices) {
      for (var j = 0; j < ch.choices.length; j++) {
        var c = ch.choices[j];
        if (c.next === '__PLACEHOLDER__' || c.next === null) {
          // 指向下一个未链接的章节
          var found = false;
          for (var k = i + 1; k < chapterIds.length; k++) {
            var nid = chapterIds[k];
            if (nid !== ch.id && story.chapters[nid].choices && story.chapters[nid].choices.length > 0) {
              c.next = nid;
              found = true;
              break;
            }
          }
          if (!found) {
            // 指向结局
            c.next = 'ending_good';
          }
        }
      }
    }
  }
  // 删除内部标记
  for (var i = 0; i < chapterIds.length; i++) {
    var ch = story.chapters[chapterIds[i]];
    if (ch.choices) {
      for (var j = 0; j < ch.choices.length; j++) {
        delete ch.choices[j]._linked;
        delete ch.choices[j].condition;
      }
    }
  }
  return story;
}

// ====== 主入口 ======
function main() {
  var subject = process.argv[2];
  if (!subject) {
    console.log('用法: node generator.js <主题>');
    console.log('可用主题: ' + Object.keys(themes).join(', '));
    process.exit(1);
  }
  
  console.log('正在生成「' + subject + '」规则怪谈...');
  var result = generateStory(subject);
  if (!result) return;
  
  var story = finalizeStory(result.story);
  var graph = result.graph;
  
  // 写入文件
  var storyPath = path.join(OUTPUT_DIR, 'story.json');
  var graphPath = path.join(OUTPUT_DIR, 'story_graph.json');
  
  // 清理内部字段
  var cleanStory = JSON.parse(JSON.stringify(story));
  var cleanGraph = JSON.parse(JSON.stringify(graph));
  
  fs.writeFileSync(storyPath, JSON.stringify(cleanStory, null, 2), 'utf8');
  fs.writeFileSync(graphPath, JSON.stringify(cleanGraph, null, 2), 'utf8');
  
  console.log('\n✔ 已生成:');
  console.log('  ' + storyPath);
  console.log('  ' + graphPath);
  console.log('  ' + Object.keys(story.chapters).length + ' 个章节/结局');
  console.log('  ' + (story.stats ? story.stats.rules : 'N/A') + ' 条规则');
  console.log('  3 个结局（含1个隐藏结局）');
  console.log('  1 个剧情反转');
}

if (require.main === module) {
  main();
}

module.exports = { generateStory, finalizeStory };
