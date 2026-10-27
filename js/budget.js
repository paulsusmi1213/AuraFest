/**
 * AuraFest Celebration Planner - Budget & Expense Tracker
 * Real-time calculations, SVG Donut Chart, Category progress bars, and AI Rebalancer
 */

import { fx } from './audio-confetti.js';

export class BudgetManager {
  constructor(app) {
    this.app = app;
    this.currentFilter = 'all';
    this.statusFilter = 'all';
  }

  getEvent() {
    return this.app.getActiveEvent();
  }

  render(container) {
    const event = this.getEvent();
    if (!event || !event.budget) return;

    const currency = event.currency || '$';
    const totalBudget = event.budgetTotal || 0;
    const items = event.budget.items || [];
    const categories = event.budget.categories || [];

    // Calculate totals
    const totalSpent = items.reduce((sum, item) => sum + (Number(item.actual) || 0), 0);
    const totalEstimated = items.reduce((sum, item) => sum + (Number(item.estimated) || 0), 0);
    const remaining = totalBudget - totalSpent;
    const percentSpent = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;
    const guests = event.guestsTarget || 1;
    const costPerGuest = Math.round(totalSpent / guests);
    const plannedPerGuest = Math.round(totalBudget / guests);

    // Filter items
    const filteredItems = items.filter(item => {
      const matchCat = this.currentFilter === 'all' || item.category === this.currentFilter;
      const matchStatus = this.statusFilter === 'all' || item.status === this.statusFilter;
      return matchCat && matchStatus;
    });

    container.innerHTML = `
      <div class="budget-dashboard">
        <!-- Top Metrics Cards -->
        <div class="metrics-grid">
          <div class="metric-card glow-card">
            <div class="metric-icon gold">💰</div>
            <div class="metric-content">
              <span class="metric-label">Total Planned Budget</span>
              <div class="metric-value">${currency}${totalBudget.toLocaleString()}</div>
              <span class="metric-sub">${currency}${plannedPerGuest.toLocaleString()} per guest target</span>
            </div>
          </div>

          <div class="metric-card glow-card">
            <div class="metric-icon purple">💳</div>
            <div class="metric-content">
              <span class="metric-label">Actual Committed / Spent</span>
              <div class="metric-value">${currency}${totalSpent.toLocaleString()}</div>
              <span class="metric-sub">${percentSpent}% of total funds</span>
            </div>
          </div>

          <div class="metric-card glow-card">
            <div class="metric-icon ${remaining >= 0 ? 'emerald' : 'rose'}">
              ${remaining >= 0 ? '🛡️' : '⚠️'}
            </div>
            <div class="metric-content">
              <span class="metric-label">${remaining >= 0 ? 'Remaining Cushion' : 'Budget Overrun'}</span>
              <div class="metric-value ${remaining < 0 ? 'text-rose' : 'text-emerald'}">
                ${currency}${Math.abs(remaining).toLocaleString()}
              </div>
              <span class="metric-sub">${remaining >= 0 ? 'Safe & well-allocated' : 'Action needed: Trim expenses'}</span>
            </div>
          </div>

          <div class="metric-card glow-card">
            <div class="metric-icon blue">👥</div>
            <div class="metric-content">
              <span class="metric-label">Actual Cost Per Guest</span>
              <div class="metric-value">${currency}${costPerGuest.toLocaleString()}</div>
              <span class="metric-sub">Across ${guests} invited guests</span>
            </div>
          </div>
        </div>

        <!-- Budget Visual Breakdown Section -->
        <div class="budget-visual-split">
          <!-- Donut Chart & Category Breakdown -->
          <div class="card glass-card visual-card">
            <div class="card-header-flex">
              <div>
                <h3 class="card-title">Allocation by Pillar</h3>
                <p class="card-subtitle">Visual distribution across major celebration pillars</p>
              </div>
              <button class="btn btn-secondary btn-sm" id="btn-ai-rebalance">
                <span class="sparkle-icon">✨</span> AI Rebalance
              </button>
            </div>

            <div class="chart-and-legend">
              <div class="donut-chart-wrapper" id="budget-donut-container">
                ${this.renderDonutChart(categories, totalBudget, currency)}
              </div>
              <div class="category-bars-list">
                ${categories.map((cat, idx) => {
                  const catSpent = items
                    .filter(i => i.category === cat.name)
                    .reduce((sum, i) => sum + (Number(i.actual) || 0), 0);
                  const catAllocated = cat.allocated || 1;
                  const catPercent = Math.min(100, Math.round((catSpent / catAllocated) * 100));
                  const colors = ['#D4AF37', '#8B5CF6', '#06B6D4', '#EC4899', '#10B981', '#F59E0B', '#64748B'];
                  const color = colors[idx % colors.length];

                  return `
                    <div class="cat-progress-item">
                      <div class="cat-label-row">
                        <span class="cat-name">
                          <span class="cat-dot" style="background-color: ${color}"></span>
                          ${cat.name}
                        </span>
                        <span class="cat-amount">
                          <strong>${currency}${catSpent.toLocaleString()}</strong> 
                          <span class="text-muted">/ ${currency}${catAllocated.toLocaleString()}</span>
                        </span>
                      </div>
                      <div class="progress-bar-track">
                        <div class="progress-bar-fill" style="width: ${catPercent}%; background-color: ${color}"></div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <!-- Quick AI Expense Advisor -->
          <div class="card glass-card ai-budget-insight-card">
            <div class="ai-badge-row">
              <span class="badge badge-purple">✨ Aura AI Comptroller</span>
              <span class="badge badge-gold">Health Score 96%</span>
            </div>
            <h4 class="insight-title">Smart Budget Intelligence</h4>
            <p class="insight-text">
              Your catering & beverage commitment is at <strong>38%</strong>, which matches the golden ratio for 
              <strong>${event.type === 'wedding' ? 'luxury vineyard weddings' : 'milestone celebrations'}</strong>.
            </p>
            <div class="insight-bullets">
              <div class="insight-bullet">
                <span class="check-icon">✓</span>
                <span>Vendor tips and overtime buffers are guarded in the contingency pool.</span>
              </div>
              <div class="insight-bullet">
                <span class="check-icon">✓</span>
                <span>Average vendor quote is locked with contractual price ceilings.</span>
              </div>
            </div>
            <div class="insight-cta-row">
              <button class="btn btn-primary btn-sm w-100" id="btn-ask-ai-savings">
                Ask AI: "How can I shave 10% from this budget?"
              </button>
            </div>
          </div>
        </div>

        <!-- Expense Line Items & Actions -->
        <div class="card glass-card mt-4">
          <div class="table-toolbar">
            <div class="toolbar-left">
              <h3 class="card-title">Expense Line Items</h3>
              <div class="filter-pills">
                <button class="pill-btn ${this.currentFilter === 'all' ? 'active' : ''}" data-cat="all">All Pillars</button>
                ${categories.map(c => `
                  <button class="pill-btn ${this.currentFilter === c.name ? 'active' : ''}" data-cat="${c.name}">${c.name}</button>
                `).join('')}
              </div>
            </div>

            <div class="toolbar-right">
              <select class="form-select form-select-sm" id="filter-payment-status">
                <option value="all" ${this.statusFilter === 'all' ? 'selected' : ''}>All Statuses</option>
                <option value="Paid" ${this.statusFilter === 'Paid' ? 'selected' : ''}>Paid in Full</option>
                <option value="Deposit Paid" ${this.statusFilter === 'Deposit Paid' ? 'selected' : ''}>Deposit Paid</option>
                <option value="Pending" ${this.statusFilter === 'Pending' ? 'selected' : ''}>Pending</option>
              </select>
              <button class="btn btn-primary btn-sm" id="btn-add-expense">
                + Add Expense
              </button>
            </div>
          </div>

          <div class="table-responsive">
            <table class="aurafest-table">
              <thead>
                <tr>
                  <th>Expense Item</th>
                  <th>Pillar</th>
                  <th>Vendor</th>
                  <th>Estimated</th>
                  <th>Actual / Committed</th>
                  <th>Payment Status</th>
                  <th>Due Date</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${filteredItems.length === 0 ? `
                  <tr>
                    <td colspan="8" class="text-center py-4 text-muted">No expenses found matching the current filter.</td>
                  </tr>
                ` : filteredItems.map(item => `
                  <tr data-id="${item.id}">
                    <td>
                      <div class="item-title font-medium">${item.title}</div>
                    </td>
                    <td><span class="badge badge-outline">${item.category}</span></td>
                    <td><span class="text-muted">${item.vendor || '—'}</span></td>
                    <td>${currency}${(Number(item.estimated) || 0).toLocaleString()}</td>
                    <td><strong>${currency}${(Number(item.actual) || 0).toLocaleString()}</strong></td>
                    <td>
                      <span class="badge status-badge status-${(item.status || 'Pending').toLowerCase().replace(' ', '-')}">
                        ${item.status}
                      </span>
                    </td>
                    <td><span class="text-muted text-sm">${item.dueDate || '—'}</span></td>
                    <td class="text-right">
                      <div class="btn-group-sm">
                        <button class="btn-icon btn-edit-expense" title="Edit" data-id="${item.id}">✏️</button>
                        <button class="btn-icon btn-del-expense" title="Delete" data-id="${item.id}">🗑️</button>
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

  renderDonutChart(categories, totalBudget, currency) {
    const size = 200;
    const strokeWidth = 28;
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;

    const colors = ['#D4AF37', '#8B5CF6', '#06B6D4', '#EC4899', '#10B981', '#F59E0B', '#64748B'];
    let cumulativePercent = 0;

    const slices = categories.map((cat, idx) => {
      const share = totalBudget > 0 ? (cat.allocated / totalBudget) : (1 / categories.length);
      const dashLength = share * circumference;
      const strokeDashoffset = -cumulativePercent * circumference;
      cumulativePercent += share;
      const color = colors[idx % colors.length];

      return `
        <circle
          cx="${center}"
          cy="${center}"
          r="${radius}"
          fill="none"
          stroke="${color}"
          stroke-width="${strokeWidth}"
          stroke-dasharray="${dashLength} ${circumference - dashLength}"
          stroke-dashoffset="${strokeDashoffset}"
          class="donut-segment"
          data-name="${cat.name}"
          data-amount="${currency}${cat.allocated.toLocaleString()}"
        >
          <title>${cat.name}: ${currency}${cat.allocated.toLocaleString()} (${Math.round(share * 100)}%)</title>
        </circle>
      `;
    }).join('');

    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="donut-svg">
        <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="${strokeWidth}" />
        <g transform="rotate(-90 ${center} ${center})">
          ${slices}
        </g>
        <text x="${center}" y="${center - 6}" text-anchor="middle" class="donut-center-label">TOTAL</text>
        <text x="${center}" y="${center + 16}" text-anchor="middle" class="donut-center-value">${currency}${totalBudget.toLocaleString()}</text>
      </svg>
    `;
  }

  bindEvents(container) {
    // Filter pills
    container.querySelectorAll('.pill-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentFilter = e.currentTarget.getAttribute('data-cat');
        this.render(container);
      });
    });

