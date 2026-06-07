(function(global) {
  function createApiUrl(path) {
    if (global.AppRuntimeConfig && typeof global.AppRuntimeConfig.createApiUrl === 'function') {
      return global.AppRuntimeConfig.createApiUrl(path);
    }

    return 'http://localhost:3000' + path;
  }

  var API_URL = createApiUrl('/api/emotion/analyze');
  var LOGS_URL = createApiUrl('/api/logs');
  var HEALTH_URL = createApiUrl('/api/health');
  var CRISIS_KEYWORDS = [
    '自杀',
    '想死',
    '不想活',
    '结束生命',
    '轻生',
    '活着没意思',
    '自残',
    '自伤',
    '伤害自己',
    '伤害别人'
  ];

  function checkCrisis(text) {
    for (var i = 0; i < CRISIS_KEYWORDS.length; i++) {
      if (text.indexOf(CRISIS_KEYWORDS[i]) !== -1) {
        return {
          matched: true,
          keyword: CRISIS_KEYWORDS[i]
        };
      }
    }

    return {
      matched: false,
      keyword: ''
    };
  }

  function buildCrisisReply(text, crisisResult) {
    return {
      input: text,
      type: 'crisis',
      crisis: crisisResult,
      reply: {
        empathy: '我看到你现在可能正处在非常痛苦的状态里，我会先把你的即时安全放在第一位。',
        emotionJudgment: '你刚才提到的内容里出现了“' + crisisResult.keyword + '”这类高风险表达。',
        methodName: '立即寻求现实中的支持',
        methodDescription: '现在最重要的不是继续做普通情绪练习，而是尽快联系你信任的人，比如家人、朋友、老师、辅导员，或尽快前往学校心理中心、医院、当地紧急服务与专业热线寻求帮助。',
        actionSuggestion: '如果你此刻有伤害自己或伤害他人的打算，请不要一个人待着，马上联系身边可信任的人陪着你，并尽快寻求现实中的专业支持。'
      }
    };
  }

  function buildNormalReply(text, apiResult) {
    return {
      input: text,
      type: 'normal',
      emotion: {
        label: apiResult.emotion || '未识别'
      },
      reply: {
        empathy: apiResult.reply || '谢谢你愿意把这句话说出来。',
        emotionJudgment: '我感受到你现在的主要情绪可能更接近“' + (apiResult.emotion || '未识别') + '”。',
        methodName: apiResult.method || '先做情绪命名',
        methodDescription: apiResult.description || '我会先根据你的描述，给你一个贴近当下状态的整理方向。',
        actionSuggestion: apiResult.suggestion || '你可以再多告诉我一点，你此刻最强烈的感受是什么。'
      }
    };
  }

  function formatReplyText(result) {
    return [
      result.reply.empathy,
      result.reply.emotionJudgment,
      '适合你的方法：' + result.reply.methodName,
      result.reply.methodDescription,
      '你现在可以先这样做：' + result.reply.actionSuggestion
    ].join('\n\n');
  }

  function saveLog(text, apiResult) {
    return fetch(LOGS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        emotion: apiResult.emotion || '未识别',
        method: apiResult.method || '先做情绪命名',
        reply: apiResult.reply || '',
        description: apiResult.description || '',
        suggestion: apiResult.suggestion || '',
        timestamp: new Date().toISOString()
      })
    })
      .then(function(response) {
        if (!response.ok) {
          throw new Error('日志保存失败');
        }
        return response.json();
      })
      .catch(function() {
        return null;
      });
  }

  function normalizeHistory(history) {
    if (!Array.isArray(history)) {
      return [];
    }

    return history
      .filter(function(item) {
        return item && item.role && item.content;
      })
      .map(function(item) {
        return {
          role: item.role === 'assistant' ? 'assistant' : 'user',
          content: String(item.content).trim()
        };
      })
      .filter(function(item) {
        return item.content;
      })
      .slice(-6);
  }

  function sendMessage(text, history) {
    var cleanText = text ? text.trim() : '';
    var cleanHistory = normalizeHistory(history);
    if (!cleanText) {
      return Promise.resolve({
        success: false,
        error: '请输入你现在的感受。'
      });
    }

    var crisisResult = checkCrisis(cleanText);
    if (crisisResult.matched) {
      var crisisReply = buildCrisisReply(cleanText, crisisResult);
      return Promise.resolve({
        success: true,
        data: crisisReply,
        displayText: formatReplyText(crisisReply)
      });
    }

    return fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: cleanText,
        history: cleanHistory
      })
    })
      .then(function(response) {
        if (!response.ok) {
          throw new Error('后端接口请求失败');
        }
        return response.json();
      })
      .then(function(apiResult) {
        var result = buildNormalReply(cleanText, apiResult);
        return saveLog(cleanText, apiResult)
          .then(function() {
            return {
              success: true,
              data: result,
              displayText: formatReplyText(result)
            };
          });
      })
      .catch(function() {
        return {
          success: false,
          error: '暂时无法连接后端服务。请确认后端已经启动，并且 ' + HEALTH_URL + ' 可以正常访问。'
        };
      });
  }

  global.ChatEngine = {
    sendMessage: sendMessage,
    formatReplyText: formatReplyText,
    checkCrisis: checkCrisis
  };
})(window);
