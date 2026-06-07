const express = require('express');
const emotionService = require('../services/emotionService');
const theoryService = require('../services/theoryService');
const promptService = require('../services/promptService');
const llmService = require('../services/llmService');

const router = express.Router();
const EMOTION_LABEL_MAP = {
  anxiety: '焦虑',
  sadness: '悲伤',
  anger: '愤怒',
  confusion: '迷茫',
  loneliness: '孤独',
  fatigue: '疲惫',
  unknown: '未识别'
};

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

function getEmotionKeyByLabel(label) {
  var keys = Object.keys(EMOTION_LABEL_MAP);

  for (var i = 0; i < keys.length; i += 1) {
    if (EMOTION_LABEL_MAP[keys[i]] === label) {
      return keys[i];
    }
  }

  return 'unknown';
}

function getFallbackEmotionFromHistory(history) {
  for (var i = history.length - 1; i >= 0; i -= 1) {
    var item = history[i];

    if (item.role === 'assistant') {
      var labelMatch = item.content.match(/主要情绪可能更接近[“"](.+?)[”"]/);
      if (labelMatch && labelMatch[1]) {
        var fallbackKey = getEmotionKeyByLabel(labelMatch[1]);
        if (fallbackKey !== 'unknown') {
          return {
            key: fallbackKey,
            label: EMOTION_LABEL_MAP[fallbackKey],
            score: 0,
            fromHistory: true
          };
        }
      }
    }
  }

  for (var j = history.length - 1; j >= 0; j -= 1) {
    var userItem = history[j];

    if (userItem.role === 'user') {
      var userEmotion = emotionService.detectEmotion(userItem.content);
      if (userEmotion.key !== 'unknown') {
        return {
          key: userEmotion.key,
          label: userEmotion.label,
          score: userEmotion.score || 0,
          fromHistory: true
        };
      }
    }
  }

  return null;
}

router.post('/analyze', async function(req, res) {
  const text = req.body && req.body.text ? String(req.body.text).trim() : '';
  const history = normalizeHistory(req.body && req.body.history);

  if (!text) {
    return res.status(400).json({
      error: 'text is required'
    });
  }

  let emotionResult = emotionService.detectEmotion(text);
  if (emotionResult.key === 'unknown' && history.length > 0) {
    var fallbackEmotion = getFallbackEmotionFromHistory(history);
    if (fallbackEmotion) {
      emotionResult = fallbackEmotion;
    }
  }
  const theoryResult = theoryService.getTheoryForEmotion(emotionResult.key);
  const ruleBasedResult = {
    emotion: emotionResult.label,
    method: theoryResult.method,
    reply: theoryResult.reply,
    suggestion: theoryResult.suggestion,
    description: theoryResult.description
  };

  try {
    const prompt = promptService.buildPrompt({
      text: text,
      history: history,
      emotion: ruleBasedResult.emotion,
      method: ruleBasedResult.method,
      reply: ruleBasedResult.reply,
      suggestion: ruleBasedResult.suggestion
    });

    const llmResult = await llmService.callQwen(
      prompt.systemPrompt,
      prompt.userPrompt
    );

    const parsed = llmResult.parsed || {};

    return res.json({
      emotion: ruleBasedResult.emotion,
      method: ruleBasedResult.method,
      reply: parsed.reply || ruleBasedResult.reply,
      suggestion: parsed.suggestion || ruleBasedResult.suggestion,
      description: ruleBasedResult.description
    });
  } catch (error) {
    console.error('Qwen fallback triggered:', error.message);
    return res.json(ruleBasedResult);
  }
});

module.exports = router;
