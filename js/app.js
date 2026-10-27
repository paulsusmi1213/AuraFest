/**
 * AuraFest Celebration & Event Planner - Core Application Controller
 */

import { DEFAULT_EVENTS } from './data.js';
import { fx } from './audio-confetti.js';
import { BudgetManager } from './budget.js';
import { TimelineManager } from './timeline.js';
import { VendorsChecklistManager } from './vendors-checklist.js';
import { IdeasMoodboardManager } from './ideas-moodboard.js';
import { GuestsManager } from './guests.js';
import { AiChatManager } from './ai-chat.js';

class AuraFestApp {
  constructor() {
    this.events = [];
    this.activeEventId = null;
    this.activeTab = 'overview'; // 'overview', 'ai', 'budget', 'timeline', 'vendors', 'ideas', 'guests'
    this.themeMode = localStorage.getItem('aurafest_theme') || 'dark';

    // Module managers
    this.budgetManager = new BudgetManager(this);
    this.timelineManager = new TimelineManager(this);
    this.vendorsManager = new VendorsChecklistManager(this);
    this.ideasManager = new IdeasMoodboardManager(this);
    this.guestsManager = new GuestsManager(this);
    this.aiChatManager = new AiChatManager(this);

    this.countdownInterval = null;
  }

  init() {
    this.loadState();
    this.applyTheme();
    this.bindGlobalControls();
    this.renderHeader();
    this.renderActiveTab();
    this.startCountdownTimer();
  }

  loadState() {
    try {
      const saved = localStorage.getItem('aurafest_events_v1');
      if (saved) {
        this.events = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading stored events:', e);
    }

    if (!this.events || this.events.length === 0) {
      this.events = JSON.parse(JSON.stringify(DEFAULT_EVENTS));
      this.saveState();
    }

    const savedActiveId = localStorage.getItem('aurafest_active_event_id');
    const exists = this.events.find(e => e.id === savedActiveId);
    this.activeEventId = exists ? savedActiveId : this.events[0].id;
  }

  saveState() {
    try {
      localStorage.setItem('aurafest_events_v1', JSON.stringify(this.events));
      localStorage.setItem('aurafest_active_event_id', this.activeEventId);
    } catch (e) {
      console.warn('Error saving events:', e);
    }
  }

  getActiveEvent() {
    return this.events.find(e => e.id === this.activeEventId) || this.events[0];
  }

  setActiveEvent(eventId) {
    if (this.activeEventId === eventId) return;
    this.activeEventId = eventId;
    this.saveState();
    this.renderHeader();
    this.renderActiveTab();
    fx.playPop();
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.themeMode);
  }

  toggleTheme() {
    this.themeMode = this.themeMode === 'dark' ? 'light' : 'dark';
    localStorage.setItem('aurafest_theme', this.themeMode);
    this.applyTheme();
    fx.playPop();
  }

