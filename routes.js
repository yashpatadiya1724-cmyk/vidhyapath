// ===== API ROUTES - VidhyaPath =====
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DB_PATH = path.join(__dirname, 'db.json');

// ===== HELPER: Read/Write JSON DB =====
function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify({ students: {}, sessions: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch (e) {
    return { students: {}, sessions: [] };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    return false;
  }
}

// ===== STUDENT ROUTES =====

// GET /api/student/:id
router.get('/student/:id', (req, res) => {
  const db = readDB();
  const student = db.students[req.params.id];
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json(student);
});

// POST /api/student - Create/update student
router.post('/student', (req, res) => {
  const db = readDB();
  const { id, name, avatar, settings, progress, adaptive } = req.body;

  if (!id) return res.status(400).json({ error: 'Student ID required' });

  db.students[id] = {
    id, name, avatar,
    settings: settings || {},
    progress: progress || {},
    adaptive: adaptive || {},
    updatedAt: new Date().toISOString()
  };

  writeDB(db);
  res.json({ success: true, student: db.students[id] });
});

// PUT /api/student/:id/progress
router.put('/student/:id/progress', (req, res) => {
  const db = readDB();
  if (!db.students[req.params.id]) {
    return res.status(404).json({ error: 'Student not found' });
  }

  db.students[req.params.id].progress = {
    ...db.students[req.params.id].progress,
    ...req.body
  };
  db.students[req.params.id].updatedAt = new Date().toISOString();

  writeDB(db);
  res.json({ success: true });
});

// ===== SESSION ROUTES =====

// POST /api/session - Log quiz session
router.post('/session', (req, res) => {
  const db = readDB();
  const session = {
    id: Date.now().toString(),
    ...req.body,
    timestamp: new Date().toISOString()
  };

  db.sessions.push(session);

  // Keep last 1000 sessions
  if (db.sessions.length > 1000) {
    db.sessions = db.sessions.slice(-1000);
  }

  writeDB(db);
  res.json({ success: true, sessionId: session.id });
});

// GET /api/sessions/:studentId
router.get('/sessions/:studentId', (req, res) => {
  const db = readDB();
  const sessions = db.sessions.filter(s => s.studentId === req.params.studentId);
  res.json(sessions);
});

// ===== ADAPTIVE ALGORITHM ROUTE =====

// POST /api/adaptive/analyze
router.post('/adaptive/analyze', (req, res) => {
  const { accuracy, avgResponseTime, consecutiveCorrect, consecutiveWrong } = req.body;

  // Mirror of client-side adaptive logic
  let mode, difficulty;

  if (accuracy < 50 || avgResponseTime > 25000 || consecutiveWrong >= 3) {
    mode = 'struggling';
    difficulty = 'easy';
  } else if (accuracy < 65) {
    mode = 'progressing';
    difficulty = 'easy';
  } else if (accuracy >= 80 && avgResponseTime <= 8000 && consecutiveCorrect >= 5) {
    mode = 'excelling';
    difficulty = 'hard';
  } else {
    mode = 'performing';
    difficulty = 'medium';
  }

  const recommendations = {
    struggling: {
      fontIncrease: true,
      enableSimpleMode: true,
      enableHighContrast: true,
      showHints: true,
      timerMultiplier: 1.5,
      message: "Take it easy! We've simplified the interface for you."
    },
    progressing: {
      fontIncrease: false,
      enableSimpleMode: false,
      showHints: true,
      timerMultiplier: 1,
      message: "You're making progress! Keep going."
    },
    performing: {
      fontIncrease: false,
      enableSimpleMode: false,
      showHints: false,
      timerMultiplier: 1,
      message: "Great work! Challenge mode unlocking soon."
    },
    excelling: {
      fontIncrease: false,
      disableSimpleMode: true,
      showHints: false,
      timerMultiplier: 0.85,
      unlockNextLesson: true,
      message: "🚀 Outstanding! You're in Advanced Mode!"
    }
  };

  res.json({
    mode,
    difficulty,
    recommendation: recommendations[mode],
    analysis: { accuracy, avgResponseTime, consecutiveCorrect, consecutiveWrong }
  });
});

// ===== LEADERBOARD =====
router.get('/leaderboard', (req, res) => {
  const db = readDB();
  const leaderboard = Object.values(db.students)
    .map(s => ({
      name: s.name,
      avatar: s.avatar,
      points: s.progress?.totalPoints || 0,
      lessonsCompleted: s.progress?.lessonsCompleted || 0
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);

  res.json(leaderboard);
});

// ===== HEALTH CHECK =====
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    platform: 'VidhyaPath',
    version: '1.0.0',
    mission: 'Vikshit Bharat 2047 – NEP 2020 & Skill India',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
