(function(global) {
  var THEORY_MAP = {
    anxiety: {
      methodName: '冥想训练',
      empathy: '听起来你最近一直处在很紧绷的状态里，像有很多担心在同时拉扯你。',
      methodDescription: '《象与骑象人》强调，情绪反应往往先于理性判断。面对焦虑时，先观察念头而不急着对抗，能帮助“骑象人”重新获得觉察空间。',
      actionSuggestion: '现在先试着做 3 次慢呼吸：吸气 4 秒，停 1 秒，呼气 6 秒，只需要把注意力放回呼吸。'
    },
    sadness: {
      methodName: '认知重构',
      empathy: '你现在可能真的很难过，这种失落感不是脆弱，而是你正在认真经历一件事。',
      methodDescription: '书中提到，我们对事件的解释会影响情绪本身。面对悲伤时，先把脑中最伤人的想法说出来，再尝试寻找另一种更完整的理解。',
      actionSuggestion: '拿一张纸写下：这件事让我最难受的想法是什么？然后补一句：还有没有另一种可能的解释？'
    },
    anger: {
      methodName: '认知重构',
      empathy: '你会生气，往往说明这件事触碰到了你的边界，或者让你感到不公平。',
      methodDescription: '《象与骑象人》提醒我们，情绪会先冲出来，理性常常只是事后解释。愤怒时先停下来重看事件，能减少被“象”直接拖着走。',
      actionSuggestion: '先不要急着回应对方。现在用一句话写下：我最在意的是哪一点不公平？等 1 分钟后再决定要不要表达。'
    },
    confusion: {
      methodName: '创造进展感',
      empathy: '迷茫的时候，最难受的往往不是问题本身，而是完全不知道该往哪里走。',
      methodDescription: '书中强调，进展感是维持动力的重要来源。面对迷茫时，不必立刻想清全部答案，先找到一个最小下一步，比逼自己一下子想通更有效。',
      actionSuggestion: '先只写下你接下来 10 分钟内能完成的一件最小事情，例如列 3 个选项、问一个人、查一个资料。'
    },
    loneliness: {
      methodName: '建立社会连接',
      empathy: '孤独并不只是身边没人，有时候更像是“我在这里，但好像没有人真正懂我”。',
      methodDescription: '《象与骑象人》提到，人类天生需要深层连接，关系本身就是幸福的重要来源。孤独时，先恢复一点点真实联系，比强撑着更有帮助。',
      actionSuggestion: '现在就给一个你相对信任的人发一条很短的消息，比如：“我今天状态有点低，想和你说句话。”'
    },
    fatigue: {
      methodName: '创造进展感',
      empathy: '你可能已经撑了很久，累到不是不想努力，而是身体和心里都在提醒你需要缓一缓。',
      methodDescription: '书中指出，单靠意志力很难长期推动自己。疲惫时，与其继续硬扛，不如把任务缩小到足够轻，让自己重新感受到一点可完成的进展。',
      actionSuggestion: '把你现在最想逃开的任务拆成一个 5 分钟动作，只做第一小步，做完就停下来喝口水。'
    },
    unknown: {
      methodName: '先做情绪命名',
      empathy: '你的感受也许有点复杂，暂时说不清楚也没关系，我们可以先不急着下结论。',
      methodDescription: '在《象与骑象人》的视角里，先看见“象”正在发生什么，比马上控制它更重要。先把感受说清一点，后面的帮助才会更贴近你。',
      actionSuggestion: '试着补一句：我现在最强烈的感受更像是紧张、难过、生气、迷茫、孤独，还是疲惫？'
    }
  };

  function getTheoryForEmotion(emotionKey) {
    return THEORY_MAP[emotionKey] || THEORY_MAP.unknown;
  }

  global.TheoryLibrary = {
    getTheoryForEmotion: getTheoryForEmotion,
    THEORY_MAP: THEORY_MAP
  };
})(window);
