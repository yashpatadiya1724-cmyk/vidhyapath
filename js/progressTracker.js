// ===== PROGRESS TRACKER =====
// Vikshit Bharat 2047 – Adaptive Learning Platform
// Tracks student progress, lesson completion, and generates insights

const ProgressTracker = (() => {
  // ===== LESSON CATALOG =====
  const LESSONS = [
    {
      id: "lesson_1",
      title: "Numbers & Counting",
      subject: "math",
      emoji: "🔢",
      color: "#6C63FF",
      description: "Learn about numbers, counting, and basic arithmetic",
      concepts: 4,
      duration: "15 min",
      difficulty: "easy",
      prerequisite: null,
      locked: false
    },
    {
      id: "lesson_2",
      title: "Shapes & Geometry",
      subject: "math",
      emoji: "📐",
      color: "#FF6B9D",
      description: "Explore 2D and 3D shapes, areas and perimeters",
      concepts: 5,
      duration: "20 min",
      difficulty: "easy",
      prerequisite: "lesson_1",
      locked: true
    },
    {
      id: "lesson_3",
      title: "Plants & Photosynthesis",
      subject: "science",
      emoji: "🌱",
      color: "#6BCB77",
      description: "Discover how plants make food using sunlight",
      concepts: 4,
      duration: "18 min",
      difficulty: "easy",
      prerequisite: null,
      locked: false
    },
    {
      id: "lesson_4",
      title: "Solar System",
      subject: "science",
      emoji: "🪐",
      color: "#4ECDC4",
      description: "Journey through the planets of our solar system",
      concepts: 8,
      duration: "25 min",
      difficulty: "medium",
      prerequisite: "lesson_3",
      locked: true
    },
    {
      id: "lesson_5",
      title: "Digital Skills Basics",
      subject: "skills",
      emoji: "💻",
      color: "#FFD93D",
      description: "Introduction to computers and digital technology",
      concepts: 4,
      duration: "15 min",
      difficulty: "easy",
      prerequisite: null,
      locked: false
    },
    {
      id: "lesson_6",
      title: "Fractions & Decimals",
      subject: "math",
      emoji: "½",
      color: "#FF8C00",
      description: "Understanding fractions, decimals and percentages",
      concepts: 6,
      duration: "25 min",
      difficulty: "medium",
      prerequisite: "lesson_2",
      locked: true
    },
    {
      id: "lesson_7",
      title: "Forces & Motion",
      subject: "science",
      emoji: "⚡",
      color: "#9B59B6",
      description: "Newton's laws, gravity and everyday forces",
      concepts: 5,
      duration: "22 min",
      difficulty: "medium",
      prerequisite: "lesson_4",
      locked: true
    },
    {
      id: "lesson_8",
      title: "Coding & Problem Solving",
      subject: "skills",
      emoji: "🤖",
      color: "#E74C3C",
      description: "Introduction to programming concepts and logical thinking",
      concepts: 6,
      duration: "30 min",
      difficulty: "hard",
      prerequisite: "lesson_5",
      locked: true
    }
  ];

  // ===== COMPLETION TRACKING =====
  function getLessonStatus() {
    const profile = App.getProfile();
    const completed = profile.progress.completedLessons || [];
    return LESSONS.map(lesson => ({
      ...lesson,
      completed: completed.includes(lesson.id),
      locked: lesson.locked && !isUnlocked(lesson, completed)
    }));
  }

  function isUnlocked(lesson, completed) {
    if (!lesson.prerequisite) return true;
    return completed.includes(lesson.prerequisite);
  }

  function completeLesson(lessonId) {
    const profile = App.getProfile();
    const completed = profile.progress.completedLessons || [];
    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
      App.updateProgress({
        completedLessons: completed,
        lessonsCompleted: completed.length
      });
      App.addPoints(50);
      checkAchievements(completed);
      App.showToast('🎓 Lesson Complete!', 'Great work! +50 points earned', 'success');
    }
    return completed;
  }

  function unlockNextLesson() {
    const profile = App.getProfile();
    const completed = profile.progress.completedLessons || [];
    const lessons = getLessonStatus();
    const nextLocked = lessons.find(l => l.locked && !l.completed);
    if (nextLocked) {
      App.showToast('🔓 Lesson Unlocked!', nextLocked.title + ' is now available!', 'success');
    }
  }

  // ===== ACHIEVEMENTS =====
  const ACHIEVEMENTS = [
    { id: 'first_lesson', title: 'First Steps 🐣', desc: 'Complete your first lesson', condition: (c) => c.length >= 1 },
    { id: 'three_lessons', title: 'On a Roll! 🎯', desc: 'Complete 3 lessons', condition: (c) => c.length >= 3 },
    { id: 'all_easy', title: 'Easy Explorer 🌟', desc: 'Complete all easy lessons', condition: (c) => {
      const easyIds = LESSONS.filter(l => l.difficulty === 'easy').map(l => l.id);
      return easyIds.every(id => c.includes(id));
    }}
  ];

  function checkAchievements(completed) {
    const profile = App.getProfile();
    const earned = profile.progress.achievements || [];

    ACHIEVEMENTS.forEach(a => {
      if (!earned.includes(a.id) && a.condition(completed)) {
        earned.push(a.id);
        App.updateProgress({ achievements: earned });
        showAchievement(a);
      }
    });
  }

  function showAchievement(achievement) {
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed; top:100px; left:50%; transform:translateX(-50%);
      background: linear-gradient(135deg, #6C63FF, #FF6B9D);
      color:white; padding:20px 32px; border-radius:20px;
      text-align:center; box-shadow:0 16px 48px rgba(108,99,255,0.4);
      z-index:9999; animation: achieveIn 0.5s cubic-bezier(0.34,1.56,0.64,1);
      font-family: var(--font-display, 'Baloo 2', cursive);
    `;
    el.innerHTML = `
      <div style="font-size:32px;margin-bottom:8px">🏆</div>
      <div style="font-size:20px;font-weight:800">${achievement.title}</div>
      <div style="font-size:14px;opacity:0.85">${achievement.desc}</div>
    `;

    const style = document.createElement('style');
    style.textContent = `@keyframes achieveIn { from{opacity:0;transform:translateX(-50%) scale(0.6)} to{opacity:1;transform:translateX(-50%) scale(1)} }`;
    document.head.appendChild(style);
    document.body.appendChild(el);

    setTimeout(() => {
      el.style.transition = 'all 0.4s ease';
      el.style.opacity = '0';
      el.style.transform = 'translateX(-50%) scale(0.8)';
      setTimeout(() => { el.remove(); style.remove(); }, 400);
    }, 3500);
  }

  // ===== STATS COMPUTATION =====
  function getStats() {
    const profile = App.getProfile();
    const lessons = getLessonStatus();
    const { totalCorrect, totalQuestions, quizzesCompleted } = profile.progress;

    return {
      lessonsCompleted: lessons.filter(l => l.completed).length,
      totalLessons: lessons.length,
      lessonsProgress: Math.round((lessons.filter(l => l.completed).length / lessons.length) * 100),
      quizzesCompleted: quizzesCompleted || 0,
      overallAccuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
      totalPoints: profile.totalPoints || 0,
      streak: profile.streak || 0,
      currentMode: AdaptiveUI.getCurrentMode(),
      difficultyLevel: AdaptiveUI.getDifficultyFromMode(AdaptiveUI.getCurrentMode())
    };
  }

  // ===== WEEKLY DATA =====
  function getWeeklyData() {
    const history = App.getProfile().progress.sessionHistory || [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - i));
      const dateStr = date.toDateString();

      const daySessions = history.filter(s => new Date(s.date).toDateString() === dateStr);
      const avgAccuracy = daySessions.length > 0
        ? Math.round(daySessions.reduce((a, s) => a + (s.accuracy || 0), 0) / daySessions.length)
        : 0;

      return {
        day: days[date.getDay()],
        accuracy: avgAccuracy,
        sessions: daySessions.length
      };
    });
  }

  // ===== ACCURACY TREND =====
  function getAccuracyTrend() {
    const history = App.getProfile().adaptive.accuracyHistory || [];
    return history.slice(-10).map((acc, i) => ({ quiz: i + 1, accuracy: acc }));
  }

  // ===== RENDER LESSON CARDS =====
  function renderLessonCards(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const lessons = getLessonStatus();

    container.innerHTML = lessons.map(lesson => `
      <${lesson.locked ? 'div' : 'a'}
        ${!lesson.locked ? `href="lesson.html?id=${lesson.id}"` : ''}
        class="lesson-card ${lesson.locked ? 'locked' : ''}"
        style="text-decoration:none;${lesson.locked ? 'opacity:0.6;cursor:not-allowed' : ''}"
      >
        <div class="lesson-thumb" style="background:linear-gradient(135deg, ${lesson.color}22, ${lesson.color}44)">
          <span style="font-size:64px">${lesson.emoji}</span>
          ${lesson.completed ? '<div style="position:absolute;top:12px;right:12px;background:#6BCB77;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:16px">✓</div>' : ''}
          ${lesson.locked ? '<div style="position:absolute;top:12px;right:12px;font-size:24px">🔒</div>' : ''}
        </div>
        <div class="lesson-body">
          <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px">
            <h4>${lesson.title}</h4>
            <span class="badge badge-${lesson.difficulty === 'easy' ? 'success' : lesson.difficulty === 'medium' ? 'warning' : 'danger'}"
                  style="margin-left:8px;flex-shrink:0">
              ${lesson.difficulty}
            </span>
          </div>
          <p>${lesson.description}</p>
          <div class="lesson-meta">
            <div style="display:flex;gap:12px">
              <span style="font-size:13px;color:var(--text-muted)">⏱ ${lesson.duration}</span>
              <span style="font-size:13px;color:var(--text-muted)">📚 ${lesson.concepts} concepts</span>
            </div>
            <span class="badge badge-${lesson.subject === 'math' ? 'primary' : lesson.subject === 'science' ? 'info' : 'warning'}">
              ${lesson.subject}
            </span>
          </div>
        </div>
      </${lesson.locked ? 'div' : 'a'}>
    `).join('');
  }

  return {
    getLessonStatus,
    completeLesson,
    unlockNextLesson,
    getStats,
    getWeeklyData,
    getAccuracyTrend,
    renderLessonCards,
    LESSONS
  };
})();
