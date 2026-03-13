// ===== ADAPTIVE UI ENGINE =====
// Vikshit Bharat 2047 – Pillar 3: NEP 2020 & Skill India
// Dynamically adjusts UI based on learner performance

const AdaptiveUI = (() => {
  // ===== THRESHOLDS =====
  const THRESHOLDS = {
    STRUGGLING:    { accuracy: 50, responseTime: 25000 },  // < 50% OR > 25s
    PROGRESSING:   { accuracy: 65, responseTime: 18000 },  // 50–65%
    PERFORMING:    { accuracy: 80, responseTime: 12000 },  // 65–80%
    EXCELLING:     { accuracy: 80, responseTime: 8000  }   // > 80% AND < 8s
  };

  // UI Mode definitions
  const UI_MODES = {
    struggling: {
      name: "Support Mode",
      description: "Extra help enabled",
      emoji: "🌱",
      color: "#FF6B6B",
      actions: [
        "increaseFontSize",
        "enableSimpleMode",
        "enableHighContrast",
        "showHints",
        "reduceDifficulty",
        "slowTimer"
      ]
    },
    progressing: {
      name: "Learning Mode",
      description: "Steady progress",
      emoji: "🌿",
      color: "#FFB347",
      actions: [
        "normalFontSize",
        "showHints",
        "keepDifficulty"
      ]
    },
    performing: {
      name: "Challenge Mode",
      description: "Ready to advance",
      emoji: "🌳",
      color: "#6BCB77",
      actions: [
        "normalFontSize",
        "hideHints",
        "increaseDifficulty"
      ]
    },
    excelling: {
      name: "Advanced Mode",
      description: "Unlocking next level",
      emoji: "🚀",
      color: "#6C63FF",
      actions: [
        "normalFontSize",
        "disableSimpleMode",
        "disableHighContrast",
        "hideHints",
        "unlockNextLesson",
        "fastTimer"
      ]
    }
  };

  // ===== STATE =====
  let currentMode = "performing";
  let adaptationHistory = [];
  let isAdapting = false;

  // ===== MAIN ANALYSIS FUNCTION =====
  function analyze(sessionData) {
    const { accuracy, avgResponseTime, consecutiveWrong, consecutiveCorrect } = sessionData;

    let newMode;

    // Determine mode based on accuracy and speed
    if (accuracy < THRESHOLDS.STRUGGLING.accuracy || avgResponseTime > THRESHOLDS.STRUGGLING.responseTime) {
      newMode = "struggling";
    } else if (accuracy < THRESHOLDS.PROGRESSING.accuracy) {
      newMode = "progressing";
    } else if (accuracy >= THRESHOLDS.EXCELLING.accuracy && avgResponseTime <= THRESHOLDS.EXCELLING.responseTime) {
      newMode = "excelling";
    } else {
      newMode = "performing";
    }

    // Override based on streaks
    if (consecutiveWrong >= 3) newMode = "struggling";
    if (consecutiveCorrect >= 5) newMode = newMode === "struggling" ? "progressing" : newMode;
    if (consecutiveCorrect >= 8) newMode = "excelling";

    // Only adapt if mode changed
    if (newMode !== currentMode) {
      adaptUI(newMode, sessionData);
    }

    return newMode;
  }

  // ===== APPLY ADAPTATION =====
  function adaptUI(mode, sessionData) {
    if (isAdapting) return;
    isAdapting = true;

    const prevMode = currentMode;
    currentMode = mode;

    const modeConfig = UI_MODES[mode];

    // Record history
    adaptationHistory.push({
      timestamp: Date.now(),
      from: prevMode,
      to: mode,
      trigger: sessionData
    });

    // Show adaptive notification
    showAdaptiveNotification(modeConfig);

    // Execute actions
    modeConfig.actions.forEach(action => executeAction(action));

    // Update adaptive indicator
    App.updateAdaptiveIndicator(mode, modeConfig.emoji + ' ' + modeConfig.name);

    // Save to profile
    App.updateAdaptive({ uiMode: mode });

    // Log for dashboard
    logAdaptation(mode, sessionData);

    setTimeout(() => { isAdapting = false; }, 2000);
  }

  // ===== ACTION EXECUTOR =====
  function executeAction(action) {
    const profile = App.getProfile();
    const body = document.body;

    switch(action) {
      case 'increaseFontSize':
        if (profile.settings.fontSize === 'normal') {
          profile.settings.fontSize = 'large';
          App.saveProfile();
          body.setAttribute('data-font', 'large');
        } else if (profile.settings.fontSize === 'large') {
          profile.settings.fontSize = 'xl';
          App.saveProfile();
          body.setAttribute('data-font', 'xl');
        }
        break;

      case 'normalFontSize':
        profile.settings.fontSize = 'normal';
        App.saveProfile();
        body.setAttribute('data-font', 'normal');
        break;

      case 'enableSimpleMode':
        if (!profile.settings.simpleMode) {
          profile.settings.simpleMode = true;
          App.saveProfile();
          body.classList.add('mode-simple');
          document.getElementById('btn-simple')?.classList.add('active');
        }
        break;

      case 'disableSimpleMode':
        if (profile.settings.simpleMode) {
          profile.settings.simpleMode = false;
          App.saveProfile();
          body.classList.remove('mode-simple');
          document.getElementById('btn-simple')?.classList.remove('active');
        }
        break;

      case 'enableHighContrast':
        if (!profile.settings.highContrast) {
          profile.settings.highContrast = true;
          App.saveProfile();
          body.classList.add('mode-high-contrast');
          document.getElementById('btn-contrast')?.classList.add('active');
        }
        break;

      case 'disableHighContrast':
        if (profile.settings.highContrast) {
          profile.settings.highContrast = false;
          App.saveProfile();
          body.classList.remove('mode-high-contrast');
          document.getElementById('btn-contrast')?.classList.remove('active');
        }
        break;

      case 'showHints':
        document.querySelectorAll('.hint-element').forEach(el => {
          el.style.display = 'flex';
        });
        break;

      case 'hideHints':
        document.querySelectorAll('.hint-element').forEach(el => {
          el.style.display = 'none';
        });
        break;

      case 'reduceDifficulty':
        if (typeof QuizEngine !== 'undefined') {
          QuizEngine.setDifficulty('easy');
        }
        break;

      case 'keepDifficulty':
        if (typeof QuizEngine !== 'undefined') {
          QuizEngine.setDifficulty('medium');
        }
        break;

      case 'increaseDifficulty':
        if (typeof QuizEngine !== 'undefined') {
          QuizEngine.setDifficulty('medium');
        }
        break;

      case 'unlockNextLesson':
        if (typeof ProgressTracker !== 'undefined') {
          ProgressTracker.unlockNextLesson();
        }
        break;

      case 'slowTimer':
        if (typeof QuizEngine !== 'undefined') {
          QuizEngine.setTimerMultiplier(1.5);
        }
        break;

      case 'fastTimer':
        if (typeof QuizEngine !== 'undefined') {
          QuizEngine.setTimerMultiplier(0.85);
        }
        break;
    }
  }

  // ===== VISUAL NOTIFICATION =====
  function showAdaptiveNotification(modeConfig) {
    const notif = document.createElement('div');
    notif.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      border: 3px solid ${modeConfig.color};
      border-radius: 20px;
      padding: 16px 28px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 9999;
      font-family: var(--font-display, 'Baloo 2', cursive);
      font-size: 18px;
      font-weight: 700;
      color: ${modeConfig.color};
      animation: notifIn 0.4s cubic-bezier(0.34,1.56,0.64,1);
    `;

    notif.innerHTML = `
      <span style="font-size:28px">${modeConfig.emoji}</span>
      <div>
        <div style="font-size:16px;font-weight:800">${modeConfig.name} Activated</div>
        <div style="font-size:13px;color:#888;font-weight:500">${modeConfig.description}</div>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `@keyframes notifIn { from{opacity:0;transform:translateX(-50%) translateY(20px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }`;
    document.head.appendChild(style);

    document.body.appendChild(notif);
    setTimeout(() => {
      notif.style.transition = 'opacity 0.4s ease';
      notif.style.opacity = '0';
      setTimeout(() => { notif.remove(); style.remove(); }, 400);
    }, 3000);
  }

  // ===== LOG ADAPTATION =====
  function logAdaptation(mode, data) {
    const profile = App.getProfile();
    const history = profile.progress.sessionHistory || [];
    history.push({
      date: new Date().toISOString(),
      mode,
      accuracy: data.accuracy,
      avgTime: data.avgResponseTime
    });

    // Keep last 100 entries
    if (history.length > 100) history.splice(0, history.length - 100);
    App.updateProgress({ sessionHistory: history });
  }

  // ===== FORCE MODE (Manual Override) =====
  function forceMode(mode) {
    adaptUI(mode, { accuracy: 75, avgResponseTime: 10000, consecutiveWrong: 0, consecutiveCorrect: 0 });
  }

  // ===== DIFFICULTY MAP =====
  function getDifficultyFromMode(mode) {
    const map = {
      struggling: 'easy',
      progressing: 'easy',
      performing: 'medium',
      excelling: 'hard'
    };
    return map[mode] || 'medium';
  }

  function getCurrentMode() { return currentMode; }
  function getModeConfig() { return UI_MODES[currentMode]; }
  function getHistory() { return adaptationHistory; }
  function getModeColor(mode) { return UI_MODES[mode]?.color || '#6C63FF'; }
  function getModeEmoji(mode) { return UI_MODES[mode]?.emoji || '📚'; }

  return {
    analyze,
    adaptUI,
    forceMode,
    getCurrentMode,
    getModeConfig,
    getDifficultyFromMode,
    getHistory,
    getModeColor,
    getModeEmoji,
    THRESHOLDS,
    UI_MODES
  };
})();
