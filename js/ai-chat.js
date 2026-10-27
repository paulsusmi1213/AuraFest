/**
 * AuraFest Celebration Planner - AI Chat Interface & Action Controller
 */

import { aiEngine } from './ai-engine.js';
import { AI_PERSONAS } from './data.js';
import { fx } from './audio-confetti.js';

export class AiChatManager {
  constructor(app) {
    this.app = app;
    this.chatHistories = {}; // Keyed by eventId
    this.isGenerating = false;
  }

  getEvent() {
    return this.app.getActiveEvent();
  }

  getHistory(eventId) {
    if (!this.chatHistories[eventId]) {
      const event = this.app.events.find(e => e.id === eventId) || this.getEvent();
      const persona = AI_PERSONAS.find(p => p.id === aiEngine.activePersona) || AI_PERSONAS[0];
      this.chatHistories[eventId] = [
        {
          role: 'assistant',
          persona: persona.name,
          text: `✨ **Welcome to AuraFest GenAI Planning Intelligence!**\n\nI am your **${persona.name}** (${persona.badge}). I'm currently dialed into **${event.title}** (${event.date} • ${event.location}).\n\n${persona.greeting}\n\nTap any quick prompt below or ask me anything from vendor negotiations to minute-by-minute day-of logistics!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
    }
    return this.chatHistories[eventId];
  }

  render(container) {
    const event = this.getEvent();
    if (!event) return;

    const history = this.getHistory(event.id);
    const activePersona = AI_PERSONAS.find(p => p.id === aiEngine.activePersona) || AI_PERSONAS[0];

    const quickPrompts = this.getQuickPrompts(event);

    container.innerHTML = `
      <div class="ai-chat-layout">
        <!-- Persona Selector Sidebar / Top Strip -->
        <div class="card glass-card persona-selector-bar">
          <div class="persona-header">
            <span class="badge badge-gold">🧠 GenAI Planning Copilot</span>
            <span class="persona-current-label">Active Expert: <strong>${activePersona.name}</strong></span>
          </div>

          <div class="personas-grid">
            ${AI_PERSONAS.map(p => `
              <div class="persona-card ${p.id === aiEngine.activePersona ? 'active' : ''}" data-persona="${p.id}">
                <div class="persona-avatar">${p.avatar}</div>
                <div class="persona-info">
                  <div class="persona-name">${p.name}</div>
                  <div class="persona-badge-sub">${p.badge}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Chat Container -->
        <div class="card glass-card chat-main-window">
          <!-- Chat Header -->
          <div class="chat-header-flex">
            <div class="chat-header-title">
              <span class="online-dot"></span>
              <strong>${activePersona.name}</strong>
              <span class="text-muted text-sm ml-2">Synced with ${event.title}</span>
            </div>

            <div class="chat-header-actions">
              <button class="btn btn-outline btn-xs" id="btn-clear-chat" title="Reset chat history">Clear History</button>
              <button class="btn btn-secondary btn-xs" id="btn-api-key-config" title="Configure Gemini API Key">
                🔑 ${aiEngine.getApiKey() ? 'API Key Configured' : 'Local Engine (Add Key)'}
              </button>
            </div>
          </div>

          <!-- Message History List -->
          <div class="chat-messages-container" id="chat-messages-box">
            ${history.map(msg => this.renderMessage(msg)).join('')}
          </div>

          <!-- Quick Suggestion Pills -->
          <div class="quick-prompts-bar">
            <span class="quick-label">⚡ Inspiration:</span>
            <div class="quick-pills-scroll">
              ${quickPrompts.map(prompt => `
                <button class="quick-prompt-pill" data-prompt="${prompt}">${prompt}</button>
              `).join('')}
            </div>
          </div>

          <!-- Input Box -->
          <form class="chat-input-bar" id="chat-form">
            <input 
              type="text" 
              class="form-control chat-input" 
              id="chat-user-input" 
              placeholder="Ask anything about timelines, budgets, vendor contracts, cocktails, themes..." 
              autocomplete="off"
              ${this.isGenerating ? 'disabled' : ''}
            >
            <button type="submit" class="btn btn-primary btn-send" ${this.isGenerating ? 'disabled' : ''}>
              ${this.isGenerating ? '<span class="spinner"></span>' : 'Send ✨'}
            </button>
          </form>
        </div>
      </div>
    `;

    this.bindEvents(container);
    this.scrollToBottom();
  }

  renderMessage(msg) {
    const isUser = msg.role === 'user';
    const formattedHtml = this.formatMarkdown(msg.text);

    return `
      <div class="chat-bubble-row ${isUser ? 'user-row' : 'assistant-row'}">
        <div class="chat-avatar ${isUser ? 'user-avatar' : 'ai-avatar'}">
          ${isUser ? '👤' : '✨'}
        </div>
        <div class="chat-bubble ${isUser ? 'user-bubble' : 'ai-bubble'}">
          ${!isUser && msg.persona ? `<div class="bubble-sender">${msg.persona}</div>` : ''}
          <div class="bubble-content">${formattedHtml}</div>
          ${msg.actionData ? this.renderActionCard(msg.actionData) : ''}
          <div class="bubble-time">${msg.time || ''}</div>
        </div>
      </div>
    `;
  }

  renderActionCard(actionData) {
    if (actionData.type === 'budget_proposal') {
      return `
        <div class="ai-action-card">
          <div class="action-card-header">
            <span>✨ <strong>Smart Action:</strong> ${actionData.title}</span>
          </div>
          <p class="text-xs text-muted mb-2">Automatically optimize categories according to event benchmark ratios.</p>
          <button class="btn btn-gold btn-xs btn-execute-action" data-action="apply_budget">
            + Apply Benchmark Ratios to Budget
          </button>
        </div>
      `;
    }
    if (actionData.type === 'timeline_proposal') {
      return `
        <div class="ai-action-card">
          <div class="action-card-header">
            <span>⏱️ <strong>Smart Action:</strong> ${actionData.title}</span>
          </div>
          <p class="text-xs text-muted mb-2">Inject key suggested checkpoints into your Day-of Run of Show.</p>
          <button class="btn btn-primary btn-xs btn-execute-action" data-action="apply_timeline">
            + Merge Milestones into Timeline
          </button>
        </div>
      `;
    }
    return '';
  }

  formatMarkdown(text) {
    if (!text) return '';
    let html = text
      .replace(/^### (.*$)/gim, '<h4 class="md-h4">$1</h4>')
      .replace(/^#### (.*$)/gim, '<h5 class="md-h5">$1</h5>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>')
      .replace(/\n\n/g, '<br><br>');
    return html;
  }

  getQuickPrompts(event) {
    if (event.type === 'wedding') {
      return [
        'How can I shave 15% from our floral budget without losing impact?',
        'Suggest a dream color palette & moodboard for our vineyard wedding',
        'What are the 5 critical contract questions to ask the caterer?',
        'Draft an hour-by-hour run of show for our ceremony and reception',
        'Create a 3-tier rain and wind contingency plan for outdoor dining'
      ];
    } else if (event.type === 'birthday') {
      return [
        'Curate 2 signature cocktails with neon glowing aesthetic for Leo',
        'Draft a 3-minute warm & funny toast speech for a 30th birthday',
        'Suggest interactive party games and arcade challenges for 60 guests',
        'Timeline for surprise birthday reveal & champagne tower toast',
        'Estimate total beverage quantities (cocktails, wine, beer) for 5 hours'
      ];
    } else {
      return [
        'What municipal park permits and insurance are needed for 1,200 people?',
        'Draft a volunteer shift schedule and orientation briefing checklist',
        'Create a zero-waste recycling and food truck layout strategy',
        'Design a floating lantern launch ceremony timeline for sunset',
        'Calculate sanitation restroom units and first aid safety requirements'
      ];
    }
  }

  bindEvents(container) {
    // Switch Persona
    container.querySelectorAll('.persona-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const pid = e.currentTarget.getAttribute('data-persona');
        aiEngine.setPersona(pid);
        fx.playPop();
        this.render(container);
      });
    });

    // Quick Prompts
    container.querySelectorAll('.quick-prompt-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const text = e.currentTarget.getAttribute('data-prompt');
        this.handleUserSubmit(text, container);
      });
    });

    // Chat submit
    const form = container.querySelector('#chat-form');
    const input = container.querySelector('#chat-user-input');

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val || this.isGenerating) return;
      input.value = '';
      this.handleUserSubmit(val, container);
    });

    // Clear chat
    container.querySelector('#btn-clear-chat')?.addEventListener('click', () => {
      const event = this.getEvent();
      delete this.chatHistories[event.id];
      this.render(container);
      this.app.showToast('Chat history cleared', 'info');
    });

    // API Key config modal
    container.querySelector('#btn-api-key-config')?.addEventListener('click', () => {
      this.openApiKeyModal();
    });

    // Handle Action card execution
    container.querySelectorAll('.btn-execute-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.getAttribute('data-action');
        if (action === 'apply_budget') {
          this.app.budgetManager.aiRebalanceBudget();
        } else if (action === 'apply_timeline') {
          const event = this.getEvent();
          event.timeline.dayOf.push({
            id: `t-day-${Date.now()}`,
            time: '19:15',
            title: '✨ AI Suggested: Golden Hour Portrait & Sunset Drone Sweep',
            location: 'Scenic Viewpoint',
            lead: 'Photographer',
            notes: 'Capture stunning twilight natural light portraits',
            completed: false
          });
          this.app.saveState();
          fx.launchConfetti();
          this.app.showToast('Added AI milestone to Day-of Run of Show!', 'success');
        }
      });
    });
  }

  async handleUserSubmit(userMessage, container) {
    const event = this.getEvent();
    const history = this.getHistory(event.id);
    const activePersona = AI_PERSONAS.find(p => p.id === aiEngine.activePersona) || AI_PERSONAS[0];

    // Push user message
    history.push({
      role: 'user',
      text: userMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    this.isGenerating = true;
    this.render(container);

    // Prepare assistant placeholder bubble for live streaming
    const messagesBox = container.querySelector('#chat-messages-box');
    const streamBubble = document.createElement('div');
    streamBubble.className = 'chat-bubble-row assistant-row';
    streamBubble.innerHTML = `
      <div class="chat-avatar ai-avatar">✨</div>
      <div class="chat-bubble ai-bubble">
        <div class="bubble-sender">${activePersona.name}</div>
        <div class="bubble-content streaming-text"><span class="typing-cursor">Thinking...</span></div>
      </div>
    `;
    messagesBox.appendChild(streamBubble);
    this.scrollToBottom();

    try {
      const streamEl = streamBubble.querySelector('.streaming-text');

      const response = await aiEngine.generateResponse(userMessage, event, (partial) => {
        streamEl.innerHTML = this.formatMarkdown(partial);
        this.scrollToBottom();
      });

      // Commit finalized message to history
      history.push({
        role: 'assistant',
        persona: activePersona.name,
        text: response.text,
        actionData: response.actionData,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      fx.playChime();
    } catch (err) {
      console.error('AI generation error:', err);
      history.push({
        role: 'assistant',
        persona: activePersona.name,
        text: `⚠️ Apologies, an issue occurred during generation: ${err.message}. Please try again or switch to local engine mode.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } finally {
      this.isGenerating = false;
      this.render(container);
    }
  }

  scrollToBottom() {
    const box = document.getElementById('chat-messages-box');
    if (box) {
      box.scrollTop = box.scrollHeight;
    }
  }

  openApiKeyModal() {
    const currentKey = aiEngine.getApiKey();

    const modalHtml = `
      <div class="modal-overlay active" id="apikey-modal">
        <div class="modal-card">
          <div class="modal-header">
            <h3>🔑 GenAI Engine Settings</h3>
            <button class="modal-close" id="modal-close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <p class="text-sm text-muted mb-3">
              AuraFest includes an ultra-fast, contextual offline AI planning model out-of-the-box.
              You can optionally enter a <strong>Google Gemini API Key</strong> to activate live, cloud-powered GenAI reasoning.
            </p>
            <div class="form-group">
              <label>Google Gemini API Key</label>
              <input type="password" class="form-control" id="gemini-key-input" value="${currentKey}" placeholder="AIzaSy...">
              <small class="text-muted mt-1 d-block">Stored securely in your browser's localStorage. Leave blank to use the high-fidelity built-in engine.</small>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="modal-clear-key">Clear Key (Use Local AI)</button>
              <button type="button" class="btn btn-primary" id="modal-save-key">Save Settings</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modalEl = document.getElementById('apikey-modal');

    const closeModal = () => modalEl.remove();
    modalEl.querySelector('#modal-close-btn').addEventListener('click', closeModal);

    modalEl.querySelector('#modal-save-key').addEventListener('click', () => {
      const keyVal = modalEl.querySelector('#gemini-key-input').value;
      aiEngine.setApiKey(keyVal);
      closeModal();
      this.render(document.querySelector('.tab-content-active'));
      this.app.showToast('AI Settings updated!', 'success');
    });

    modalEl.querySelector('#modal-clear-key').addEventListener('click', () => {
      aiEngine.setApiKey('');
      closeModal();
      this.render(document.querySelector('.tab-content-active'));
      this.app.showToast('Reverted to built-in local GenAI engine', 'info');
    });
  }
}
