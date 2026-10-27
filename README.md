# 🥂 CelebrateAI / AuraFest — GenAI Celebration & Event Planner

> An intelligent celebration planning assistant engineered to help organizers, couples, and community leads design unforgettable **weddings, milestone birthdays, and community festivals** with dynamic budgets, run-of-show timelines, vendor checklists, and personalized creative concepts.

---

## 🌟 Key Capabilities

### 1. 🧠 Multi-Persona GenAI Copilot
- **4 Specialized AI Advisors**:
  - ✨ **Aura Stylist**: Aesthetic themes, floral concepts, moodboards, color harmony, and sensory ambiance.
  - 💎 **Aura Comptroller**: Cost-per-guest optimization, contract negotiation strategies, and budget rebalancing.
  - ⏱️ **Aura Stage Manager**: Minute-by-minute day-of schedules, vendor load-in cues, buffer times, and weather contingencies.
  - 🏮 **Aura Community Lead**: Civic park permits, fire marshal regulations, volunteer shift management, and sustainability.
- **Actionable AI Outputs**: 1-click buttons directly inside AI chat to apply budget benchmarks or merge suggested checkpoints into the live schedule.
- **Dual Engine**: Instant local offline knowledge model + optional Google Gemini API Key support.

### 2. 💰 Smart Budget & Cost Optimizer
- **Interactive SVG Donut Chart & Category Progress Bars**.
- Real-time calculations for Total Budget, Committed/Spent, Remaining Cushion, and Cost Per Guest.
- **AI Budget Rebalancer**: Instantly redistributes allocations across major pillars based on proven industry benchmarks.
- Multi-currency support ($, €, £, ₹) with payment lifecycle tracking (*Deposit Paid*, *Paid in Full*, *Pending*).

### 3. ⏱️ Timeline & Run-of-Show Engine
- **Day-of Precision Schedule**: Hour-by-hour milestones with designated coordinators, venue zones, and cue notes.
- **Pre-Event Phased Roadmap**: 6 Months, 3 Months, 1 Month, 1 Week, and Day Before checkpoints.
- **📅 1-Click .ICS Calendar Export**: Sync the complete celebration run-of-show directly to Apple Calendar, Google Calendar, or Microsoft Outlook.

### 4. 📋 Vendor CRM & Master Checklists
- Categorized Vendor CRM directory tracking contacts, phone numbers, quotes, and contract deliverables.
- 100+ curated milestone tasks filtered by category and priority (*High*, *Medium*, *Low*).
- Interactive celebration feedback: Web Audio API harmonic chimes and custom physics canvas confetti upon task completion.

### 5. 🎨 Ideas & Moodboard Studio
- Dynamic 5-tone color palettes with 1-click HEX clipboard copying.
- Curated signature cocktail and zero-proof mocktail recipes with exact ingredients and garnishes.
- Ready-to-use celebration messaging: Formal invitation wording, 3-minute toast speech frameworks, and SMS reminder templates.

### 6. 👥 Guest List & RSVP Management
- Real-time guest attendance metrics (*Confirmed*, *Pending*, *Declined*).
- Dietary restrictions tracker (*Gluten-Free*, *Vegan*, *Halal*, *Nut Allergies*, *Kosher*) for caterers.
- Table / Seating Zone assignments with **1-click CSV export**.

---

## 🚀 Getting Started

### Local Execution (No external dependencies required)
AuraFest is built with vanilla HTML5, CSS3, and ES6+ modules:

```bash
# Start a local static HTTP server (Python 3)
python -m http.server 8080

# Or using Node
npx serve .
```

Open **`http://localhost:8080`** in any modern web browser.

---

## 📁 Repository Structure

```text
├── index.html                 # Main application HTML5 interface
├── assets/
│   └── images/                # Cinematic celebration cover assets
├── css/
│   ├── main.css               # Design system, CSS variables & typography
│   ├── components.css         # Glassmorphism cards, badges, buttons, modals & tabs
│   └── sections.css           # Section-specific styles (Dashboard, Chat, Budget, etc.)
└── js/
    ├── app.js                 # Main application controller & event switcher
    ├── data.js                # High-fidelity celebration presets & AI personas
    ├── ai-engine.js           # GenAI assistant engine (Local + Gemini API integration)
    ├── ai-chat.js             # Interactive chat interface & action handlers
    ├── budget.js              # Budget calculator, SVG donut chart & AI rebalancer
    ├── timeline.js            # Pre-event roadmap, day-of run-of-show & ICS export
    ├── vendors-checklist.js   # Vendor CRM & milestone checklists
    ├── ideas-moodboard.js     # Color palette studio, signature drinks & copy templates
    ├── guests.js              # Guest list, RSVP metrics, dietary counts & CSV export
    └── audio-confetti.js      # Web Audio chime synthesis & canvas confetti engine
```

---

## 📄 License
MIT License. Crafted with precision for celebratory excellence.
