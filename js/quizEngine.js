// ===== QUIZ ENGINE =====
// Vikshit Bharat 2047 – Adaptive Learning Platform
// Handles all quiz logic, timing, scoring and adaptive difficulty

const QuizEngine = (() => {
  // ===== QUESTION BANKS =====
  const QUESTIONS = {
    math: {
      easy: [
        {
          id: "m_e1",
          text: "What is 3 + 5?",
          emoji: "🔢",
          options: ["6", "8", "7", "9"],
          correct: 1,
          hint: "Count on your fingers: 3 + 5"
        },
        {
          id: "m_e2",
          text: "What is 10 - 4?",
          emoji: "➖",
          options: ["5", "7", "6", "4"],
          correct: 2,
          hint: "Start at 10 and count back 4 steps"
        },
        {
          id: "m_e3",
          text: "How many sides does a square have?",
          emoji: "⬜",
          options: ["3", "5", "4", "6"],
          correct: 2,
          hint: "Think of a box shape"
        },
        {
          id: "m_e4",
          text: "What is 2 × 3?",
          emoji: "✖️",
          options: ["5", "6", "7", "8"],
          correct: 1,
          hint: "2 groups of 3 objects"
        },
        {
          id: "m_e5",
          text: "Which number is the biggest?",
          emoji: "🔝",
          options: ["15", "9", "21", "18"],
          correct: 2,
          hint: "Numbers with 2 digits can be bigger"
        }
      ],
      medium: [
        {
          id: "m_m1",
          text: "What is 12 × 7?",
          emoji: "🔢",
          options: ["84", "74", "76", "82"],
          correct: 0,
          hint: "12×7 = 10×7 + 2×7"
        },
        {
          id: "m_m2",
          text: "If a train travels 60 km per hour, how far in 3 hours?",
          emoji: "🚂",
          options: ["120 km", "180 km", "160 km", "200 km"],
          correct: 1,
          hint: "Speed × Time = Distance"
        },
        {
          id: "m_m3",
          text: "What is 25% of 200?",
          emoji: "📊",
          options: ["40", "60", "50", "45"],
          correct: 2,
          hint: "25% means 1/4 of the number"
        },
        {
          id: "m_m4",
          text: "Solve: 3x = 18. What is x?",
          emoji: "🔣",
          options: ["5", "4", "7", "6"],
          correct: 3,
          hint: "Divide both sides by 3"
        },
        {
          id: "m_m5",
          text: "What is the area of a rectangle 8m × 5m?",
          emoji: "📐",
          options: ["26 m²", "40 m²", "35 m²", "45 m²"],
          correct: 1,
          hint: "Area = Length × Width"
        }
      ],
      hard: [
        {
          id: "m_h1",
          text: "Find the value of √144",
          emoji: "√",
          options: ["11", "14", "12", "13"],
          correct: 2,
          hint: "Which number × itself = 144?"
        },
        {
          id: "m_h2",
          text: "A shopkeeper gives 15% discount on ₹800. Final price?",
          emoji: "🛒",
          options: ["₹700", "₹680", "₹660", "₹720"],
          correct: 1,
          hint: "Discount = 15/100 × 800, then subtract"
        },
        {
          id: "m_h3",
          text: "What is the LCM of 12 and 18?",
          emoji: "🔢",
          options: ["24", "30", "36", "42"],
          correct: 2,
          hint: "LCM = smallest common multiple"
        },
        {
          id: "m_h4",
          text: "If 5 workers finish a job in 12 days, how long for 4 workers?",
          emoji: "👷",
          options: ["10 days", "16 days", "15 days", "14 days"],
          correct: 2,
          hint: "Inverse proportion: more workers = less days"
        },
        {
          id: "m_h5",
          text: "What is the compound interest on ₹1000 at 10% for 2 years?",
          emoji: "💰",
          options: ["₹200", "₹210", "₹220", "₹190"],
          correct: 1,
          hint: "CI = P(1+r/100)^n - P"
        }
      ]
    },
    science: {
      easy: [
        {
          id: "s_e1",
          text: "What do plants need to make their own food?",
          emoji: "🌱",
          options: ["Moonlight", "Sunlight", "Starlight", "Firelight"],
          correct: 1,
          hint: "Plants stand outside in the daytime for a reason!"
        },
        {
          id: "s_e2",
          text: "What is the center of our Solar System?",
          emoji: "☀️",
          options: ["Moon", "Earth", "Sun", "Mars"],
          correct: 2,
          hint: "It's the big bright ball in the sky"
        },
        {
          id: "s_e3",
          text: "Which animal is a mammal?",
          emoji: "🐾",
          options: ["Shark", "Eagle", "Snake", "Dolphin"],
          correct: 3,
          hint: "Mammals feed milk to their babies"
        },
        {
          id: "s_e4",
          text: "What is water made of?",
          emoji: "💧",
          options: ["Carbon & Oxygen", "Nitrogen & Oxygen", "Hydrogen & Oxygen", "Hydrogen & Carbon"],
          correct: 2,
          hint: "H₂O – the H stands for Hydrogen"
        },
        {
          id: "s_e5",
          text: "How many bones are in an adult human body?",
          emoji: "🦴",
          options: ["106", "306", "206", "406"],
          correct: 2,
          hint: "It's a 3-digit number starting with 2"
        }
      ],
      medium: [
        {
          id: "s_m1",
          text: "What is the process by which plants make food using sunlight?",
          emoji: "🌿",
          options: ["Respiration", "Digestion", "Photosynthesis", "Germination"],
          correct: 2,
          hint: "Photo = light, synthesis = making"
        },
        {
          id: "s_m2",
          text: "Which planet has the most moons in our Solar System?",
          emoji: "🪐",
          options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
          correct: 1,
          hint: "This planet has rings AND many moons"
        },
        {
          id: "s_m3",
          text: "What is the chemical symbol for Gold?",
          emoji: "🥇",
          options: ["Go", "Gd", "Gl", "Au"],
          correct: 3,
          hint: "From Latin 'Aurum'"
        },
        {
          id: "s_m4",
          text: "Which force pulls objects towards the Earth?",
          emoji: "🍎",
          options: ["Magnetism", "Gravity", "Friction", "Pressure"],
          correct: 1,
          hint: "Newton discovered this when an apple fell"
        },
        {
          id: "s_m5",
          text: "What is the hardest natural substance?",
          emoji: "💎",
          options: ["Steel", "Iron", "Diamond", "Quartz"],
          correct: 2,
          hint: "It's used in jewelry and drills"
        }
      ],
      hard: [
        {
          id: "s_h1",
          text: "What is the speed of light in a vacuum?",
          emoji: "💡",
          options: ["2.8×10⁸ m/s", "3×10⁸ m/s", "3.5×10⁸ m/s", "2.5×10⁸ m/s"],
          correct: 1,
          hint: "Approximately 300,000 km per second"
        },
        {
          id: "s_h2",
          text: "Which part of the cell is responsible for protein synthesis?",
          emoji: "🔬",
          options: ["Mitochondria", "Nucleus", "Ribosome", "Golgi body"],
          correct: 2,
          hint: "RNA carries genetic code here"
        },
        {
          id: "s_h3",
          text: "What is Newton's Second Law of Motion?",
          emoji: "⚡",
          options: ["F = mv", "F = ma", "F = m/a", "F = m+a"],
          correct: 1,
          hint: "Force equals mass times ___"
        },
        {
          id: "s_h4",
          text: "What does DNA stand for?",
          emoji: "🧬",
          options: [
            "Deoxyribonucleic Acid",
            "Deoxyribonuclear Acid",
            "Dextronucleic Acid",
            "Dinucleic Acid"
          ],
          correct: 0,
          hint: "It contains 'deoxy' and 'nucleic'"
        },
        {
          id: "s_h5",
          text: "Which organelle is called the 'powerhouse of the cell'?",
          emoji: "⚡",
          options: ["Nucleus", "Ribosome", "Chloroplast", "Mitochondria"],
          correct: 3,
          hint: "It produces ATP energy"
        }
      ]
    },
    skills: {
      easy: [
        {
          id: "sk_e1",
          text: "Which of these is a digital skill?",
          emoji: "💻",
          options: ["Swimming", "Typing", "Painting", "Singing"],
          correct: 1,
          hint: "Used to operate computers"
        },
        {
          id: "sk_e2",
          text: "What does saving a file mean?",
          emoji: "💾",
          options: [
            "Deleting it",
            "Printing it",
            "Storing it for later",
            "Sending it"
          ],
          correct: 2,
          hint: "You do this so you don't lose your work"
        },
        {
          id: "sk_e3",
          text: "Which skill is important to become an entrepreneur?",
          emoji: "💡",
          options: ["Problem Solving", "Sleeping", "Watching TV", "Complaining"],
          correct: 0,
          hint: "Finding solutions to challenges"
        }
      ],
      medium: [
        {
          id: "sk_m1",
          text: "What is the first step in Design Thinking?",
          emoji: "🎨",
          options: ["Test", "Build", "Empathize", "Ideate"],
          correct: 2,
          hint: "Understanding the user's feelings and needs"
        },
        {
          id: "sk_m2",
          text: "NEP 2020 emphasizes which type of learning?",
          emoji: "📚",
          options: [
            "Rote memorization only",
            "Holistic, experiential learning",
            "Exam-only focus",
            "Textbook reading"
          ],
          correct: 1,
          hint: "Learning through experience and understanding"
        },
        {
          id: "sk_m3",
          text: "Skill India Mission aims to train how many people by 2022?",
          emoji: "🇮🇳",
          options: ["100 million", "300 million", "400 million", "500 million"],
          correct: 3,
          hint: "A very large number – half a billion!"
        }
      ],
      hard: [
        {
          id: "sk_h1",
          text: "Which programming language is best for Machine Learning?",
          emoji: "🤖",
          options: ["Java", "C++", "Python", "HTML"],
          correct: 2,
          hint: "Used by most data scientists and AI researchers"
        },
        {
          id: "sk_h2",
          text: "What does IoT stand for in technology?",
          emoji: "📡",
          options: [
            "Internet of Technology",
            "Internet of Things",
            "Input of Things",
            "Interface of Technology"
          ],
          correct: 1,
          hint: "Connecting everyday objects to the internet"
        },
        {
          id: "sk_h3",
          text: "Which of these is a cloud computing platform?",
          emoji: "☁️",
          options: ["WhatsApp", "Instagram", "AWS", "YouTube"],
          correct: 2,
          hint: "Amazon Web Services"
        }
      ]
    }
  };

  // ===== STATE =====
  let currentQuiz = null;
  let currentQuestionIndex = 0;
  let answers = [];
  let timerInterval = null;
  let questionStartTime = null;
  let responseTimes = [];
  let timerMultiplier = 1;
  let currentDifficulty = 'medium';
  let showingFeedback = false;

  const BASE_TIMER = 30; // seconds per question

  // ===== QUIZ SETUP =====
  function startQuiz(subject, difficulty) {
    currentDifficulty = difficulty || 'medium';
    const bank = QUESTIONS[subject]?.[currentDifficulty] || QUESTIONS.math.medium;

    // Shuffle questions
    const shuffled = [...bank].sort(() => Math.random() - 0.5);
    currentQuiz = {
      subject,
      difficulty: currentDifficulty,
      questions: shuffled.slice(0, Math.min(5, shuffled.length)),
      startTime: Date.now()
    };
    currentQuestionIndex = 0;
    answers = [];
    responseTimes = [];

    renderQuestion();
  }

  // ===== RENDER QUESTION =====
  function renderQuestion() {
    if (!currentQuiz) return;

    const question = currentQuiz.questions[currentQuestionIndex];
    if (!question) return;

    showingFeedback = false;
    questionStartTime = Date.now();

    const container = document.getElementById('quiz-area');
    if (!container) return;

    const isLastQuestion = currentQuestionIndex === currentQuiz.questions.length - 1;
    const optionLetters = ['A', 'B', 'C', 'D'];

    container.innerHTML = `
      <div class="quiz-header">
        <div class="quiz-progress-wrap">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <span style="font-weight:700;font-size:14px">Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}</span>
            <span class="badge badge-primary" style="text-transform:capitalize">${currentQuiz.subject} • ${currentDifficulty}</span>
          </div>
          <div class="progress-container">
            <div class="progress-bar" id="progress-bar"
              style="width:${((currentQuestionIndex) / currentQuiz.questions.length * 100)}%"></div>
          </div>
        </div>
        <div class="quiz-timer" id="quiz-timer">
          ⏱ <span id="timer-value">${Math.round(BASE_TIMER * timerMultiplier)}</span>s
        </div>
      </div>

      <div class="question-card">
        <div class="question-number">
          ${question.emoji || '❓'} Question ${currentQuestionIndex + 1}
        </div>
        <div class="question-text reading-text" id="question-text">
          ${question.text}
        </div>

        <div class="hint-element" id="hint-box" style="display:none">
          <div class="highlight-box" style="margin-bottom:20px">
            <strong>💡 Hint:</strong> ${question.hint || 'Think carefully!'}
          </div>
        </div>

        <div class="answer-options" id="answer-options">
          ${question.options.map((opt, i) => `
            <button class="answer-option" data-index="${i}" onclick="QuizEngine.selectAnswer(${i})">
              <span class="option-letter">${optionLetters[i]}</span>
              <span>${opt}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center">
        <button class="btn btn-outline btn-sm" onclick="App.speak(document.getElementById('question-text').innerText)">
          🔊 Read Aloud
        </button>
        <div style="display:flex;gap:12px">
          <button class="btn btn-outline btn-sm hint-element" onclick="toggleHint()" id="hint-btn">
            💡 Hint
          </button>
        </div>
      </div>
    `;

    // Show/hide hints based on mode
    const mode = AdaptiveUI.getCurrentMode();
    if (mode === 'struggling' || mode === 'progressing') {
      document.getElementById('hint-btn')?.style && (document.getElementById('hint-btn').style.display = 'flex');
    }

    startTimer(question);
  }

  // ===== TIMER =====
  function startTimer(question) {
    clearInterval(timerInterval);
    let timeLeft = Math.round(BASE_TIMER * timerMultiplier);
    const timerEl = document.getElementById('timer-value');
    const timerWrap = document.getElementById('quiz-timer');

    timerInterval = setInterval(() => {
      timeLeft--;
      if (timerEl) timerEl.textContent = timeLeft;

      if (timeLeft <= 10 && timerWrap) {
        timerWrap.className = 'quiz-timer warning';
      }
      if (timeLeft <= 5 && timerWrap) {
        timerWrap.className = 'quiz-timer danger';
      }

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        // Auto-submit as wrong on timeout
        handleTimeout(question);
      }
    }, 1000);
  }

  function handleTimeout(question) {
    if (showingFeedback) return;
    showingFeedback = true;

    const elapsed = Date.now() - questionStartTime;
    responseTimes.push(elapsed);

    answers.push({
      questionId: question.id,
      selected: -1,
      correct: question.correct,
      isCorrect: false,
      responseTime: elapsed,
      timedOut: true
    });

    // Mark correct answer
    const opts = document.querySelectorAll('.answer-option');
    opts.forEach((opt, i) => {
      opt.disabled = true;
      if (i === question.correct) opt.classList.add('correct');
    });

    showFeedback(false, "⏰ Time's up!", "The correct answer was: " + question.options[question.correct]);
  }

  // ===== SELECT ANSWER =====
  function selectAnswer(selectedIndex) {
    if (showingFeedback) return;
    showingFeedback = true;

    clearInterval(timerInterval);

    const question = currentQuiz.questions[currentQuestionIndex];
    const elapsed = Date.now() - questionStartTime;
    const isCorrect = selectedIndex === question.correct;

    responseTimes.push(elapsed);

    answers.push({
      questionId: question.id,
      selected: selectedIndex,
      correct: question.correct,
      isCorrect,
      responseTime: elapsed
    });

    // Visual feedback on options
    const opts = document.querySelectorAll('.answer-option');
    opts.forEach((opt, i) => {
      opt.disabled = true;
      opt.style.pointerEvents = 'none';
      if (i === selectedIndex) opt.classList.add(isCorrect ? 'correct' : 'incorrect');
      if (i === question.correct && !isCorrect) opt.classList.add('correct');
    });

    if (isCorrect) {
      showFeedback(true, "✨ Brilliant!", "You got it right! Well done!");
      App.addPoints(calculatePoints(elapsed));
    } else {
      showFeedback(false, "🤔 Not quite!", "Correct answer: " + question.options[question.correct]);
    }
  }

  function calculatePoints(responseTime) {
    const seconds = responseTime / 1000;
    if (seconds < 5)  return 15;
    if (seconds < 10) return 10;
    if (seconds < 20) return 7;
    return 5;
  }

  // ===== FEEDBACK MODAL =====
  function showFeedback(isCorrect, title, message) {
    const modal = document.createElement('div');
    modal.className = 'feedback-overlay';
    modal.innerHTML = `
      <div class="feedback-modal">
        <span class="feedback-icon">${isCorrect ? '🎉' : '💪'}</span>
        <h3 class="feedback-title">${title}</h3>
        <p class="feedback-message">${message}</p>
        <button class="btn btn-primary" onclick="QuizEngine.nextQuestion()">
          ${currentQuestionIndex < currentQuiz.questions.length - 1 ? '➡️ Next Question' : '📊 See Results'}
        </button>
      </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.querySelector('.btn').focus(), 100);
  }

  // ===== NEXT QUESTION =====
  function nextQuestion() {
    document.querySelector('.feedback-overlay')?.remove();
    currentQuestionIndex++;
    showingFeedback = false;

    if (currentQuestionIndex >= currentQuiz.questions.length) {
      finishQuiz();
    } else {
      renderQuestion();
    }
  }

  // ===== FINISH QUIZ =====
  function finishQuiz() {
    clearInterval(timerInterval);

    const totalQuestions = currentQuiz.questions.length;
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
    const avgTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;

    // Update profile
    const profile = App.getProfile();
    const newCorrect = profile.progress.totalCorrect + correctAnswers;
    const newTotal = profile.progress.totalQuestions + totalQuestions;
    const quizHistory = profile.adaptive.accuracyHistory || [];
    quizHistory.push(accuracy);

    App.updateProgress({
      quizzesCompleted: profile.progress.quizzesCompleted + 1,
      totalCorrect: newCorrect,
      totalQuestions: newTotal
    });

    App.updateAdaptive({
      accuracyHistory: quizHistory.slice(-20),
      avgResponseTime: avgTime,
      consecutiveCorrect: answers[answers.length-1]?.isCorrect
        ? (profile.adaptive.consecutiveCorrect || 0) + correctAnswers : 0,
      consecutiveWrong: !answers[answers.length-1]?.isCorrect
        ? (profile.adaptive.consecutiveWrong || 0) + (totalQuestions - correctAnswers) : 0
    });

    // Run adaptive analysis
    AdaptiveUI.analyze({
      accuracy,
      avgResponseTime: avgTime,
      consecutiveCorrect: profile.adaptive.consecutiveCorrect || 0,
      consecutiveWrong: profile.adaptive.consecutiveWrong || 0
    });

    // Render results
    renderResults(correctAnswers, totalQuestions, accuracy, avgTime);
  }

  // ===== RENDER RESULTS =====
  function renderResults(correct, total, accuracy, avgTime) {
    const container = document.getElementById('quiz-area');
    if (!container) return;

    const grade = accuracy >= 90 ? { emoji: '🏆', label: 'Outstanding!', color: '#FFD700' }
                : accuracy >= 80 ? { emoji: '⭐', label: 'Excellent!', color: '#6C63FF' }
                : accuracy >= 65 ? { emoji: '👏', label: 'Good Job!', color: '#6BCB77' }
                : accuracy >= 50 ? { emoji: '💪', label: 'Keep Going!', color: '#FFB347' }
                :                  { emoji: '🌱', label: 'Keep Practicing!', color: '#FF6B6B' };

    const nextMode = AdaptiveUI.getCurrentMode();
    const modeConfig = AdaptiveUI.getModeConfig();

    container.innerHTML = `
      <div class="results-card card animate-fadeIn">
        <div class="score-circle">
          <span class="score-num">${accuracy}%</span>
          <span class="score-label">Score</span>
        </div>

        <h2 style="font-size:32px;margin-bottom:8px">${grade.emoji} ${grade.label}</h2>
        <p style="color:var(--text-secondary);margin-bottom:32px">
          You answered <strong>${correct} out of ${total}</strong> correctly!
        </p>

        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:32px">
          <div class="stat-card" style="padding:16px">
            <div class="stat-value" style="font-size:28px">${correct}/${total}</div>
            <div class="stat-label">Correct</div>
          </div>
          <div class="stat-card" style="padding:16px">
            <div class="stat-value" style="font-size:28px">${Math.round(avgTime/1000)}s</div>
            <div class="stat-label">Avg Speed</div>
          </div>
          <div class="stat-card" style="padding:16px">
            <div class="stat-value" style="font-size:28px">${App.getProfile().totalPoints}</div>
            <div class="stat-label">Total Pts</div>
          </div>
        </div>

        <div class="highlight-box" style="text-align:left;margin-bottom:32px">
          <strong>${modeConfig.emoji} Adaptive Update:</strong>
          Your UI has been adjusted to <strong>${modeConfig.name}</strong>.
          ${modeConfig.description}.
        </div>

        <div class="answer-review" style="text-align:left;margin-bottom:32px">
          <h4 style="margin-bottom:16px">📋 Review Answers</h4>
          ${answers.map((a, i) => `
            <div style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;
                        margin-bottom:8px;background:${a.isCorrect ? 'rgba(107,203,119,0.1)' : 'rgba(255,107,107,0.1)'}">
              <span style="font-size:20px">${a.isCorrect ? '✅' : '❌'}</span>
              <div>
                <div style="font-weight:600;font-size:14px">Question ${i+1}</div>
                <div style="font-size:12px;color:var(--text-secondary)">
                  ${a.timedOut ? 'Timed out' : 'Answered in ' + (a.responseTime/1000).toFixed(1) + 's'}
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center">
          <button class="btn btn-primary" onclick="location.reload()">
            🔄 Try Again
          </button>
          <a href="quiz.html" class="btn btn-outline">
            📝 New Quiz
          </a>
          <a href="dashboard.html" class="btn btn-outline">
            📊 Dashboard
          </a>
        </div>
      </div>
    `;
  }

  // ===== HINT TOGGLE =====
  window.toggleHint = function() {
    const hintBox = document.getElementById('hint-box');
    if (hintBox) hintBox.style.display = hintBox.style.display === 'none' ? 'block' : 'none';
  };

  // ===== SETTERS =====
  function setDifficulty(diff) { currentDifficulty = diff; }
  function setTimerMultiplier(m) { timerMultiplier = m; }
  function getDifficulty() { return currentDifficulty; }
  function getAllSubjects() { return Object.keys(QUESTIONS); }

  return {
    startQuiz,
    selectAnswer,
    nextQuestion,
    setDifficulty,
    setTimerMultiplier,
    getDifficulty,
    getAllSubjects,
    QUESTIONS
  };
})();
