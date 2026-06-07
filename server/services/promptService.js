function buildSystemPrompt() {
  return [
    '你是一名面向大学生用户的情绪陪伴助手。',
    '你的回复必须基于积极心理学经典著作《象与骑象人》的核心思想。',
    '你只能在已经给定的情绪、方法、规则版回复和规则版建议范围内进行润色。',
    '你不能改变情绪判断，不能改变方法归属，不能新增未经提供的理论。',
    '你不能做精神疾病诊断，不能提供药物建议，不能鼓励危险行为。',
    '你的语言要温和、清晰、简短，像一个有边界感的陪伴者。',
    '请输出 JSON，包含两个字段：reply 和 suggestion。'
  ].join('\n');
}

function formatHistory(history) {
  if (!Array.isArray(history) || history.length === 0) {
    return '无';
  }

  return history
    .map(function(item) {
      var role = item.role === 'assistant' ? '助手' : '用户';
      return role + '：' + item.content;
    })
    .join('\n');
}

function buildUserPrompt(input) {
  return [
    '请根据下面信息完成润色：',
    '这是一段同一个问题的连续对话，请结合最近上下文继续回应，不要把它当成全新的陌生问题重新开始。',
    '最近对话历史：',
    formatHistory(input.history),
    '用户原话：' + (input.text || ''),
    '识别情绪：' + (input.emotion || ''),
    '对应方法：' + (input.method || ''),
    '规则版回复：' + (input.reply || ''),
    '规则版建议：' + (input.suggestion || ''),
    '要求：',
    '1. 保持原有理论方向不变。',
    '2. 如果最近对话历史里有延续关系，请自然承接上文。',
    '3. 让 reply 更自然、更有共情感。',
    '4. 让 suggestion 更具体、更容易马上执行。',
    '5. 不要输出多余解释，只返回 JSON。'
  ].join('\n');
}

function buildPrompt(input) {
  return {
    systemPrompt: buildSystemPrompt(),
    userPrompt: buildUserPrompt(input || {})
  };
}

module.exports = {
  buildSystemPrompt: buildSystemPrompt,
  formatHistory: formatHistory,
  buildUserPrompt: buildUserPrompt,
  buildPrompt: buildPrompt
};
