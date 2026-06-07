const BASE_URL = 'http://localhost:3000';

async function requestJson(url, options) {
  const response = await fetch(url, options);
  const text = await response.text();

  let data = null;
  try {
    data = JSON.parse(text);
  } catch (error) {
    throw new Error('接口返回的不是合法 JSON：' + text);
  }

  return {
    ok: response.ok,
    status: response.status,
    data: data
  };
}

async function testHealth() {
  const result = await requestJson(BASE_URL + '/api/health');

  if (!result.ok || result.data.status !== 'ok') {
    throw new Error('健康检查失败：' + JSON.stringify(result.data));
  }

  console.log('1. 健康检查通过');
  console.log(result.data);
}

async function testEmotionAnalyze() {
  const payload = {
    text: '我最近很焦虑，晚上总是睡不好',
    history: []
  };

  const result = await requestJson(BASE_URL + '/api/emotion/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!result.ok) {
    throw new Error('情绪分析接口请求失败：' + result.status);
  }

  if (!result.data.emotion || result.data.emotion === '未识别') {
    throw new Error('情绪分析结果异常：' + JSON.stringify(result.data));
  }

  console.log('2. 情绪分析通过');
  console.log(result.data);
}

async function run() {
  console.log('开始测试后端接口...');

  try {
    await testHealth();
    await testEmotionAnalyze();
    console.log('测试完成：后端接口运行正常。');
  } catch (error) {
    console.error('测试失败：' + error.message);
    console.error('请先确认后端已启动：npm start');
    process.exit(1);
  }
}

run();