  bindGlobalControls() {
    // Nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabKey = e.currentTarget.getAttribute('data-tab');
        this.switchTab(tabKey);
      });
    });

    // Theme toggle
    document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
      this.toggleTheme();
    });

    // Sound toggle
    const soundBtn = document.getElementById('btn-sound-toggle');
    if (soundBtn) {
      soundBtn.innerText = fx.soundEnabled ? '🔔 Sound On' : '🔕 Sound Off';
      soundBtn.addEventListener('click', () => {
        const isEnabled = fx.toggleSound();
        soundBtn.innerText = isEnabled ? '🔔 Sound On' : '🔕 Sound Off';
        this.showToast(isEnabled ? 'Sound effects enabled' : 'Sound muted', 'info');
      });
    }

    // New Event Button
    document.getElementById('btn-new-event')?.addEventListener('click', () => {
      this.openNewEventModal();
    });

    // Export dossier / print
    document.getElementById('btn-print-dossier')?.addEventListener('click', () => {
      window.print();
    });

    // Reset data
    document.getElementById('btn-reset-data')?.addEventListener('click', () => {
      if (confirm('Restore sample celebration data? Your custom events will be replaced with defaults.')) {
        this.events = JSON.parse(JSON.stringify(DEFAULT_EVENTS));
        this.activeEventId = this.events[0].id;
        this.saveState();
        this.renderHeader();
        this.renderActiveTab();
        this.showToast('Sample celebrations restored', 'info');
      }
    });
  }

  switchTab(tabKey) {
    this.activeTab = tabKey;
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-tab') === tabKey);
    });
    this.renderActiveTab();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openAiChatWithPrompt(promptText) {
    this.switchTab('ai');
    setTimeout(() => {
      const container = document.getElementById('main-tab-content');
      this.aiChatManager.handleUserSubmit(promptText, container);
    }, 100);
  }

  renderHeader() {
    const event = this.getActiveEvent();
    const selector = document.getElementById('event-selector-dropdown');
    if (!selector) return;

    selector.innerHTML = `
      <select class="event-picker-select" id="event-picker-select">
        ${this.events.map(e => `
          <option value="${e.id}" ${e.id === this.activeEventId ? 'selected' : ''}>
            ${e.type === 'wedding' ? '💍' : e.type === 'birthday' ? '🎂' : '🏮'} ${e.title}
          </option>
        `).join('')}
      </select>
    `;

    document.getElementById('event-picker-select').addEventListener('change', (e) => {
      this.setActiveEvent(e.target.value);
    });
  }

  renderActiveTab() {
    const container = document.getElementById('main-tab-content');
    if (!container) return;

    container.className = 'tab-content-active tab-fade-in';

    switch (this.activeTab) {
      case 'overview':
        this.renderOverviewTab(container);
        break;
      case 'ai':
        this.aiChatManager.render(container);
        break;
      case 'budget':
        this.budgetManager.render(container);
        break;
      case 'timeline':
        this.timelineManager.render(container);
        break;
      case 'vendors':
        this.vendorsManager.render(container);
        break;
      case 'ideas':
        this.ideasManager.render(container);
        break;
      case 'guests':
        this.guestsManager.render(container);
        break;
      default:
        this.renderOverviewTab(container);
    }
  }

  renderOverviewTab(container) {
    const event = this.getActiveEvent();
    const currency = event.currency || '$';

    const totalSpent = (event.budget?.items || []).reduce((sum, i) => sum + (Number(i.actual) || 0), 0);
    const budgetTotal = event.budgetTotal || 1;
    const budgetPercent = Math.min(100, Math.round((totalSpent / budgetTotal) * 100));

    const totalChecklist = event.checklists?.length || 0;
    const completedChecklist = event.checklists?.filter(c => c.completed).length || 0;
    const checklistPercent = totalChecklist ? Math.round((completedChecklist / totalChecklist) * 100) : 0;

    const attendingGuests = event.guests?.filter(g => g.rsvp === 'Attending').reduce((sum, g) => sum + (Number(g.count) || 1), 0) || 0;
    const guestTarget = event.guestsTarget || 1;
    const guestPercent = Math.min(100, Math.round((attendingGuests / guestTarget) * 100));

    const dayOfItems = event.timeline?.dayOf || [];
    const nextMilestone = dayOfItems.find(i => !i.completed) || dayOfItems[0] || { time: '16:00', title: 'Main Event' };

    container.innerHTML = `
      <div class="overview-section">
        <!-- Hero Banner with Countdown -->
        <div class="overview-hero card glass-card" style="background-image: linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.95)), url('${event.coverImage}');">
          <div class="hero-left-col">
            <div class="hero-tags">
              <span class="badge badge-gold uppercase font-bold">${event.type} CELEBRATION</span>
              <span class="badge badge-outline">📍 ${event.location}</span>
            </div>
            <h1 class="hero-title">${event.title}</h1>
            <p class="hero-subtitle">${event.tagline || 'Crafted with precision, elevated by GenAI.'}</p>

            <div class="hero-quick-meta">
              <div class="meta-item">
                <span class="meta-icon">📅</span>
                <span>${event.date} at ${event.time}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">🌤️</span>
                <span>Forecast: 73°F • Sunset Clear • Gentle Breeze</span>
              </div>
            </div>
          </div>

          <!-- Live Countdown Card -->
          <div class="countdown-card glow-card">
            <span class="countdown-header-label">CELEBRATION COUNTDOWN</span>
            <div class="countdown-grid" id="countdown-grid">
              <div class="countdown-slot">
                <span class="count-num" id="cd-days">--</span>
                <span class="count-lbl">Days</span>
              </div>
              <div class="countdown-sep">:</div>
              <div class="countdown-slot">
                <span class="count-num" id="cd-hours">--</span>
                <span class="count-lbl">Hours</span>
              </div>
              <div class="countdown-sep">:</div>
              <div class="countdown-slot">
                <span class="count-num" id="cd-minutes">--</span>
                <span class="count-lbl">Mins</span>
              </div>
              <div class="countdown-sep">:</div>
              <div class="countdown-slot">
                <span class="count-num" id="cd-seconds">--</span>
                <span class="count-lbl">Secs</span>
              </div>
            </div>
            <button class="btn btn-gold btn-sm w-100 mt-3" id="hero-btn-ai-consult">
              ✨ Consult Aura AI Copilot
            </button>
          </div>
        </div>

        <!-- Metric Pulse Cards -->
        <div class="metrics-grid mt-4">
          <!-- Budget Metric -->
          <div class="metric-card glow-card cursor-pointer" id="metric-click-budget">
            <div class="metric-icon gold">💰</div>
            <div class="metric-content">
              <span class="metric-label">Committed Budget</span>
              <div class="metric-value">${currency}${totalSpent.toLocaleString()}</div>
              <div class="progress-bar-track mt-1">
                <div class="progress-bar-fill" style="width: ${budgetPercent}%; background: #D4AF37;"></div>
              </div>
              <span class="metric-sub">${budgetPercent}% of ${currency}${budgetTotal.toLocaleString()}</span>
            </div>
          </div>

          <!-- Timeline Metric -->
          <div class="metric-card glow-card cursor-pointer" id="metric-click-timeline">
            <div class="metric-icon purple">⏱️</div>
            <div class="metric-content">
              <span class="metric-label">Next Key Milestone</span>
              <div class="metric-value text-sm font-bold text-truncate">${nextMilestone.time} - ${nextMilestone.title}</div>
              <span class="metric-sub">${dayOfItems.length} total scheduled events</span>
            </div>
          </div>

          <!-- Checklist Metric -->
          <div class="metric-card glow-card cursor-pointer" id="metric-click-checklist">
            <div class="metric-icon emerald">✅</div>
            <div class="metric-content">
              <span class="metric-label">Milestone Checklist</span>
              <div class="metric-value">${completedChecklist} / ${totalChecklist}</div>
              <div class="progress-bar-track mt-1">
                <div class="progress-bar-fill" style="width: ${checklistPercent}%; background: #10B981;"></div>
              </div>
              <span class="metric-sub">${checklistPercent}% completed readiness</span>
            </div>
          </div>

          <!-- Guests Metric -->
          <div class="metric-card glow-card cursor-pointer" id="metric-click-guests">
            <div class="metric-icon blue">👥</div>
            <div class="metric-content">
              <span class="metric-label">Guest RSVP Rate</span>
              <div class="metric-value">${attendingGuests} Confirmed</div>
              <div class="progress-bar-track mt-1">
                <div class="progress-bar-fill" style="width: ${guestPercent}%; background: #06B6D4;"></div>
              </div>
              <span class="metric-sub">${guestPercent}% of ${guestTarget} guest target</span>
            </div>
          </div>
        </div>

        <!-- 3-Column Highlights Grid -->
        <div class="grid-three-col mt-4">
          <!-- Upcoming Timeline Preview -->
          <div class="card glass-card">
            <div class="card-header-flex">
              <h3 class="card-title">⏱️ Run of Show Preview</h3>
              <button class="btn btn-secondary btn-xs" id="btn-goto-timeline">View All</button>
            </div>
            <div class="timeline-compact-list mt-3">
              ${dayOfItems.slice(0, 4).map(item => `
                <div class="compact-timeline-item">
                  <span class="compact-time">${item.time}</span>
                  <div class="compact-content">
                    <div class="compact-title ${item.completed ? 'line-through text-muted' : ''}">${item.title}</div>
                    <span class="compact-sub text-muted">${item.location || 'Main Zone'}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Urgent Checklist Tasks -->
          <div class="card glass-card">
            <div class="card-header-flex">
              <h3 class="card-title">📋 Priority Checklist</h3>
              <button class="btn btn-secondary btn-xs" id="btn-goto-checklist">View All</button>
            </div>
            <div class="checklist-compact-list mt-3">
              ${(event.checklists || []).slice(0, 4).map(c => `
                <div class="compact-check-item">
                  <span class="check-dot ${c.completed ? 'done' : ''}"></span>
                  <div class="compact-content">
                    <div class="compact-title ${c.completed ? 'line-through text-muted' : ''}">${c.task}</div>
                    <span class="compact-sub badge badge-priority-${(c.priority || 'Medium').toLowerCase()}">${c.priority} Priority</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Theme & Palette Snapshot -->
          <div class="card glass-card">
            <div class="card-header-flex">
              <h3 class="card-title">🎨 Theme & Palette</h3>
              <button class="btn btn-secondary btn-xs" id="btn-goto-ideas">Studio</button>
            </div>
            <p class="text-sm font-medium mt-2">${event.theme?.name || 'Modern Chic'}</p>
            <div class="palette-compact-row mt-3">
              ${(event.theme?.palette || []).map(p => `
                <div class="compact-swatch" style="background-color: ${p.hex}" title="${p.name} (${p.hex})"></div>
              `).join('')}
            </div>
            <div class="signature-drink-preview mt-3">
              <span class="text-xs text-muted font-bold">SIGNATURE COCKTAIL:</span>
              <p class="text-sm mt-1">🍹 <strong>${event.theme?.signatureDrinks?.[0]?.name || 'House Special'}</strong></p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Overview buttons
    container.querySelector('#hero-btn-ai-consult')?.addEventListener('click', () => this.switchTab('ai'));
    container.querySelector('#metric-click-budget')?.addEventListener('click', () => this.switchTab('budget'));
    container.querySelector('#metric-click-timeline')?.addEventListener('click', () => this.switchTab('timeline'));
    container.querySelector('#metric-click-checklist')?.addEventListener('click', () => this.switchTab('vendors'));
    container.querySelector('#metric-click-guests')?.addEventListener('click', () => this.switchTab('guests'));
    container.querySelector('#btn-goto-timeline')?.addEventListener('click', () => this.switchTab('timeline'));
    container.querySelector('#btn-goto-checklist')?.addEventListener('click', () => this.switchTab('vendors'));
    container.querySelector('#btn-goto-ideas')?.addEventListener('click', () => this.switchTab('ideas'));

    this.updateCountdownNumbers();
  }

  startCountdownTimer() {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    this.countdownInterval = setInterval(() => {
      this.updateCountdownNumbers();
    }, 1000);
  }

  updateCountdownNumbers() {
    const event = this.getActiveEvent();
    if (!event || !event.date) return;

    const targetDate = new Date(`${event.date}T${event.time || '16:00'}:00`);
    const now = new Date();
    const diffMs = targetDate - now;

    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-minutes');
    const secsEl = document.getElementById('cd-seconds');

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    if (diffMs <= 0) {
      daysEl.innerText = '00';
      hoursEl.innerText = '00';
      minsEl.innerText = '00';
      secsEl.innerText = '00';
      return;
    }

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diffMs / 1000 / 60) % 60);
    const seconds = Math.floor((diffMs / 1000) % 60);

    daysEl.innerText = String(days).padStart(2, '0');
    hoursEl.innerText = String(hours).padStart(2, '0');
    minsEl.innerText = String(minutes).padStart(2, '0');
    secsEl.innerText = String(seconds).padStart(2, '0');
  }

  openNewEventModal() {
    const modalHtml = `
      <div class="modal-overlay active" id="new-event-modal">
        <div class="modal-card modal-lg">
          <div class="modal-header">
            <h3>✨ Create New Celebration or Event</h3>
            <button class="modal-close" id="modal-close-btn">&times;</button>
          </div>
          <form id="new-event-form" class="modal-body">
            <div class="form-row">
              <div class="form-group flex-2">
                <label>Celebration Title *</label>
                <input type="text" class="form-control" name="title" required placeholder="e.g. Maya & Alex: Autumn Botanical Wedding">
              </div>
              <div class="form-group flex-1">
                <label>Event Type *</label>
                <select class="form-control" name="type" id="new-evt-type">
                  <option value="wedding">💍 Wedding</option>
                  <option value="birthday">🎂 Milestone Birthday</option>
                  <option value="community">🏮 Community Festival</option>
                  <option value="corporate">💼 Gala / Corporate</option>
                  <option value="custom">🌟 Custom Celebration</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Tagline / Vision Statement</label>
              <input type="text" class="form-control" name="tagline" placeholder="e.g. An intimate evening of acoustic melodies, candlelit dining, and joyful toasts.">
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label>Event Date *</label>
                <input type="date" class="form-control" name="date" required value="2027-04-18">
              </div>
              <div class="form-group flex-1">
                <label>Start Time *</label>
                <input type="time" class="form-control" name="time" required value="16:30">
              </div>
              <div class="form-group flex-2">
                <label>Venue / Location *</label>
                <input type="text" class="form-control" name="location" required placeholder="e.g. The Glasshouse Garden, Seattle, WA">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label>Guest Headcount Target</label>
                <input type="number" min="5" max="10000" class="form-control" name="guestsTarget" value="120" required>
              </div>
              <div class="form-group flex-1">
                <label>Total Budget Target</label>
                <input type="number" step="any" class="form-control" name="budgetTotal" value="35000" required>
              </div>
              <div class="form-group flex-1">
                <label>Currency</label>
                <select class="form-control" name="currency">
                  <option value="$">$ (USD / CAD / AUD)</option>
                  <option value="€">€ (EUR)</option>
                  <option value="£">£ (GBP)</option>
                  <option value="₹">₹ (INR)</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Aesthetic Theme Name</label>
              <input type="text" class="form-control" name="themeName" value="Emerald Forest & Warm Candlelight" placeholder="e.g. Sunset Bohemian, Cyber Retro, etc.">
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
              <button type="submit" class="btn btn-gold">✨ Initialize Celebration Architecture</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modalEl = document.getElementById('new-event-modal');

    const closeModal = () => modalEl.remove();
    modalEl.querySelector('#modal-close-btn').addEventListener('click', closeModal);
    modalEl.querySelector('#modal-cancel-btn').addEventListener('click', closeModal);

    modalEl.querySelector('#new-event-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);

      const type = formData.get('type');
      const budgetTotal = Number(formData.get('budgetTotal')) || 25000;
      const currency = formData.get('currency') || '$';

      // Pick cover image based on type
      let coverImage = 'assets/images/wedding_cover.jpg';
      if (type === 'birthday') coverImage = 'assets/images/birthday_cover.jpg';
      if (type === 'community') coverImage = 'assets/images/festival_cover.jpg';

      const newEvt = {
        id: `evt-${Date.now()}`,
        type: type,
        title: formData.get('title'),
        tagline: formData.get('tagline') || 'A beautiful milestone celebration.',
        date: formData.get('date'),
        time: formData.get('time'),
        location: formData.get('location'),
        guestsTarget: Number(formData.get('guestsTarget')) || 100,
        budgetTotal: budgetTotal,
        currency: currency,
        coverImage: coverImage,
        theme: {
          name: formData.get('themeName') || 'Modern Elegance',
          description: 'Custom curated celebration aesthetic.',
          palette: [
            { name: 'Emerald Velvet', hex: '#065F46' },
            { name: 'Warm Amber', hex: '#F59E0B' },
            { name: 'Champagne Alabaster', hex: '#FDFBF7' },
            { name: 'Obsidian Night', hex: '#0F172A' },
            { name: 'Rose Gold', hex: '#B76E79' }
          ],
          dressCode: 'Elevated Cocktail / Black-Tie Optional',
          signatureDrinks: [
            { name: 'The Celebrant Spritz', ingredients: 'Sparkling Prosecco, St. Germain Elderflower, soda, fresh mint sprig' }
          ],
          playlistVibes: 'Modern acoustic jazz lounge transitioning into dance classics'
        },
        budget: {
          categories: [
            { id: 'cat-1', name: 'Venue & Production', allocated: Math.round(budgetTotal * 0.35), spent: 0 },
            { id: 'cat-2', name: 'Catering & Beverages', allocated: Math.round(budgetTotal * 0.38), spent: 0 },
            { id: 'cat-3', name: 'Photo & Media', allocated: Math.round(budgetTotal * 0.12), spent: 0 },
            { id: 'cat-4', name: 'Florals & Styling', allocated: Math.round(budgetTotal * 0.09), spent: 0 },
            { id: 'cat-5', name: 'Contingency Pool', allocated: Math.round(budgetTotal * 0.06), spent: 0 }
          ],
          items: [
            { id: 'b-init-1', category: 'Venue & Production', title: 'Primary Venue Deposit', estimated: Math.round(budgetTotal * 0.3), actual: 0, status: 'Pending', vendor: formData.get('location') }
          ]
        },
        timeline: {
          preEvent: [
            { id: 't-init-p1', phase: '6-8 Months Out', task: 'Lock venue contract and date deposit', completed: false, owner: 'Planner' },
            { id: 't-init-p2', phase: '3 Months Out', task: 'Send out formal invitations & RSVP portal', completed: false, owner: 'Planner' },
            { id: 't-init-p3', phase: '1 Week Out', task: 'Submit final dietary count to caterers', completed: false, owner: 'Planner' }
          ],
          dayOf: [
            { id: 't-init-d1', time: '13:00', title: 'Vendor Load-In & Audio Line Check', location: formData.get('location'), lead: 'Lead Coordinator', notes: 'Verify power access and layout' },
            { id: 't-init-d2', time: formData.get('time'), title: 'Doors Open & Welcome Refreshments', location: formData.get('location'), lead: 'Hospitality Lead', notes: 'Acoustic background music and signature drink' },
            { id: 't-init-d3', time: '19:00', title: 'Main Dinner & Celebratory Toasts', location: 'Dining Hall', lead: 'MC', notes: 'Toasts capped at 3 minutes each' },
            { id: 't-init-d4', time: '22:30', title: 'Grand Finale Send-Off', location: 'Main Entrance', lead: 'Coordinator', notes: 'Sparkler or lantern send-off' }
          ]
        },
        vendors: [
          { id: 'v-init-1', category: 'Venue', name: formData.get('location'), contact: 'Venue Director', phone: '(555) 019-2834', email: 'events@venue.com', status: 'Proposal Sent', cost: Math.round(budgetTotal * 0.3), notes: 'Primary celebration space' }
        ],
        checklists: [
          { id: 'c-init-1', category: 'Planning', task: 'Sign venue contract and pay deposit', completed: false, priority: 'High', due: formData.get('date') },
          { id: 'c-init-2', category: 'Hospitality', task: 'Confirm menu choices and craft cocktail list', completed: false, priority: 'High', due: formData.get('date') },
          { id: 'c-init-3', category: 'Production', task: 'Review sound system and DJ playlist cues', completed: false, priority: 'Medium', due: formData.get('date') }
        ],
        guests: [
          { id: 'g-init-1', name: 'VIP Host Party', email: 'host@celebration.org', rsvp: 'Attending', count: 2, dietary: 'None', table: 'Table 1' }
        ]
      };

      this.events.unshift(newEvt);
      this.activeEventId = newEvt.id;
      this.saveState();
      closeModal();
      this.renderHeader();
      this.renderActiveTab();
      fx.launchConfetti();
      this.showToast('🎉 New celebration initialized with AI blueprint!', 'success');
    });
  }

  showToast(message, type = 'info') {
    const existing = document.getElementById('aurafest-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'aurafest-toast';
    toast.className = `aurafest-toast toast-${type} toast-enter`;
    toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '✨' : type === 'info' ? 'ℹ️' : '⚠️'}</span>
      <span class="toast-msg">${message}</span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('toast-enter');
    }, 10);

    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

// Global bootstrap
window.addEventListener('DOMContentLoaded', () => {
  window.AuraApp = new AuraFestApp();
  window.AuraApp.init();
});
