// ===== BACKEND SERVER - VidhyaPath =====
// Vikshit Bharat 2047 – Adaptive Learning Platform
// Node.js + Express Backend

const express = require('express');
const path = require('path');
const fs = require('fs');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS headers for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Serve static files from root
app.use(express.static(path.join(__dirname, '..')));

// ===== API ROUTES =====
app.use('/api', routes);

// ===== SERVE HTML PAGES =====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dashboard.html'));
});

app.get('/lesson', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'lesson.html'));
});

app.get('/quiz', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'quiz.html'));
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log('\n🚀 VidhyaPath Server Running!');
  console.log('================================');
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`📖 Lessons: http://localhost:${PORT}/lesson`);
  console.log(`📝 Quiz: http://localhost:${PORT}/quiz`);
  console.log('================================');
  console.log('🇮🇳 Vikshit Bharat 2047 | NEP 2020 | Skill India\n');
});

module.exports = app;
