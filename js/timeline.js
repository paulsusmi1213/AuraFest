/**
 * AuraFest Celebration Planner - Timeline & Run-of-Show Engine
 * Pre-Event Milestone Roadmap, Minute-by-Minute Day-of Run of Show, and .ICS Calendar Export
 */

import { fx } from './audio-confetti.js';

export class TimelineManager {
  constructor(app) {
    this.app = app;
    this.activeSubView = 'dayOf'; // 'dayOf' or 'preEvent'
  }

  getEvent() {
    return this.app.getActiveEvent();
  }

  render(container) {
    const event = this.getEvent();
    if (!event || !event.timeline) return;

    const dayOfItems = event.timeline.dayOf || [];
    const preEventItems = event.timeline.preEvent || [];

    const completedDayOf = dayOfItems.filter(i => i.completed).length;
    const progressDayOf = dayOfItems.length ? Math.round((completedDayOf / dayOfItems.length) * 100) : 0;

    const completedPre = preEventItems.filter(i => i.completed).length;
    const progressPre = preEventItems.length ? Math.round((completedPre / preEventItems.length) * 100) : 0;

    container.innerHTML = `
      <div class="timeline-section">
        <!-- Header Controls & Subview Switcher -->
        <div class="timeline-header-bar card glass-card">
          <div class="timeline-title-area">
            <h2 class="card-title">Run of Show & Milestone Roadmap</h2>
            <p class="card-subtitle">
              Precision timing for <strong>${event.title}</strong> on <strong>${event.date}</strong> at <strong>${event.time}</strong>
            </p>
          </div>

          <div class="timeline-actions-area">
            <div class="subtab-pills">
              <button class="subtab-btn ${this.activeSubView === 'dayOf' ? 'active' : ''}" id="btn-subtab-dayof">
                ⏱️ Day-Of Run of Show (${dayOfItems.length})
              </button>
              <button class="subtab-btn ${this.activeSubView === 'preEvent' ? 'active' : ''}" id="btn-subtab-preevent">
                🗓️ Pre-Event Roadmap (${preEventItems.length})
              </button>
            </div>

            <div class="btn-group">
              <button class="btn btn-secondary btn-sm" id="btn-export-ics" title="Export to Apple / Google / Outlook Calendar">
                📅 Export .ICS
              </button>
              <button class="btn btn-primary btn-sm" id="btn-add-milestone">
                + Add Milestone
              </button>
            </div>
          </div>
        </div>

        <!-- Progress Indicator Bar -->
        <div class="timeline-progress-banner card glass-card my-3">
          <div class="progress-info-flex">
            <span>
              <strong>${this.activeSubView === 'dayOf' ? 'Day-of Schedule Execution' : 'Pre-Event Preparation Readiness'}:</strong>
              ${this.activeSubView === 'dayOf' ? `${completedDayOf} of ${dayOfItems.length} items checked` : `${completedPre} of ${preEventItems.length} milestones cleared`}
            </span>
            <span class="font-bold text-gold">${this.activeSubView === 'dayOf' ? progressDayOf : progressPre}% Completed</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width: ${this.activeSubView === 'dayOf' ? progressDayOf : progressPre}%; background: linear-gradient(90deg, #D4AF37, #F59E0B)"></div>
          </div>
        </div>

        <!-- Dynamic Content View -->
        ${this.activeSubView === 'dayOf' ? this.renderDayOfView(dayOfItems) : this.renderPreEventView(preEventItems)}
      </div>
    `;

    this.bindEvents(container);
  }

