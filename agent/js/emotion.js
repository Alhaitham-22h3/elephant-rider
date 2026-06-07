(function(global) {
  var EMOTION_KEYWORDS = {
    anxiety: {
      label: '焦虑',
      keywords: ['焦虑', '紧张', '担心', '害怕', '不安', '压力', '睡不着', '心慌']
    },
    sadness: {
      label: '悲伤',
      keywords: ['悲伤', '难过', '伤心', '失落', '想哭', '痛苦', '低落', '委屈']
    },
    anger: {
      label: '愤怒',
      keywords: ['愤怒', '生气', '烦', '讨厌', '气死', '不公平', '凭什么', '火大']
    },
    confusion: {
      label: '迷茫',
      keywords: ['迷茫', '不知道', '困惑', '方向', '意义', '怎么办', '找不到路', '没头绪']
    },
    loneliness: {
      label: '孤独',
      keywords: ['孤独', '寂寞', '没人', '一个人', '不被理解', '被忽略', '没有陪伴', '没人懂']
    },
    fatigue: {
      label: '疲惫',
      keywords: ['疲惫', '累', '倦', '无力', '撑不住', '没劲', '好疲惫', '精疲力尽']
    }
  };

  function countMatches(text, keywords) {
    var score = 0;
    for (var i = 0; i < keywords.length; i++) {
      if (text.indexOf(keywords[i]) !== -1) {
        score++;
      }
    }
    return score;
  }

  function detectEmotion(text) {
    if (!text || !text.trim()) {
      return {
        key: 'unknown',
        label: '未识别',
        score: 0
      };
    }

    var normalizedText = text.trim();
    var bestMatch = {
      key: 'unknown',
      label: '未识别',
      score: 0
    };

    for (var key in EMOTION_KEYWORDS) {
      if (!EMOTION_KEYWORDS.hasOwnProperty(key)) continue;

      var emotion = EMOTION_KEYWORDS[key];
      var score = countMatches(normalizedText, emotion.keywords);

      if (score > bestMatch.score) {
        bestMatch = {
          key: key,
          label: emotion.label,
          score: score
        };
      }
    }

    return bestMatch;
  }

  function getEmotionKeywords(key) {
    if (!EMOTION_KEYWORDS[key]) {
      return [];
    }
    return EMOTION_KEYWORDS[key].keywords.slice();
  }

  global.EmotionDetector = {
    detectEmotion: detectEmotion,
    getEmotionKeywords: getEmotionKeywords,
    EMOTION_KEYWORDS: EMOTION_KEYWORDS
  };
})(window);
