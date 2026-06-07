const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const LOG_FILE_PATH = path.join(__dirname, '..', 'data', 'emotion-logs.json');

function readLogs() {
  try {
    const fileContent = fs.readFileSync(LOG_FILE_PATH, 'utf8');
    const parsed = JSON.parse(fileContent);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function writeLogs(logs) {
  fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(logs, null, 2), 'utf8');
}

router.get('/', function(req, res) {
  const items = readLogs();
  res.json({ items: items });
});

router.post('/', function(req, res) {
  const body = req.body || {};
  const text = body.text ? String(body.text).trim() : '';
  const emotion = body.emotion ? String(body.emotion).trim() : '';
  const method = body.method ? String(body.method).trim() : '';

  if (!text) {
    return res.status(400).json({
      error: 'text is required'
    });
  }

  const logs = readLogs();
  const newItem = {
    id: Date.now(),
    text: text,
    emotion: emotion || '未识别',
    method: method || '未提供',
    reply: body.reply ? String(body.reply) : '',
    description: body.description ? String(body.description) : '',
    suggestion: body.suggestion ? String(body.suggestion) : '',
    timestamp: body.timestamp || new Date().toISOString()
  };

  logs.unshift(newItem);
  writeLogs(logs);

  return res.json({
    success: true,
    item: newItem
  });
});

module.exports = router;