    // Payment status filter
    const statusSelect = container.querySelector('#filter-payment-status');
    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        this.statusFilter = e.target.value;
        this.render(container);
      });
    }

    // AI Rebalance button
    const btnRebalance = container.querySelector('#btn-ai-rebalance');
    if (btnRebalance) {
      btnRebalance.addEventListener('click', () => {
        this.aiRebalanceBudget();
      });
    }

    // AI Savings Question prompt
    const btnAskAiSavings = container.querySelector('#btn-ask-ai-savings');
    if (btnAskAiSavings) {
      btnAskAiSavings.addEventListener('click', () => {
        this.app.openAiChatWithPrompt('How can I shave 10% to 15% from this celebration budget without hurting guest experience?');
      });
    }

    // Add Expense Modal
    const btnAdd = container.querySelector('#btn-add-expense');
    if (btnAdd) {
      btnAdd.addEventListener('click', () => {
        this.openExpenseModal();
      });
    }

    // Edit and Delete buttons
    container.querySelectorAll('.btn-edit-expense').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.openExpenseModal(id);
      });
    });

    container.querySelectorAll('.btn-del-expense').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.deleteExpense(id);
      });
    });
  }

  openExpenseModal(existingId = null) {
    const event = this.getEvent();
    const categories = event.budget.categories.map(c => c.name);
    let item = {
      title: '',
      category: categories[0] || 'Venue',
      vendor: '',
      estimated: 0,
      actual: 0,
      status: 'Pending',
      dueDate: new Date().toISOString().substring(0, 10)
    };

    if (existingId) {
      const found = event.budget.items.find(i => i.id === existingId);
      if (found) item = { ...found };
    }

    const modalHtml = `
      <div class="modal-overlay active" id="expense-modal">
        <div class="modal-card">
          <div class="modal-header">
            <h3>${existingId ? 'Edit Expense Item' : 'Add Celebration Expense'}</h3>
            <button class="modal-close" id="modal-close-btn">&times;</button>
          </div>
          <form id="expense-form" class="modal-body">
            <div class="form-group">
              <label>Expense Name / Description *</label>
              <input type="text" class="form-control" name="title" value="${item.title}" required placeholder="e.g. Wedding Cake & Dessert Table">
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label>Category / Pillar *</label>
                <select class="form-control" name="category">
                  ${categories.map(cat => `<option value="${cat}" ${item.category === cat ? 'selected' : ''}>${cat}</option>`).join('')}
                </select>
              </div>

              <div class="form-group flex-1">
                <label>Vendor / Contractor</label>
                <input type="text" class="form-control" name="vendor" value="${item.vendor || ''}" placeholder="e.g. Lumina Studio">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label>Estimated Cost (${event.currency})</label>
                <input type="number" step="any" class="form-control" name="estimated" value="${item.estimated}" required>
              </div>

              <div class="form-group flex-1">
                <label>Actual / Committed (${event.currency})</label>
                <input type="number" step="any" class="form-control" name="actual" value="${item.actual}" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label>Payment Status</label>
                <select class="form-control" name="status">
                  <option value="Pending" ${item.status === 'Pending' ? 'selected' : ''}>Pending</option>
                  <option value="Deposit Paid" ${item.status === 'Deposit Paid' ? 'selected' : ''}>Deposit Paid</option>
                  <option value="Paid" ${item.status === 'Paid' ? 'selected' : ''}>Paid in Full</option>
                </select>
              </div>

              <div class="form-group flex-1">
                <label>Due Date</label>
                <input type="date" class="form-control" name="dueDate" value="${item.dueDate || ''}">
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
              <button type="submit" class="btn btn-primary">${existingId ? 'Save Changes' : 'Create Expense'}</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modalEl = document.getElementById('expense-modal');

    const closeModal = () => modalEl.remove();
    modalEl.querySelector('#modal-close-btn').addEventListener('click', closeModal);
    modalEl.querySelector('#modal-cancel-btn').addEventListener('click', closeModal);

    modalEl.querySelector('#expense-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);

      const newItem = {
        id: existingId || `b-${Date.now()}`,
        title: formData.get('title'),
        category: formData.get('category'),
        vendor: formData.get('vendor'),
        estimated: Number(formData.get('estimated')) || 0,
        actual: Number(formData.get('actual')) || 0,
        status: formData.get('status'),
        dueDate: formData.get('dueDate')
      };

      if (existingId) {
        const index = event.budget.items.findIndex(i => i.id === existingId);
        if (index !== -1) event.budget.items[index] = newItem;
      } else {
        event.budget.items.unshift(newItem);
        fx.playPop();
      }

      this.app.saveState();
      closeModal();
      this.app.renderActiveTab();
      this.app.showToast(existingId ? 'Expense updated' : 'Expense added successfully', 'success');
    });
  }

  deleteExpense(id) {
    if (!confirm('Are you sure you want to remove this expense item?')) return;
    const event = this.getEvent();
    event.budget.items = event.budget.items.filter(i => i.id !== id);
    this.app.saveState();
    this.app.renderActiveTab();
    this.app.showToast('Expense removed', 'info');
  }

  aiRebalanceBudget() {
    const event = this.getEvent();
    const total = event.budgetTotal;
    
    // Proportional formula based on event type
    let ratios = {};
    if (event.type === 'wedding') {
      ratios = {
        'Venue & Rentals': 0.32,
        'Catering & Open Bar': 0.35,
        'Photography & Cinema': 0.12,
        'Florals & Decor': 0.08,
        'DJ & Live Strings': 0.06,
        'Attire & Beauty': 0.04,
        'Contingency Buffer': 0.03
      };
    } else if (event.type === 'birthday') {
      ratios = {
        'Rooftop Loft Rental': 0.35,
        'Craft Mixology & Drinks': 0.25,
        'Gourmet Tapas & Sliders': 0.20,
        'Sound System & DJ Deck': 0.10,
        'Neon Art & Photo Booth': 0.06,
        'Emergency Contingency': 0.04
      };
    } else {
      ratios = {
        'City Permits, Police & Security': 0.25,
        'Stage, Sound & Generator Power': 0.26,
        'Restrooms & Zero-Waste Recycling': 0.14,
        'Lantern Supplies & Craft Tents': 0.18,
        'Signage, Posters & Community PR': 0.08,
        'First Aid EMT & Emergency Buffer': 0.09
      };
    }

    event.budget.categories.forEach(cat => {
      if (ratios[cat.name]) {
        cat.allocated = Math.round(total * ratios[cat.name]);
      }
    });

    this.app.saveState();
    fx.launchConfetti();
    this.app.renderActiveTab();
    this.app.showToast('✨ Budget optimized & rebalanced with AI ratios!', 'success');
  }
}
