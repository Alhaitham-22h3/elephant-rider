const axios = require('axios');
const llmConfig = require('../config/llm');

const QWEN_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
const MODEL_ALIAS_MAP = {
  'qwen3.7-plus': 'qwen-plus-latest',
  'qwen3-7-plus': 'qwen-plus-latest',
  'qwen37plus': 'qwen-plus-latest',
  'qwen3.7 plus': 'qwen-plus-latest',
  'qwen3.7-plus-latest': 'qwen-plus-latest'
};

function parseJsonContent(content) {
  try {
    return JSON.parse(content);
  } catch (error) {
    var normalized = String(content || '').trim();
    if (!normalized) {
      return null;
    }

    if (normalized.indexOf('```') === 0) {
      normalized = normalized
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/, '')
        .trim();
    }

    try {
      return JSON.parse(normalized);
    } catch (innerError) {
      var firstBrace = normalized.indexOf('{');
      var lastBrace = normalized.lastIndexOf('}');

      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        try {
          return JSON.parse(normalized.slice(firstBrace, lastBrace + 1));
        } catch (sliceError) {
          return null;
        }
      }

      return null;
    }
  }
}

function normalizeModelName(model) {
  var normalized = String(model || '').trim();
  if (!normalized) {
    return 'qwen-plus-latest';
  }

  var aliasKey = normalized.toLowerCase();
  return MODEL_ALIAS_MAP[aliasKey] || normalized;
}

function getModelCandidates() {
  var preferredModel = normalizeModelName(llmConfig.model);
  var candidates = [preferredModel, 'qwen-plus-latest', 'qwen-plus'];

  return candidates.filter(function(model, index) {
    return model && candidates.indexOf(model) === index;
  });
}

async function requestQwen(model, systemPrompt, userPrompt) {
  const response = await axios.post(
    QWEN_API_URL,
    {
      model: model,
      enable_thinking: false,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.7
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + llmConfig.apiKey
      },
      timeout: 60000
    }
  );

  const content =
    response &&
    response.data &&
    response.data.choices &&
    response.data.choices[0] &&
    response.data.choices[0].message
      ? response.data.choices[0].message.content
      : '';

  if (!content) {
    throw new Error('Qwen returned empty content');
  }

  return {
    model: model,
    raw: content,
    parsed: parseJsonContent(content)
  };
}

async function callQwen(systemPrompt, userPrompt) {
  if (!llmConfig.apiKey) {
    throw new Error('QWEN_API_KEY is missing');
  }

  var candidates = getModelCandidates();
  var lastError = null;

  for (var i = 0; i < candidates.length; i += 1) {
    try {
      return await requestQwen(candidates[i], systemPrompt, userPrompt);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('Qwen request failed');
}

module.exports = {
  callQwen: callQwen
};
