const axios = require('axios');
const llmConfig = require('../config/llm');

const QWEN_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

function parseJsonContent(content) {
  try {
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

async function callQwen(systemPrompt, userPrompt) {
  if (!llmConfig.apiKey) {
    throw new Error('QWEN_API_KEY is missing');
  }

  const response = await axios.post(
    QWEN_API_URL,
    {
      model: llmConfig.model,
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
    raw: content,
    parsed: parseJsonContent(content)
  };
}

module.exports = {
  callQwen: callQwen
};
