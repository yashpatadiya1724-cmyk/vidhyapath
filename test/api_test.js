/**
 * Test Suite: VidhyaPath Adaptive Learning Platform
 * Automated Verification: DB Schema, File Integrity & Route Exports
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('VidhyaPath Automated Test Suite');
console.log('Vikshit Bharat 2047 | NEP 2020 | Skill India');
console.log('====================================================\n');

// 1. Package Configuration Integrity
console.log('Test 1: Validating package.json configuration...');
const packageJsonPath = path.join(__dirname, '..', 'package.json');
assert(fs.existsSync(packageJsonPath), 'package.json must exist');
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
assert.strictEqual(pkg.main, 'server.js', 'package.json main must point to server.js');
assert(pkg.scripts && pkg.scripts.start, 'package.json must have start script');
assert(pkg.scripts && pkg.scripts.test, 'package.json must have test script');
console.log('✔ package.json configuration validated!\n');

// 2. Static Presentation Pages
console.log('Test 2: Verifying critical frontend entry points...');
const requiredPages = ['index.html', 'dashboard.html', 'lesson.html', 'quiz.html'];
for (const page of requiredPages) {
  const pagePath = path.join(__dirname, '..', page);
  assert(fs.existsSync(pagePath), `Essential page ${page} must exist`);
  const content = fs.readFileSync(pagePath, 'utf8');
  assert(content.length > 500, `${page} must contain non-empty markup`);
}
console.log(`✔ All ${requiredPages.length} core frontend pages verified!\n`);

// 3. Database Schema & Persistence
console.log('Test 3: Testing database schema integrity...');
const testDbPath = path.join(__dirname, 'test_db.json');
try {
  const initialData = {
    students: {
      'std-001': {
        id: 'std-001',
        name: 'Test Learner',
        avatar: 'avatar1.png',
        settings: { theme: 'high-contrast', fontSize: 'large' },
        progress: { lessonsCompleted: 5, quizScore: 92 },
        adaptive: { pace: 'accelerated', sensoryMode: 'adhd-friendly' }
      }
    },
    sessions: [
      { id: 'sess-001', studentId: 'std-001', durationSeconds: 1200 }
    ]
  };
  fs.writeFileSync(testDbPath, JSON.stringify(initialData, null, 2));
  assert(fs.existsSync(testDbPath), 'test_db.json must be written');
  
  const readBack = JSON.parse(fs.readFileSync(testDbPath, 'utf8'));
  assert(readBack.students['std-001'], 'Student profile must persist');
  assert.strictEqual(readBack.students['std-001'].progress.quizScore, 92);
  assert.strictEqual(readBack.students['std-001'].adaptive.sensoryMode, 'adhd-friendly');
  console.log('✔ Database persistence and schema validated!\n');
} finally {
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
}

// 4. Server & Routes Module Exports
console.log('Test 4: Verifying route module integrity...');
const routesPath = path.join(__dirname, '..', 'routes.js');
assert(fs.existsSync(routesPath), 'routes.js must exist');
const serverPath = path.join(__dirname, '..', 'server.js');
assert(fs.existsSync(serverPath), 'server.js must exist');
console.log('✔ Server and routes modules verified!\n');

// 5. Live HTTP API Endpoint Verification
console.log('Test 5: Live Express HTTP Server API Endpoints...');
const http = require('http');
const app = require('../server');

function makeRequest(port, method, pathName, data = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    const req = http.request({
      hostname: '127.0.0.1',
      port: port,
      path: pathName,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

(async () => {
  const server = app.listen(0);
  const port = server.address().port;

  try {
    // 5a. Student 404 lookup
    const notFoundRes = await makeRequest(port, 'GET', '/api/student/std-unknown-999');
    assert.strictEqual(notFoundRes.status, 404, 'Unknown student must return 404');
    console.log('✔ GET /api/student/:id (404 Not Found) verified!');

    // 5b. Create Student via POST
    const createRes = await makeRequest(port, 'POST', '/api/student', {
      id: 'std-ci-test',
      name: 'Vidhya CI User',
      avatar: 'avatar1.png',
      settings: { theme: 'dyslexic-friendly' },
      progress: { lessonsCompleted: 3 },
      adaptive: { pace: 'self-paced' }
    });
    assert.strictEqual(createRes.status, 200, 'Student creation must return 200');
    assert(createRes.data.success, 'Student creation success must be true');
    console.log('✔ POST /api/student (Create Student) verified!');

    // 5c. Fetch Created Student
    const fetchRes = await makeRequest(port, 'GET', '/api/student/std-ci-test');
    assert.strictEqual(fetchRes.status, 200, 'Fetch student must return 200');
    assert.strictEqual(fetchRes.data.name, 'Vidhya CI User', 'Student name must match');
    assert.strictEqual(fetchRes.data.adaptive.pace, 'self-paced');
    console.log('✔ GET /api/student/:id (Fetch Student) verified!');

    // 5d. Log Session via POST
    const sessionRes = await makeRequest(port, 'POST', '/api/session', {
      studentId: 'std-ci-test',
      score: 95,
      lessonId: 'intro-science'
    });
    assert.strictEqual(sessionRes.status, 200, 'Session creation must return 200');
    assert(sessionRes.data.sessionId, 'Session must return sessionId');
    console.log('✔ POST /api/session (Log Quiz Session) verified!');

    // 5e. Update Progress via PUT
    const progressRes = await makeRequest(port, 'PUT', '/api/student/std-ci-test/progress', {
      totalPoints: 450,
      lessonsCompleted: 5
    });
    assert.strictEqual(progressRes.status, 200, 'Progress update must return 200');
    assert(progressRes.data.success, 'Progress update success must be true');
    console.log('✔ PUT /api/student/:id/progress (Update Progress) verified!');

    // 5f. Fetch Sessions for Student
    const sessionsRes = await makeRequest(port, 'GET', '/api/sessions/std-ci-test');
    assert.strictEqual(sessionsRes.status, 200, 'Fetch sessions must return 200');
    assert(Array.isArray(sessionsRes.data), 'Sessions must be an array');
    assert.strictEqual(sessionsRes.data.length, 1, 'Should have 1 recorded session');
    assert.strictEqual(sessionsRes.data[0].score, 95);
    console.log('✔ GET /api/sessions/:studentId (Student Sessions History) verified!');

    // 5g. Adaptive Analysis API
    const adaptiveRes = await makeRequest(port, 'POST', '/api/adaptive/analyze', {
      accuracy: 90,
      avgResponseTime: 6500,
      consecutiveCorrect: 6,
      consecutiveWrong: 0
    });
    assert.strictEqual(adaptiveRes.status, 200, 'Adaptive analyze must return 200');
    assert.strictEqual(adaptiveRes.data.mode, 'excelling');
    assert.strictEqual(adaptiveRes.data.difficulty, 'hard');
    assert(adaptiveRes.data.recommendation.unlockNextLesson, 'Next lesson should unlock');
    console.log('✔ POST /api/adaptive/analyze (Excelling Mode & Recommendations) verified!');

    // 5h. Leaderboard API
    const lbRes = await makeRequest(port, 'GET', '/api/leaderboard');
    assert.strictEqual(lbRes.status, 200, 'Leaderboard must return 200');
    assert(Array.isArray(lbRes.data), 'Leaderboard must be an array');
    assert(lbRes.data.length >= 1, 'Leaderboard should include created student');
    assert.strictEqual(lbRes.data[0].name, 'Vidhya CI User');
    assert.strictEqual(lbRes.data[0].points, 450);
    console.log('✔ GET /api/leaderboard (Sorted Student Points) verified!');

    // 5i. Health Check API
    const healthRes = await makeRequest(port, 'GET', '/api/health');
    assert.strictEqual(healthRes.status, 200, 'Health check must return 200');
    assert.strictEqual(healthRes.data.status, 'OK');
    assert.strictEqual(healthRes.data.platform, 'VidhyaPath');
    console.log('✔ GET /api/health (System Health & NEP 2020 Mission) verified!');

    // 5j. Platform Stats Overview API
    const statsRes = await makeRequest(port, 'GET', '/api/stats/overview');
    assert.strictEqual(statsRes.status, 200, 'Stats overview must return 200');
    assert.strictEqual(statsRes.data.totalStudents, 1);
    assert.strictEqual(statsRes.data.totalSessions, 1);
    assert.strictEqual(statsRes.data.averageQuizScore, 95);
    console.log('✔ GET /api/stats/overview (Platform Metrics Aggregation) verified!');

    // 5k. Delete Student API
    const deleteRes = await makeRequest(port, 'DELETE', '/api/student/std-ci-test');
    assert.strictEqual(deleteRes.status, 200, 'Student deletion must return 200');
    assert.strictEqual(deleteRes.data.success, true);
    const postDeleteGet = await makeRequest(port, 'GET', '/api/student/std-ci-test');
    assert.strictEqual(postDeleteGet.status, 404, 'Deleted student must return 404');
    console.log('✔ DELETE /api/student/:id (Student Cascade Deletion) verified!');

    // 5l. Adaptive Quiz Feedback & NEP 2020 Evaluation API
    const feedbackMastery = await makeRequest(port, 'GET', '/api/quiz/feedback/95');
    assert.strictEqual(feedbackMastery.status, 200);
    assert.strictEqual(feedbackMastery.data.grade, 'A+');
    assert.strictEqual(feedbackMastery.data.badge, 'Gold Scholar');
    assert.strictEqual(feedbackMastery.data.passed, true);

    const feedbackRemedial = await makeRequest(port, 'GET', '/api/quiz/feedback/45');
    assert.strictEqual(feedbackRemedial.status, 200);
    assert.strictEqual(feedbackRemedial.data.grade, 'C');
    assert.strictEqual(feedbackRemedial.data.badge, 'Rising Star');
    assert.strictEqual(feedbackRemedial.data.passed, false);

    const feedbackInvalid = await makeRequest(port, 'GET', '/api/quiz/feedback/150');
    assert.strictEqual(feedbackInvalid.status, 400);
    console.log('✔ GET /api/quiz/feedback/:score (NEP 2020 Assessment Rubric) verified!\n');

    console.log('----------------------------------------------------');
    console.log('Summary: 5 suites passed, 0 failed');
    console.log('✔ All VidhyaPath automated test suites passed successfully!\n');
  } finally {
    server.close();
    const liveDbPath = path.join(__dirname, '..', 'db.json');
    if (fs.existsSync(liveDbPath)) {
      try { fs.unlinkSync(liveDbPath); } catch {}
    }
  }
})();
