(function() {
  function createApiUrl(path) {
    if (window.AppRuntimeConfig && typeof window.AppRuntimeConfig.createApiUrl === 'function') {
      return window.AppRuntimeConfig.createApiUrl(path);
    }

    return 'http://localhost:3000' + path;
  }

  var chatMessages = document.getElementById('chat-messages');
  var userInput = document.getElementById('user-input');
  var btnSend = document.getElementById('btn-send');
  var btnReset = document.getElementById('btn-reset');
  var logsList = document.getElementById('logs-list');
  var subtitleEl = document.getElementById('agent-subtitle');
  var welcomeBubble = document.getElementById('welcome-bubble');

  var defaultWelcomeMessage = '你好，我是情绪助手。你可以告诉我你现在最真实的感受，我会先陪你梳理一下。';
  var defaultSubtitle = '你可以用一句话描述你现在的状态，我会先给出一段简短回应，陪你开始梳理。';
  var MIN_SENDING_MS = 800;
  var MAX_HISTORY_MESSAGES = 6;
  var LOGS_URL = createApiUrl('/api/logs');
  var welcomeMessage = defaultWelcomeMessage;
  var conversationHistory = [];

  var ENDING_CONFIG = {
    harmony: {
      subtitle: '你刚刚体验到的是“象骑合一”。如果你想把这种平衡带回现实，我们可以从当下的感受开始继续整理。',
      welcome: '你刚刚抵达的是“象骑合一”的结局。这说明你已经看见了情绪与理性合作的可能。现在，如果你愿意，我们可以把这种理解带回你此刻真实的生活里。'
    },
    elephant: {
      subtitle: '你刚刚体验到的是“被象驱使”。如果你愿意，我们可以先从一个很小的停顿开始，帮你把情绪和行动慢慢分开。',
      welcome: '你刚刚抵达的是“被象驱使”的结局。这并不代表你做得不好，而是说明情绪有时真的会先把人推着走。现在，我们可以先陪你的“象”慢一点。'
    },
    rider: {
      subtitle: '你刚刚体验到的是“压抑崩溃”。如果你愿意，我们可以先练习承认感受，而不是继续把它压下去。',
      welcome: '你刚刚抵达的是“压抑崩溃”的结局。这不代表你不够坚强，反而说明你已经扛了很久。现在，我们可以先给那些被压住的感受一点空间。'
    }
  };

  function wait(ms) {
    return new Promise(function(resolve) {
      setTimeout(resolve, ms);
    });
  }

  function applyWelcomeByEnding() {
    var params = new URLSearchParams(window.location.search);
    var ending = params.get('ending');
    var config = ENDING_CONFIG[ending];

    if (!config) {
      welcomeMessage = defaultWelcomeMessage;
      if (subtitleEl) {
        subtitleEl.textContent = defaultSubtitle;
      }
      if (welcomeBubble) {
        welcomeBubble.textContent = defaultWelcomeMessage;
      }
      return;
    }

    welcomeMessage = config.welcome;
    if (subtitleEl) {
      subtitleEl.textContent = config.subtitle;
    }
    if (welcomeBubble) {
      welcomeBubble.textContent = config.welcome;
    }
  }

  function createMessage(role, text) {
    var message = document.createElement('div');
    message.className = 'message message-' + role;

    var roleLabel = document.createElement('div');
    roleLabel.className = 'message-role';
    roleLabel.textContent = role === 'user' ? '你' : '情绪助手';

    var bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = text;

    message.appendChild(roleLabel);
    message.appendChild(bubble);
    return message;
  }

  function appendMessage(role, text) {
    chatMessages.appendChild(createMessage(role, text));
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addToHistory(role, content) {
    if (!content || (role !== 'user' && role !== 'assistant')) {
      return;
    }

    conversationHistory.push({
      role: role,
      content: content
    });

    if (conversationHistory.length > MAX_HISTORY_MESSAGES) {
      conversationHistory = conversationHistory.slice(-MAX_HISTORY_MESSAGES);
    }
  }

  function getRecentHistory() {
    return conversationHistory.slice(-MAX_HISTORY_MESSAGES).map(function(item) {
      return {
        role: item.role,
        content: item.content
      };
    });
  }

  function formatLogTime(timestamp) {
    if (!timestamp) {
      return '时间未知';
    }

    var date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return timestamp;
    }

    return date.toLocaleString('zh-CN', {
      hour12: false
    });
  }

  function renderLogs(items) {
    logsList.innerHTML = '';

    if (!items || items.length === 0) {
      var emptyEl = document.createElement('div');
      emptyEl.className = 'logs-empty';
      emptyEl.textContent = '还没有历史记录，发送一条消息后会出现在这里。';
      logsList.appendChild(emptyEl);
      return;
    }

    for (var i = 0; i < items.length; i++) {
      var item = items[i];

      var logItem = document.createElement('div');
      logItem.className = 'log-item';

      var meta = document.createElement('div');
      meta.className = 'log-meta';

      var timeEl = document.createElement('span');
      timeEl.textContent = formatLogTime(item.timestamp);

      var emotionEl = document.createElement('span');
      emotionEl.className = 'log-emotion';
      emotionEl.textContent = item.emotion || '未识别';

      meta.appendChild(timeEl);
      meta.appendChild(emotionEl);

      var textEl = document.createElement('p');
      textEl.className = 'log-text';
      textEl.textContent = item.text || '';

      var descriptionEl = document.createElement('p');
      descriptionEl.className = 'log-description';
      descriptionEl.textContent = item.description
        ? '方法说明：' + item.description
        : '方法说明：暂无理论说明。';

      logItem.appendChild(meta);
      logItem.appendChild(textEl);
      logItem.appendChild(descriptionEl);
      logsList.appendChild(logItem);
    }
  }

  function loadLogs() {
    if (!logsList) {
      return Promise.resolve();
    }

    logsList.innerHTML = '<div class="logs-empty">正在加载日志...</div>';

    return fetch(LOGS_URL)
      .then(function(response) {
        if (!response.ok) {
          throw new Error('日志读取失败');
        }
        return response.json();
      })
      .then(function(data) {
        renderLogs(data.items || []);
      })
      .catch(function() {
        logsList.innerHTML = '<div class="logs-empty">暂时无法加载日志，请确认后端已启动。</div>';
      });
  }

  function setSendingState(isSending) {
    btnSend.disabled = isSending;
    btnSend.textContent = isSending ? '发送中...' : '发送';
  }

  async function sendMessage() {
    var text = userInput.value.trim();
    if (!text) {
      userInput.focus();
      return;
    }

    appendMessage('user', text);
    if (!window.ChatEngine || typeof window.ChatEngine.sendMessage !== 'function') {
      appendMessage('agent', '当前聊天引擎还没有正确加载，请稍后再试。');
      userInput.focus();
      return;
    }

    userInput.value = '';
    setSendingState(true);
    var startTime = Date.now();
    var history = getRecentHistory();

    try {
      var result = await window.ChatEngine.sendMessage(text, history);
      var elapsed = Date.now() - startTime;
      if (elapsed < MIN_SENDING_MS) {
        await wait(MIN_SENDING_MS - elapsed);
      }

      if (result.success) {
        addToHistory('user', text);
        appendMessage('agent', result.displayText);
        addToHistory('assistant', result.displayText);
        await loadLogs();
      } else {
        appendMessage('agent', result.error || '暂时无法处理这条消息，请稍后再试。');
      }
    } finally {
      setSendingState(false);
      userInput.focus();
    }
  }

  function resetChat() {
    conversationHistory = [];
    chatMessages.innerHTML = '';
    appendMessage('agent', welcomeMessage);
    userInput.value = '';
    userInput.focus();
  }

  btnSend.addEventListener('click', sendMessage);
  btnReset.addEventListener('click', resetChat);

  userInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });

  applyWelcomeByEnding();
  loadLogs();
})();
