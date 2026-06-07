const path = require('path');
const express = require('express');
const emotionRoutes = require('./routes/emotion');
const logsRoutes = require('./routes/logs');

const app = express();
const PORT = process.env.PORT || 3000;
const PROJECT_ROOT = path.join(__dirname, '..');

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

app.get('/api/health', function(req, res) {
  res.json({
    status: 'ok',
    message: 'server is running'
  });
});

app.use('/api/emotion', emotionRoutes);
app.use('/api/logs', logsRoutes);

app.use('/shared', express.static(path.join(PROJECT_ROOT, 'shared')));
app.use('/agent', express.static(path.join(PROJECT_ROOT, 'agent')));
app.use('/game', express.static(path.join(PROJECT_ROOT, 'game')));

app.get('/', function(req, res) {
  res.sendFile(path.join(PROJECT_ROOT, 'index.html'));
});

app.get('/index.html', function(req, res) {
  res.sendFile(path.join(PROJECT_ROOT, 'index.html'));
});

app.get('/agent', function(req, res) {
  res.sendFile(path.join(PROJECT_ROOT, 'agent', 'index.html'));
});

app.get('/game', function(req, res) {
  res.sendFile(path.join(PROJECT_ROOT, 'game', 'index.html'));
});

app.listen(PORT, function() {
  console.log('Server is running at http://localhost:' + PORT);
});
