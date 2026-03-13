// ===== APP.JS - VIKSHIT BHARAT 2047 ADAPTIVE LEARNING PLATFORM =====
// Core application initialization and state management

const App = (() => {
  // ===== STUDENT PROFILE =====
  const DEFAULT_PROFILE = {
    name: "Learner",
    avatar: "🧒",
    level: 1,
    totalPoints: 0,
    streak: 0,
    lastActive: null,
    settings: {
      ttsEnabled: false,
      dyslexiaFont: false,
      highContrast: false,
      simpleMode: false,
      focusMode: false,
      darkMode: false,
      fontSize: "normal"
    },
    progress: {
      lessonsCompleted: 0,
      quizzesCompleted: 0,
      totalCorrect: 0,
      totalQuestions: 0,
      sessionHistory: []
    },
    adaptive: {
      currentDifficulty: "medium",
      uiMode: "normal",
      accuracyHistory: [],
      speedHistory: [],
      avgResponseTime: 0,
      consecutiveCorrect: 0,
      consecutiveWrong: 0
    }
  };

  // ===== STATE =====
  let studentProfile = null;
  let ttsUtterance = null;
  let isSpeaking = false;

  // ===== INIT =====
  function init() {
    loadProfile();
    applySettings();
    setupEventListeners();
    updateNavUI();
    showToast("🌟 Welcome to VidhyaPath!", "Welcome back, " + studentProfile.name + "!", "success");
  }

  // ===== PROFILE MANAGEMENT =====
  function loadProfile() {
    const saved = localStorage.getItem('vp_student_profile');
    if (saved) {
      try {
        studentProfile = { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
        // Deep merge settings and adaptive
        studentProfile.settings = { ...DEFAULT_PROFILE.settings, ...studentProfile.settings };
        studentProfile.adaptive = { ...DEFAULT_PROFILE.adaptive, ...studentProfile.adaptive };
        studentProfile.progress = { ...DEFAULT_PROFILE.progress, ...studentProfile.progress };
      } catch(e) {
        studentProfile = JSON.parse(JSON.stringify(DEFAULT_PROFILE));
      }
    } else {
      studentProfile = JSON.parse(JSON.stringify(DEFAULT_PROFILE));
      // Welcome new user
      studentProfile.name = promptForName();
      saveProfile();
    }
    studentProfile.lastActive = new Date().toISOString();
    saveProfile();
  }

  function promptForName() {
    return "Young Learner";
  }

  function saveProfile() {
    localStorage.setItem('vp_student_profile', JSON.stringify(studentProfile));
  }

  function getProfile() { return studentProfile; }

  function updateProfile(updates) {
    Object.assign(studentProfile, updates);
    saveProfile();
  }

  function updateAdaptive(updates) {
    Object.assign(studentProfile.adaptive, updates);
    saveProfile();
  }

  function updateProgress(updates) {
    Object.assign(studentProfile.progress, updates);
    saveProfile();
  }

  // ===== SETTINGS APPLICATION =====
  function applySettings() {
    const { settings } = studentProfile;
    const body = document.body;

    body.classList.toggle('mode-dyslexia',   settings.dyslexiaFont);
    body.classList.toggle('mode-high-contrast', settings.highContrast);
    body.classList.toggle('mode-simple',     settings.simpleMode);
    body.classList.toggle('mode-focus',      settings.focusMode);

    if (settings.darkMode) body.setAttribute('data-theme', 'dark');
    else body.removeAttribute('data-theme');

    body.setAttribute('data-font', settings.fontSize || 'normal');
  }

  function toggleSetting(key) {
    studentProfile.settings[key] = !studentProfile.settings[key];
    saveProfile();
    applySettings();
    return studentProfile.settings[key];
  }

  // ===== TEXT TO SPEECH =====
  function speak(text) {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    if (isSpeaking) {
      isSpeaking = false;
      updateTTSIndicator(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.85;
    utterance.pitch = 1.1;

    // Prefer a child-friendly voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female'))
                   || voices.find(v => v.lang.startsWith('en'))
                   || voices[0];
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => {
      isSpeaking = true;
      updateTTSIndicator(true);
    };

    utterance.onend = () => {
      isSpeaking = false;
      updateTTSIndicator(false);
    };

    utterance.onerror = () => {
      isSpeaking = false;
      updateTTSIndicator(false);
    };

    ttsUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  function updateTTSIndicator(active) {
    const ttsBtn = document.getElementById('tts-btn');
    const ttsLabel = document.getElementById('tts-label');
    if (ttsBtn) ttsBtn.classList.toggle('active', active);
    if (ttsLabel) {
      ttsLabel.innerHTML = active
        ? `<span class="tts-indicator">
             <span class="tts-bar"></span>
             <span class="tts-bar"></span>
             <span class="tts-bar"></span>
             <span class="tts-bar"></span>
             <span class="tts-bar"></span>
           </span>`
        : '🔊';
    }
  }

  // ===== TOASTS =====
  function showToast(title, message, type = 'info', duration = 3500) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = { success: '✅', warning: '⚠️', danger: '❌', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span style="font-size:22px">${icons[type] || '📢'}</span>
      <div>
        <div style="font-weight:700;font-size:14px">${title}</div>
        <div style="font-size:13px;color:var(--text-secondary)">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // ===== EVENT LISTENERS =====
  function setupEventListeners() {
    // A11y toolbar buttons
    const a11yButtons = {
      'btn-dyslexia':     () => handleDyslexiaToggle(),
      'btn-contrast':     () => handleContrastToggle(),
      'btn-simple':       () => handleSimpleToggle(),
      'btn-focus':        () => handleFocusToggle(),
      'btn-font-up':      () => handleFontUp(),
      'btn-font-down':    () => handleFontDown(),
      'btn-dark':         () => handleDarkToggle(),
      'tts-btn':          () => speakPageContent()
    };

    Object.entries(a11yButtons).forEach(([id, fn]) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', fn);
    });

    // Keyboard navigation detection
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') document.body.classList.add('keyboard-nav-active');
    });
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-nav-active');
    });
  }

  function handleDyslexiaToggle() {
    const active = toggleSetting('dyslexiaFont');
    showToast(active ? '📖 Dyslexia Font ON' : '📖 Dyslexia Font OFF',
              active ? 'Using dyslexia-friendly font' : 'Switched to standard font',
              active ? 'success' : 'info');
    document.getElementById('btn-dyslexia')?.classList.toggle('active', active);
  }

  function handleContrastToggle() {
    const active = toggleSetting('highContrast');
    showToast(active ? '🌗 High Contrast ON' : '🌗 High Contrast OFF',
              active ? 'Maximum visibility enabled' : 'Standard contrast restored',
              active ? 'success' : 'info');
    document.getElementById('btn-contrast')?.classList.toggle('active', active);
  }

  function handleSimpleToggle() {
    const active = toggleSetting('simpleMode');
    showToast(active ? '🧘 Simple Mode ON' : '🧘 Simple Mode OFF',
              active ? 'Reduced visual complexity' : 'Full interface restored',
              active ? 'success' : 'info');
    document.getElementById('btn-simple')?.classList.toggle('active', active);
  }

  function handleFocusToggle() {
    const active = toggleSetting('focusMode');
    showToast(active ? '🎯 Focus Mode ON' : '🎯 Focus Mode OFF',
              active ? 'Distraction-free learning' : 'Normal mode restored',
              active ? 'success' : 'info');
    document.getElementById('btn-focus')?.classList.toggle('active', active);
  }

  function handleDarkToggle() {
    const active = toggleSetting('darkMode');
    showToast(active ? '🌙 Dark Mode ON' : '☀️ Light Mode ON',
              active ? 'Night mode activated' : 'Day mode activated',
              'info');
    document.getElementById('btn-dark')?.classList.toggle('active', active);
  }

  function handleFontUp() {
    const sizes = ['normal', 'large', 'xl'];
    const current = studentProfile.settings.fontSize || 'normal';
    const idx = sizes.indexOf(current);
    if (idx < sizes.length - 1) {
      studentProfile.settings.fontSize = sizes[idx + 1];
      saveProfile();
      applySettings();
      showToast('🔤 Font Larger', 'Text size increased', 'info');
    }
  }

  function handleFontDown() {
    const sizes = ['normal', 'large', 'xl'];
    const current = studentProfile.settings.fontSize || 'normal';
    const idx = sizes.indexOf(current);
    if (idx > 0) {
      studentProfile.settings.fontSize = sizes[idx - 1];
      saveProfile();
      applySettings();
      showToast('🔤 Font Smaller', 'Text size decreased', 'info');
    }
  }

  function speakPageContent() {
    const main = document.querySelector('.reading-text, .question-text, .concept-body, main');
    if (main) speak(main.innerText);
    else speak("Welcome to VidhyaPath, the adaptive learning platform.");
  }

  // ===== NAV UI =====
  function updateNavUI() {
    const profile = studentProfile;

    // Update name displays
    document.querySelectorAll('.student-name').forEach(el => {
      el.textContent = profile.name;
    });

    // Points
    document.querySelectorAll('.student-points').forEach(el => {
      el.textContent = profile.totalPoints + ' pts';
    });

    // Streak
    document.querySelectorAll('.student-streak').forEach(el => {
      el.textContent = profile.streak + ' 🔥';
    });

    // Sync toolbar button states
    const settingMap = {
      'btn-dyslexia': 'dyslexiaFont',
      'btn-contrast': 'highContrast',
      'btn-simple':   'simpleMode',
      'btn-focus':    'focusMode',
      'btn-dark':     'darkMode'
    };

    Object.entries(settingMap).forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle('active', !!profile.settings[key]);
    });
  }

  // ===== ADAPTIVE INDICATOR =====
  function updateAdaptiveIndicator(mode, message) {
    const indicator = document.getElementById('adaptive-indicator');
    if (!indicator) return;

    const dot = indicator.querySelector('.adaptive-dot');
    const text = indicator.querySelector('.adaptive-text');

    if (dot) {
      dot.className = 'adaptive-dot';
      if (mode === 'struggling') dot.classList.add('danger');
      else if (mode === 'progressing') dot.classList.add('warning');
    }

    if (text) text.textContent = message;
  }

  // ===== POINTS =====
  function addPoints(pts) {
    studentProfile.totalPoints += pts;
    saveProfile();
    updateNavUI();
    animatePoints(pts);
  }

  function animatePoints(pts) {
    const el = document.createElement('div');
    el.textContent = `+${pts} pts ⭐`;
    el.style.cssText = `
      position:fixed; top:80px; right:80px; z-index:9999;
      font-family:var(--font-display); font-size:24px; font-weight:800;
      color:var(--primary); animation: floatUp 1.2s ease forwards;
      pointer-events:none;
    `;
    document.body.appendChild(el);

    const style = document.createElement('style');
    style.textContent = `@keyframes floatUp { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(-60px)} }`;
    document.head.appendChild(style);

    setTimeout(() => { el.remove(); style.remove(); }, 1300);
  }

  // ===== HELPER UTILITIES =====
  function formatTime(ms) {
    if (ms < 60000) return Math.round(ms/1000) + 's';
    return Math.round(ms/60000) + 'm ' + Math.round((ms%60000)/1000) + 's';
  }

  function getAccuracyRate() {
    const { totalCorrect, totalQuestions } = studentProfile.progress;
    if (totalQuestions === 0) return 0;
    return Math.round((totalCorrect / totalQuestions) * 100);
  }

  // ===== PUBLIC API =====
  return {
    init,
    getProfile,
    updateProfile,
    updateAdaptive,
    updateProgress,
    saveProfile,
    applySettings,
    speak,
    showToast,
    addPoints,
    updateAdaptiveIndicator,
    getAccuracyRate,
    formatTime
  };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => App.init());