  renderDayOfView(items) {
    if (items.length === 0) {
      return `
        <div class="card glass-card text-center py-5">
          <p class="text-muted">No Day-of milestones added yet.</p>
          <button class="btn btn-primary btn-sm mt-3" id="btn-ai-gen-dayof">✨ Generate Schedule with AI</button>
        </div>
      `;
    }

    // Sort by time
    const sorted = [...items].sort((a, b) => (a.time || '').localeCompare(b.time || ''));

    return `
      <div class="run-of-show-timeline">
        ${sorted.map((item, idx) => `
          <div class="timeline-entry ${item.completed ? 'completed' : ''}" data-id="${item.id}">
            <div class="timeline-time-col">
              <span class="timeline-time-badge">${item.time || 'TBD'}</span>
              <div class="timeline-vertical-line"></div>
            </div>

            <div class="timeline-content-card card glass-card">
              <div class="timeline-entry-header">
                <div class="timeline-title-row">
                  <button class="check-toggle ${item.completed ? 'checked' : ''}" data-id="${item.id}" title="Toggle Completed">
                    ${item.completed ? '✓' : ''}
                  </button>
                  <h4 class="timeline-item-title ${item.completed ? 'line-through' : ''}">${item.title}</h4>
                </div>

                <div class="btn-group-sm">
                  <button class="btn-icon btn-edit-milestone" data-id="${item.id}" title="Edit">✏️</button>
                  <button class="btn-icon btn-del-milestone" data-id="${item.id}" title="Delete">🗑️</button>
                </div>
              </div>

              <div class="timeline-meta-tags">
                ${item.location ? `<span class="badge badge-outline">📍 ${item.location}</span>` : ''}
                ${item.lead ? `<span class="badge badge-purple">👤 Lead: ${item.lead}</span>` : ''}
              </div>

              ${item.notes ? `<p class="timeline-notes">${item.notes}</p>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderPreEventView(items) {
    if (items.length === 0) {
      return `
        <div class="card glass-card text-center py-5">
          <p class="text-muted">No Pre-event milestones added yet.</p>
        </div>
      `;
    }

    return `
      <div class="pre-event-grid">
        ${items.map(item => `
          <div class="card glass-card pre-event-card ${item.completed ? 'completed' : ''}" data-id="${item.id}">
            <div class="pre-event-header">
              <span class="badge badge-gold">${item.phase}</span>
              <button class="check-toggle ${item.completed ? 'checked' : ''}" data-id="${item.id}">
                ${item.completed ? '✓' : ''}
              </button>
            </div>
            <h4 class="pre-event-task ${item.completed ? 'line-through text-muted' : ''}">${item.task}</h4>
            <div class="pre-event-footer">
              <span class="text-muted text-sm">Owner: <strong>${item.owner || 'Planner'}</strong></span>
              <div class="btn-group-sm">
                <button class="btn-icon btn-del-preevent" data-id="${item.id}" title="Delete">🗑️</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  bindEvents(container) {
    // Subtab switcher
    container.querySelector('#btn-subtab-dayof')?.addEventListener('click', () => {
      this.activeSubView = 'dayOf';
      this.render(container);
    });

    container.querySelector('#btn-subtab-preevent')?.addEventListener('click', () => {
      this.activeSubView = 'preEvent';
      this.render(container);
    });

    // Check toggles
    container.querySelectorAll('.check-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.toggleMilestone(id, e.clientX, e.clientY);
      });
    });

    // Export ICS
    container.querySelector('#btn-export-ics')?.addEventListener('click', () => {
      this.exportIcsCalendar();
    });

    // Add milestone modal
    container.querySelector('#btn-add-milestone')?.addEventListener('click', () => {
      this.openMilestoneModal();
    });

    // AI Generate schedule
    container.querySelector('#btn-ai-gen-dayof')?.addEventListener('click', () => {
      this.app.openAiChatWithPrompt(`Generate an optimized day-of run of show for ${this.getEvent().title}`);
    });

    // Edit and Delete
    container.querySelectorAll('.btn-edit-milestone').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.openMilestoneModal(id);
      });
    });

    container.querySelectorAll('.btn-del-milestone').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.deleteMilestone(id, 'dayOf');
      });
    });

    container.querySelectorAll('.btn-del-preevent').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.deleteMilestone(id, 'preEvent');
      });
    });
  }

  toggleMilestone(id, clickX, clickY) {
    const event = this.getEvent();
    const dayItem = event.timeline.dayOf?.find(i => i.id === id);
    if (dayItem) {
      dayItem.completed = !dayItem.completed;
      if (dayItem.completed) {
        fx.launchConfetti(clickX || window.innerWidth / 2, clickY || window.innerHeight / 2, 40);
      } else {
        fx.playPop();
      }
    }

    const preItem = event.timeline.preEvent?.find(i => i.id === id);
    if (preItem) {
      preItem.completed = !preItem.completed;
      if (preItem.completed) {
        fx.launchConfetti(clickX || window.innerWidth / 2, clickY || window.innerHeight / 2, 40);
      } else {
        fx.playPop();
      }
    }

    this.app.saveState();
    this.app.renderActiveTab();
  }

  openMilestoneModal(existingId = null) {
    const event = this.getEvent();
    const isDayOf = this.activeSubView === 'dayOf';
    
    let item = isDayOf ? {
      time: '16:00',
      title: '',
      location: '',
      lead: '',
      notes: ''
    } : {
      phase: '1 Month Out',
      task: '',
      owner: 'Planner'
    };

    if (existingId) {
      const list = isDayOf ? event.timeline.dayOf : event.timeline.preEvent;
      const found = list.find(i => i.id === existingId);
      if (found) item = { ...found };
    }

    const modalHtml = `
      <div class="modal-overlay active" id="milestone-modal">
        <div class="modal-card">
          <div class="modal-header">
            <h3>${existingId ? 'Edit Milestone' : (isDayOf ? 'Add Day-of Schedule Item' : 'Add Pre-Event Roadmap Task')}</h3>
            <button class="modal-close" id="modal-close-btn">&times;</button>
          </div>
          <form id="milestone-form" class="modal-body">
            ${isDayOf ? `
              <div class="form-row">
                <div class="form-group flex-1">
                  <label>Scheduled Time *</label>
                  <input type="time" class="form-control" name="time" value="${item.time || '16:00'}" required>
                </div>
                <div class="form-group flex-2">
                  <label>Activity / Milestone Title *</label>
                  <input type="text" class="form-control" name="title" value="${item.title || ''}" required placeholder="e.g. Cocktail Hour & Passed Canapes">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group flex-1">
                  <label>Location / Zone</label>
                  <input type="text" class="form-control" name="location" value="${item.location || ''}" placeholder="e.g. Terrace Courtyard">
                </div>
                <div class="form-group flex-1">
                  <label>Lead Coordinator / Person</label>
                  <input type="text" class="form-control" name="lead" value="${item.lead || ''}" placeholder="e.g. Catering Director">
                </div>
              </div>
              <div class="form-group">
                <label>Operational Notes & Cues</label>
                <textarea class="form-control" name="notes" rows="2" placeholder="e.g. Wireless mic check, sparkler distribution...">${item.notes || ''}</textarea>
              </div>
            ` : `
              <div class="form-row">
                <div class="form-group flex-1">
                  <label>Timeline Phase *</label>
                  <select class="form-control" name="phase">
                    <option value="6-8 Months Out" ${item.phase === '6-8 Months Out' ? 'selected' : ''}>6-8 Months Out</option>
                    <option value="4-6 Months Out" ${item.phase === '4-6 Months Out' ? 'selected' : ''}>4-6 Months Out</option>
                    <option value="2-3 Months Out" ${item.phase === '2-3 Months Out' ? 'selected' : ''}>2-3 Months Out</option>
                    <option value="1 Month Out" ${item.phase === '1 Month Out' ? 'selected' : ''}>1 Month Out</option>
                    <option value="1 Week Out" ${item.phase === '1 Week Out' ? 'selected' : ''}>1 Week Out</option>
                    <option value="Day Before" ${item.phase === 'Day Before' ? 'selected' : ''}>Day Before</option>
                  </select>
                </div>
                <div class="form-group flex-1">
                  <label>Responsible Owner</label>
                  <input type="text" class="form-control" name="owner" value="${item.owner || ''}" placeholder="e.g. Lead Planner / Host">
                </div>
              </div>
              <div class="form-group">
                <label>Task Description *</label>
                <input type="text" class="form-control" name="task" value="${item.task || ''}" required placeholder="e.g. Finalize seating chart & order calligraphy place cards">
              </div>
            `}

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
              <button type="submit" class="btn btn-primary">${existingId ? 'Save Changes' : 'Add to Schedule'}</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modalEl = document.getElementById('milestone-modal');

    const closeModal = () => modalEl.remove();
    modalEl.querySelector('#modal-close-btn').addEventListener('click', closeModal);
    modalEl.querySelector('#modal-cancel-btn').addEventListener('click', closeModal);

    modalEl.querySelector('#milestone-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);

      if (isDayOf) {
        const newItem = {
          id: existingId || `t-day-${Date.now()}`,
          time: formData.get('time'),
          title: formData.get('title'),
          location: formData.get('location'),
          lead: formData.get('lead'),
          notes: formData.get('notes'),
          completed: item.completed || false
        };

        if (existingId) {
          const idx = event.timeline.dayOf.findIndex(i => i.id === existingId);
          if (idx !== -1) event.timeline.dayOf[idx] = newItem;
        } else {
          event.timeline.dayOf.push(newItem);
          fx.playPop();
        }
      } else {
        const newItem = {
          id: existingId || `t-pre-${Date.now()}`,
          phase: formData.get('phase'),
          task: formData.get('task'),
          owner: formData.get('owner'),
          completed: item.completed || false
        };

        if (existingId) {
          const idx = event.timeline.preEvent.findIndex(i => i.id === existingId);
          if (idx !== -1) event.timeline.preEvent[idx] = newItem;
        } else {
          event.timeline.preEvent.push(newItem);
          fx.playPop();
        }
      }

      this.app.saveState();
      closeModal();
      this.app.renderActiveTab();
      this.app.showToast('Schedule updated', 'success');
    });
  }

  deleteMilestone(id, type) {
    if (!confirm('Are you sure you want to delete this schedule item?')) return;
    const event = this.getEvent();
    if (type === 'dayOf') {
      event.timeline.dayOf = event.timeline.dayOf.filter(i => i.id !== id);
    } else {
      event.timeline.preEvent = event.timeline.preEvent.filter(i => i.id !== id);
    }
    this.app.saveState();
    this.app.renderActiveTab();
    this.app.showToast('Item deleted', 'info');
  }

  exportIcsCalendar() {
    const event = this.getEvent();
    const eventDate = (event.date || '2026-11-14').replace(/-/g, '');
    const dayOfItems = event.timeline.dayOf || [];

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AuraFest Celebration Planner//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    dayOfItems.forEach(item => {
      const timeClean = (item.time || '12:00').replace(':', '') + '00';
      const dtStart = `${eventDate}T${timeClean}`;
      
      // Calculate end time (default +45 mins)
      const [h, m] = (item.time || '12:00').split(':').map(Number);
      const d = new Date();
      d.setHours(h, m + 45, 0);
      const endClean = d.toTimeString().substring(0, 5).replace(':', '') + '00';
      const dtEnd = `${eventDate}T${endClean}`;

      icsContent.push('BEGIN:VEVENT');
      icsContent.push(`UID:${item.id}@aurafest.ai`);
      icsContent.push(`DTSTAMP:${eventDate}T000000Z`);
      icsContent.push(`DTSTART:${dtStart}`);
      icsContent.push(`DTEND:${dtEnd}`);
      icsContent.push(`SUMMARY:${event.title}: ${item.title}`);
      icsContent.push(`LOCATION:${item.location || event.location}`);
      icsContent.push(`DESCRIPTION:${item.notes || ''} (Lead: ${item.lead || 'Coordinator'})`);
      icsContent.push('STATUS:CONFIRMED');
      icsContent.push('END:VEVENT');
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_timeline.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.app.showToast('📅 Calendar .ICS exported! Open in Apple/Google Calendar.', 'success');
  }
}
