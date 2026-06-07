const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const LOG_DIR_PATH = path.join(__dirname, '..', 'data');
const LOG_FILE_PATH = path.join(__dirname, '..', 'data', 'emotion-logs.json');

function ensureLogStorage() {
  if (!fs.existsSync(LOG_DIR_PATH)) {
    fs.mkdirSync(LOG_DIR_PATH, { recursive: true });
  }

  if (!fs.existsSync(LOG_FILE_PATH)) {
    fs.writeFileSync(LOG_FILE_PATH, '[]', 'utf8');
  }
}

function readLogs() {
  try {
    ensureLogStorage();
    const fileContent = fs.readFileSync(LOG_FILE_PATH, 'utf8');
    const parsed = JSON.parse(fileContent);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to read emotion logs:', error.message);
    return [];
  }
}

function writeLogs(logs) {
  ensureLogStorage();
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
  try {
    writeLogs(logs);
  } catch (error) {
    console.error('Failed to write emotion logs:', error.message);
    return res.status(500).json({
      error: 'failed to write logs'
    });
  }

  return res.json({
    success: true,
    item: newItem
  });
});

module.exports = router;
