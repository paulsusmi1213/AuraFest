/**
 * AuraFest Celebration Planner - Guest List & RSVP Manager
 * RSVP metrics, dietary counters, table assignment, and CSV export
 */

import { fx } from './audio-confetti.js';

export class GuestsManager {
  constructor(app) {
    this.app = app;
    this.rsvpFilter = 'all';
    this.dietaryFilter = 'all';
  }

  getEvent() {
    return this.app.getActiveEvent();
  }

  render(container) {
    const event = this.getEvent();
    if (!event) return;

    const guests = event.guests || [];
    
    // Compute RSVP metrics
    const attendingGuests = guests.filter(g => g.rsvp === 'Attending');
    const attendingHeadcount = attendingGuests.reduce((sum, g) => sum + (Number(g.count) || 1), 0);
    const declinedCount = guests.filter(g => g.rsvp === 'Declined').length;
    const pendingCount = guests.filter(g => g.rsvp === 'Pending').length;
    const target = event.guestsTarget || 100;

    // Dietary counts
    const dietaryMap = {};
    attendingGuests.forEach(g => {
      const diet = g.dietary || 'None';
      if (diet !== 'None') {
        dietaryMap[diet] = (dietaryMap[diet] || 0) + (Number(g.count) || 1);
      }
    });

    // Filter guests
    const filteredGuests = guests.filter(g => {
      const matchRsvp = this.rsvpFilter === 'all' || g.rsvp === this.rsvpFilter;
      const matchDiet = this.dietaryFilter === 'all' || g.dietary === this.dietaryFilter;
      return matchRsvp && matchDiet;
    });

    container.innerHTML = `
      <div class="guests-section">
        <!-- RSVP Summary Metrics -->
        <div class="metrics-grid">
          <div class="metric-card glow-card">
            <div class="metric-icon emerald">👥</div>
            <div class="metric-content">
              <span class="metric-label">Confirmed Attending</span>
              <div class="metric-value text-emerald">${attendingHeadcount}</div>
              <span class="metric-sub">${Math.round((attendingHeadcount / target) * 100)}% of ${target} target capacity</span>
            </div>
          </div>

          <div class="metric-card glow-card">
            <div class="metric-icon gold">⏳</div>
            <div class="metric-content">
              <span class="metric-label">Pending Responses</span>
              <div class="metric-value text-gold">${pendingCount}</div>
              <span class="metric-sub">Follow-up needed</span>
            </div>
          </div>

          <div class="metric-card glow-card">
            <div class="metric-icon rose">✉️</div>
            <div class="metric-content">
              <span class="metric-label">Declined / Regrets</span>
              <div class="metric-value text-muted">${declinedCount}</div>
              <span class="metric-sub">Seats freed</span>
            </div>
          </div>

          <div class="metric-card glow-card">
            <div class="metric-icon purple">🥗</div>
            <div class="metric-content">
              <span class="metric-label">Special Dietary Reqs</span>
              <div class="metric-value">${Object.values(dietaryMap).reduce((a, b) => a + b, 0)}</div>
              <span class="metric-sub">Noted for catering staff</span>
            </div>
          </div>
        </div>

        <!-- Dietary Requirements Bar -->
        ${Object.keys(dietaryMap).length > 0 ? `
          <div class="card glass-card my-3 py-2 px-3 dietary-banner">
            <span class="font-bold text-sm">🥗 Special Menus:</span>
            <div class="dietary-pills-row">
              ${Object.entries(dietaryMap).map(([diet, count]) => `
                <span class="badge badge-outline">${diet}: <strong>${count}</strong></span>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Main Table & Actions -->
        <div class="card glass-card mt-3">
          <div class="table-toolbar">
            <div class="toolbar-left">
              <h3 class="card-title">Guest Directory & Seating</h3>
              <div class="filter-pills">
                <button class="pill-btn ${this.rsvpFilter === 'all' ? 'active' : ''}" data-grsvp="all">All Guests (${guests.length})</button>
                <button class="pill-btn ${this.rsvpFilter === 'Attending' ? 'active' : ''}" data-grsvp="Attending">Attending</button>
                <button class="pill-btn ${this.rsvpFilter === 'Pending' ? 'active' : ''}" data-grsvp="Pending">Pending</button>
                <button class="pill-btn ${this.rsvpFilter === 'Declined' ? 'active' : ''}" data-grsvp="Declined">Declined</button>
              </div>
            </div>

            <div class="toolbar-right">
              <button class="btn btn-secondary btn-sm" id="btn-export-csv">📥 Export CSV</button>
              <button class="btn btn-primary btn-sm" id="btn-add-guest">+ Add Guest</button>
            </div>
          </div>

          <div class="table-responsive">
            <table class="aurafest-table">
              <thead>
                <tr>
                  <th>Guest / Party Name</th>
                  <th>Contact Email</th>
                  <th>Party Size</th>
                  <th>RSVP Status</th>
                  <th>Dietary Needs</th>
                  <th>Table / Seating Zone</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${filteredGuests.length === 0 ? `
                  <tr>
                    <td colspan="7" class="text-center py-4 text-muted">No guests match the selected filter.</td>
                  </tr>
                ` : filteredGuests.map(g => `
                  <tr data-id="${g.id}">
                    <td>
                      <div class="font-medium">${g.name}</div>
                    </td>
                    <td><span class="text-muted">${g.email || '—'}</span></td>
                    <td><span class="badge badge-purple">${g.count} pax</span></td>
                    <td>
                      <span class="badge status-badge status-${(g.rsvp || 'Pending').toLowerCase()}">
                        ${g.rsvp}
                      </span>
                    </td>
                    <td>
                      <span class="badge ${g.dietary && g.dietary !== 'None' ? 'badge-gold' : 'badge-subtle'}">
                        ${g.dietary || 'None'}
                      </span>
                    </td>
                    <td><span class="text-sm font-medium">${g.table || 'Unassigned'}</span></td>
                    <td class="text-right">
                      <div class="btn-group-sm">
                        <button class="btn-icon btn-edit-guest" data-id="${g.id}" title="Edit">✏️</button>
                        <button class="btn-icon btn-del-guest" data-id="${g.id}" title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container);
  }

  bindEvents(container) {
    // RSVP filter
    container.querySelectorAll('[data-grsvp]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.rsvpFilter = e.currentTarget.getAttribute('data-grsvp');
        this.render(container);
      });
    });

    // Add Guest
    container.querySelector('#btn-add-guest')?.addEventListener('click', () => {
      this.openGuestModal();
    });

    // Edit Guest
    container.querySelectorAll('.btn-edit-guest').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.openGuestModal(id);
      });
    });

    // Delete Guest
    container.querySelectorAll('.btn-del-guest').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.deleteGuest(id);
      });
    });

    // Export CSV
    container.querySelector('#btn-export-csv')?.addEventListener('click', () => {
      this.exportCsv();
    });
  }

  openGuestModal(existingId = null) {
    const event = this.getEvent();
    let guest = {
      name: '',
      email: '',
      count: 1,
      rsvp: 'Attending',
      dietary: 'None',
      table: ''
    };

    if (existingId) {
      const found = event.guests.find(g => g.id === existingId);
      if (found) guest = { ...found };
    }

    const modalHtml = `
      <div class="modal-overlay active" id="guest-modal">
        <div class="modal-card">
          <div class="modal-header">
            <h3>${existingId ? 'Edit Guest' : 'Add Guest to Party'}</h3>
            <button class="modal-close" id="modal-close-btn">&times;</button>
          </div>
          <form id="guest-form" class="modal-body">
            <div class="form-row">
              <div class="form-group flex-2">
                <label>Guest / Party Name *</label>
                <input type="text" class="form-control" name="name" value="${guest.name}" required placeholder="e.g. Dr. Arthur Pendelton">
              </div>
              <div class="form-group flex-1">
                <label>Party Size *</label>
                <input type="number" min="1" max="50" class="form-control" name="count" value="${guest.count || 1}" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label>Contact Email</label>
                <input type="email" class="form-control" name="email" value="${guest.email || ''}" placeholder="guest@email.com">
              </div>
              <div class="form-group flex-1">
                <label>RSVP Status</label>
                <select class="form-control" name="rsvp">
                  <option value="Attending" ${guest.rsvp === 'Attending' ? 'selected' : ''}>Attending</option>
                  <option value="Pending" ${guest.rsvp === 'Pending' ? 'selected' : ''}>Pending</option>
                  <option value="Declined" ${guest.rsvp === 'Declined' ? 'selected' : ''}>Declined</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label>Dietary Restrictions</label>
                <select class="form-control" name="dietary">
                  <option value="None" ${guest.dietary === 'None' ? 'selected' : ''}>None / Standard Menu</option>
                  <option value="Vegetarian" ${guest.dietary === 'Vegetarian' ? 'selected' : ''}>Vegetarian</option>
                  <option value="Vegan" ${guest.dietary === 'Vegan' ? 'selected' : ''}>Vegan</option>
                  <option value="Gluten-Free" ${guest.dietary === 'Gluten-Free' ? 'selected' : ''}>Gluten-Free</option>
                  <option value="Halal" ${guest.dietary === 'Halal' ? 'selected' : ''}>Halal</option>
                  <option value="Kosher" ${guest.dietary === 'Kosher' ? 'selected' : ''}>Kosher</option>
                  <option value="Nut Allergy" ${guest.dietary === 'Nut Allergy' ? 'selected' : ''}>Nut Allergy</option>
                  <option value="Pescatarian" ${guest.dietary === 'Pescatarian' ? 'selected' : ''}>Pescatarian</option>
                </select>
              </div>

              <div class="form-group flex-1">
                <label>Table / Seating Assignment</label>
                <input type="text" class="form-control" name="table" value="${guest.table || ''}" placeholder="e.g. Table 1 - Family">
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
              <button type="submit" class="btn btn-primary">${existingId ? 'Save Changes' : 'Add Guest'}</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modalEl = document.getElementById('guest-modal');

    const closeModal = () => modalEl.remove();
    modalEl.querySelector('#modal-close-btn').addEventListener('click', closeModal);
    modalEl.querySelector('#modal-cancel-btn').addEventListener('click', closeModal);

    modalEl.querySelector('#guest-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);

      const newGuest = {
        id: existingId || `g-${Date.now()}`,
        name: formData.get('name'),
        count: Number(formData.get('count')) || 1,
        email: formData.get('email'),
        rsvp: formData.get('rsvp'),
        dietary: formData.get('dietary'),
        table: formData.get('table')
      };

      if (existingId) {
        const idx = event.guests.findIndex(g => g.id === existingId);
        if (idx !== -1) event.guests[idx] = newGuest;
      } else {
        event.guests.push(newGuest);
        fx.playPop();
      }

      this.app.saveState();
      closeModal();
      this.app.renderActiveTab();
      this.app.showToast('Guest record updated', 'success');
    });
  }

  deleteGuest(id) {
    if (!confirm('Remove this guest from the invitation roster?')) return;
    const event = this.getEvent();
    event.guests = event.guests.filter(g => g.id !== id);
    this.app.saveState();
    this.app.renderActiveTab();
    this.app.showToast('Guest removed', 'info');
  }

  exportCsv() {
    const event = this.getEvent();
    const guests = event.guests || [];

    const headers = ['Name', 'Email', 'Party Size', 'RSVP Status', 'Dietary Restrictions', 'Table Assignment'];
    const rows = guests.map(g => [
      `"${g.name.replace(/"/g, '""')}"`,
      `"${(g.email || '').replace(/"/g, '""')}"`,
      g.count || 1,
      `"${g.rsvp || 'Pending'}"`,
      `"${(g.dietary || 'None').replace(/"/g, '""')}"`,
      `"${(g.table || 'Unassigned').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_guests.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.app.showToast('📥 Guest list exported to CSV!', 'success');
  }
}
