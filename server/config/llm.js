const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.join(__dirname, '..', '.env')
});

const llmConfig = {
  apiKey: process.env.QWEN_API_KEY || '',
  model: process.env.QWEN_MODEL || 'qwen-plus-latest'
};

module.exports = llmConfig;
