# 🚀 VidhyaPath – Adaptive E-Learning Platform

## 🇮🇳 Vikshit Bharat 2047 | Pillar 3: Education & Skill Development
### NEP 2020 & Skill India | Inclusive Learning for All

---

## 📋 Project Overview

**VidhyaPath** is an intelligent adaptive e-learning platform designed for neurodivergent children (ADHD, Dyslexia, Autism). The system dynamically adjusts its visual complexity, colors, layout, and font styles based on the learner's performance — helping every child learn at their own pace.

---

## 🗂️ Folder Structure

```
adaptive-learning-platform/
│
├── index.html          ← Home page with hero, features, lesson preview
├── dashboard.html      ← Student progress dashboard with Chart.js
├── lesson.html         ← Interactive lesson viewer
├── quiz.html           ← Adaptive quiz interface
│
├── css/
│   ├── style.css       ← Main stylesheet with CSS variables & themes
│   ├── accessibility.css ← Dyslexia, high contrast, simple mode styles
│
├── js/
│   ├── app.js          ← Core app, TTS, settings, profile management
│   ├── adaptiveUI.js   ← Adaptive algorithm engine
│   ├── quizEngine.js   ← Quiz logic, scoring, timer, feedback
│   ├── progressTracker.js ← Lesson completion, achievements, stats
│
├── assets/
│   ├── images/
│   ├── icons/
│
├── backend/
│   ├── server.js       ← Express server
│   ├── routes.js       ← REST API routes
│
└── README.md
```

---

## 🚀 Quick Start (Browser Only – No Server Needed)

### Option 1: Open Directly in Browser

```bash
# Just double-click index.html or open in browser:
open index.html
```

All data is stored in **localStorage** – no server required!

---

### Option 2: Run with Node.js Backend

#### Prerequisites
- Node.js v16+ installed
- npm v7+

#### Installation

```bash
# 1. Navigate to project folder
cd adaptive-learning-platform

# 2. Install dependencies
npm init -y
npm install express

# 3. Start the server
node backend/server.js

# 4. Open in browser
# http://localhost:3000
```

---

## 🧠 Adaptive Algorithm Logic

### How It Works

The system tracks three key metrics per quiz session:
1. **Accuracy** (% correct answers)
2. **Response Time** (average seconds per question)
3. **Streaks** (consecutive correct/wrong answers)

### Decision Matrix

| Condition | Mode | UI Changes |
|-----------|------|------------|
| Accuracy < 50% OR Response > 25s | 🌱 Support Mode | ↑ Font size, Simple layout, High contrast, Hints ON |
| Accuracy 50–65% | 🌿 Learning Mode | Hints available, Normal difficulty |
| Accuracy 65–80% | 🌳 Challenge Mode | Hints hidden, Medium difficulty |
| Accuracy > 80% AND Response < 8s | 🚀 Advanced Mode | Full UI, Hard difficulty, Unlock next lesson |

### Code Example

```javascript
// From adaptiveUI.js
function analyze(sessionData) {
  const { accuracy, avgResponseTime, consecutiveWrong } = sessionData;

  if (accuracy < 50 || avgResponseTime > 25000) {
    adaptUI("struggling");  // → Increase font, enable simple mode
  } else if (accuracy >= 80 && avgResponseTime <= 8000) {
    adaptUI("excelling");   // → Advanced mode, unlock next lesson
  }
}
```

---

## ♿ Accessibility Features

| Feature | How to Enable |
|---------|---------------|
| 📖 Dyslexia Font | Sidebar button or A11y toolbar |
| 🌗 High Contrast | Sidebar button or A11y toolbar |
| 🧘 Simple Mode | Reduces visual complexity |
| 🎯 Focus Mode | Highlights active content |
| 🔊 Text-to-Speech | TTS button in navbar |
| A+ / A- | Font size up/down |
| 🌙 Dark Mode | Toggle in toolbar |

All settings are **saved to localStorage** and persist across sessions.

---

## 📚 Learning Modules

### Subjects Available
- **🔢 Mathematics** – Numbers, Shapes, Fractions, Algebra
- **🔬 Science** – Plants, Solar System, Forces, Chemistry
- **💡 Skill India** – Digital skills, Coding, NEP 2020

### Difficulty Levels
- 🌱 **Easy** – Foundation level concepts
- 🌿 **Medium** – Standard curriculum
- 🔥 **Hard** – Challenge and enrichment

---

## 📊 Dashboard Features

- Real-time progress charts (Chart.js)
- Weekly activity visualization
- Adaptive mode status indicator
- Subject-wise performance bars
- Achievement badges system
- Manual adaptive mode override (for teachers/parents)

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Charts | Chart.js 4.4 |
| Fonts | Google Fonts (Baloo 2, Nunito, OpenDyslexic) |
| Storage | localStorage (client) / JSON file (server) |
| Backend | Node.js + Express |
| TTS | Web Speech API (built-in browser) |

---

## 🎯 NEP 2020 Alignment

- **Holistic learning** through multi-subject modules
- **Inclusive education** for neurodivergent learners
- **Digital literacy** via Skill India modules
- **Formative assessment** through adaptive quizzes
- **Mother tongue** support (TTS in Indian English)

---

## 🔮 Future Enhancements

- [ ] Multilingual support (Hindi, Tamil, Bengali)
- [ ] Teacher dashboard for classroom management
- [ ] AI-powered question generation
- [ ] Voice-controlled navigation
- [ ] Offline PWA support
- [ ] 3D interactive elements (Three.js)
- [ ] Parent progress reports via email
- [ ] Integration with DIKSHA platform (NCF)

---

## 📄 License

Built for educational purposes under Vikshit Bharat 2047 initiative.
Free to use and modify for non-commercial educational use.

---

## 🙏 Credits

Made with ❤️ for every learner in India.
Aligned with NEP 2020, Skill India Mission, and Vikshit Bharat 2047 goals.

*"Education is the most powerful weapon which you can use to change the world." – Nelson Mandela*
