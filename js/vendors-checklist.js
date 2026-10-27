/**
 * AuraFest Celebration Planner - Vendor CRM & Interactive Checklist
 * Complete Vendor cards with contract info & Milestones checklist with confetti and audio
 */

import { fx } from './audio-confetti.js';

export class VendorsChecklistManager {
  constructor(app) {
    this.app = app;
    this.activeSubView = 'vendors'; // 'vendors' or 'checklist'
    this.checklistFilter = 'all';
    this.priorityFilter = 'all';
    this.vendorCategoryFilter = 'all';
  }

  getEvent() {
    return this.app.getActiveEvent();
  }

  render(container) {
    const event = this.getEvent();
    if (!event) return;

    const vendors = event.vendors || [];
    const checklists = event.checklists || [];

    const completedTasks = checklists.filter(t => t.completed).length;
    const progress = checklists.length ? Math.round((completedTasks / checklists.length) * 100) : 0;
    const currency = event.currency || '$';

    container.innerHTML = `
      <div class="vendors-checklist-section">
        <!-- Subview Nav & Controls -->
        <div class="timeline-header-bar card glass-card">
          <div class="timeline-title-area">
            <h2 class="card-title">Vendors & Actionable Checklists</h2>
            <p class="card-subtitle">Manage contracts, team contacts, and step-by-step milestone execution</p>
          </div>

          <div class="timeline-actions-area">
            <div class="subtab-pills">
              <button class="subtab-btn ${this.activeSubView === 'vendors' ? 'active' : ''}" id="btn-subtab-vendors">
                🤝 Vendor Team (${vendors.length})
              </button>
              <button class="subtab-btn ${this.activeSubView === 'checklist' ? 'active' : ''}" id="btn-subtab-checklist">
                ✅ Master Checklist (${completedTasks}/${checklists.length})
              </button>
            </div>

            <div class="btn-group">
              ${this.activeSubView === 'vendors' ? `
                <button class="btn btn-primary btn-sm" id="btn-add-vendor">+ Add Vendor</button>
              ` : `
                <button class="btn btn-secondary btn-sm" id="btn-ai-audit-checklist">✨ AI Checklist Audit</button>
                <button class="btn btn-primary btn-sm" id="btn-add-task">+ Add Task</button>
              `}
            </div>
          </div>
        </div>

        ${this.activeSubView === 'vendors' ? this.renderVendorsView(vendors, currency) : this.renderChecklistView(checklists, completedTasks, progress)}
      </div>
    `;

    this.bindEvents(container);
  }

  renderVendorsView(vendors, currency) {
    const categories = Array.from(new Set(vendors.map(v => v.category)));

    const filteredVendors = vendors.filter(v => {
      return this.vendorCategoryFilter === 'all' || v.category === this.vendorCategoryFilter;
    });

    return `
      <div class="vendors-view mt-3">
        <!-- Category Filters -->
        <div class="filter-pills mb-3">
          <button class="pill-btn ${this.vendorCategoryFilter === 'all' ? 'active' : ''}" data-vcat="all">All Vendors (${vendors.length})</button>
          ${categories.map(cat => `
            <button class="pill-btn ${this.vendorCategoryFilter === cat ? 'active' : ''}" data-vcat="${cat}">${cat}</button>
          `).join('')}
        </div>

        <!-- Vendor Cards Grid -->
        <div class="vendor-cards-grid">
          ${filteredVendors.map(v => `
            <div class="card glass-card vendor-card" data-id="${v.id}">
              <div class="vendor-card-header">
                <div>
                  <span class="badge badge-purple">${v.category}</span>
                  <h3 class="vendor-name">${v.name}</h3>
                </div>
                <span class="badge status-badge status-${(v.status || 'Contacted').toLowerCase().replace(' ', '-')}">
                  ${v.status}
                </span>
              </div>

              <div class="vendor-contact-block">
                ${v.contact ? `<div class="contact-row"><span class="icon">👤</span> <strong>${v.contact}</strong></div>` : ''}
                ${v.phone ? `<div class="contact-row"><span class="icon">📞</span> <a href="tel:${v.phone}" class="link-subtle">${v.phone}</a></div>` : ''}
                ${v.email ? `<div class="contact-row"><span class="icon">✉️</span> <a href="mailto:${v.email}" class="link-subtle">${v.email}</a></div>` : ''}
                <div class="contact-row"><span class="icon">💵</span> Contract: <strong>${currency}${(Number(v.cost) || 0).toLocaleString()}</strong></div>
              </div>

              ${v.notes ? `<p class="vendor-notes">${v.notes}</p>` : ''}

              <div class="vendor-card-footer">
                <a href="mailto:${v.email || ''}" class="btn btn-secondary btn-sm">Message</a>
                <div class="btn-group-sm">
                  <button class="btn-icon btn-edit-vendor" data-id="${v.id}" title="Edit">✏️</button>
                  <button class="btn-icon btn-del-vendor" data-id="${v.id}" title="Delete">🗑️</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderChecklistView(checklists, completedTasks, progress) {
    const categories = Array.from(new Set(checklists.map(c => c.category)));

    const filtered = checklists.filter(item => {
      const matchCat = this.checklistFilter === 'all' || item.category === this.checklistFilter;
      const matchPriority = this.priorityFilter === 'all' || item.priority === this.priorityFilter;
      return matchCat && matchPriority;
    });

    return `
      <div class="checklist-view mt-3">
        <!-- Progress Bar -->
        <div class="timeline-progress-banner card glass-card mb-3">
          <div class="progress-info-flex">
            <span><strong>Master Readiness:</strong> ${completedTasks} of ${checklists.length} items cleared</span>
            <span class="font-bold text-gold">${progress}% Ready</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width: ${progress}%; background: linear-gradient(90deg, #10B981, #06B6D4)"></div>
          </div>
        </div>

        <!-- Filter Row -->
        <div class="checklist-filters-row mb-3">
          <div class="filter-pills">
            <button class="pill-btn ${this.checklistFilter === 'all' ? 'active' : ''}" data-ccat="all">All Categories</button>
            ${categories.map(c => `
              <button class="pill-btn ${this.checklistFilter === c ? 'active' : ''}" data-ccat="${c}">${c}</button>
            `).join('')}
          </div>

          <div class="priority-select-wrap">
            <select class="form-select form-select-sm" id="select-priority-filter">
              <option value="all" ${this.priorityFilter === 'all' ? 'selected' : ''}>All Priorities</option>
              <option value="High" ${this.priorityFilter === 'High' ? 'selected' : ''}>High Priority</option>
              <option value="Medium" ${this.priorityFilter === 'Medium' ? 'selected' : ''}>Medium Priority</option>
              <option value="Low" ${this.priorityFilter === 'Low' ? 'selected' : ''}>Low Priority</option>
            </select>
          </div>
        </div>

        <!-- Checklist Table / List -->
        <div class="card glass-card">
          <div class="checklist-list">
            ${filtered.length === 0 ? `
              <div class="text-center py-4 text-muted">No checklist tasks match the selected filter.</div>
            ` : filtered.map(item => `
              <div class="checklist-item-row ${item.completed ? 'completed' : ''}" data-id="${item.id}">
                <button class="check-toggle ${item.completed ? 'checked' : ''}" data-id="${item.id}">
                  ${item.completed ? '✓' : ''}
                </button>

                <div class="checklist-item-content">
                  <span class="checklist-item-title ${item.completed ? 'line-through text-muted' : ''}">${item.task}</span>
                  <div class="checklist-tags">
                    <span class="badge badge-outline">${item.category}</span>
                    <span class="badge badge-priority-${(item.priority || 'Medium').toLowerCase()}">${item.priority || 'Medium'} Priority</span>
                    ${item.due ? `<span class="badge badge-subtle">Due: ${item.due}</span>` : ''}
                  </div>
                </div>

                <div class="checklist-item-actions">
                  <button class="btn-icon btn-del-task" data-id="${item.id}" title="Delete">🗑️</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  bindEvents(container) {
    // Subtab switch
    container.querySelector('#btn-subtab-vendors')?.addEventListener('click', () => {
      this.activeSubView = 'vendors';
      this.render(container);
    });

    container.querySelector('#btn-subtab-checklist')?.addEventListener('click', () => {
      this.activeSubView = 'checklist';
      this.render(container);
    });

    // Vendor Category filter
    container.querySelectorAll('[data-vcat]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.vendorCategoryFilter = e.currentTarget.getAttribute('data-vcat');
        this.render(container);
      });
    });

    // Checklist Category filter
    container.querySelectorAll('[data-ccat]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.checklistFilter = e.currentTarget.getAttribute('data-ccat');
        this.render(container);
      });
    });

    // Priority filter
    container.querySelector('#select-priority-filter')?.addEventListener('change', (e) => {
      this.priorityFilter = e.target.value;
      this.render(container);
    });

    // Toggle checklist item
    container.querySelectorAll('.checklist-item-row .check-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.toggleTask(id, e.clientX, e.clientY);
      });
    });

    // Add Vendor
    container.querySelector('#btn-add-vendor')?.addEventListener('click', () => {
      this.openVendorModal();
    });

    // Edit Vendor
    container.querySelectorAll('.btn-edit-vendor').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.openVendorModal(id);
      });
    });

    // Delete Vendor
    container.querySelectorAll('.btn-del-vendor').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.deleteVendor(id);
      });
    });

    // Add Task
    container.querySelector('#btn-add-task')?.addEventListener('click', () => {
      this.openTaskModal();
    });

    // Delete Task
    container.querySelectorAll('.btn-del-task').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.deleteTask(id);
      });
    });

    // AI Checklist Audit
    container.querySelector('#btn-ai-audit-checklist')?.addEventListener('click', () => {
      this.app.openAiChatWithPrompt(`Audit my checklists for ${this.getEvent().title} and highlight any overlooked logistics, safety, or vendor items.`);
    });
  }

  toggleTask(id, clickX, clickY) {
    const event = this.getEvent();
    const task = event.checklists.find(t => t.id === id);
    if (!task) return;

    task.completed = !task.completed;
    if (task.completed) {
      fx.launchConfetti(clickX || window.innerWidth / 2, clickY || window.innerHeight / 2, 45);
    } else {
      fx.playPop();
    }

    this.app.saveState();
    this.app.renderActiveTab();
  }

  openVendorModal(existingId = null) {
    const event = this.getEvent();
    let vendor = {
      name: '',
      category: 'Catering',
      contact: '',
      phone: '',
      email: '',
      cost: 0,
      status: 'Contacted',
      notes: ''
    };

    if (existingId) {
      const found = event.vendors.find(v => v.id === existingId);
      if (found) vendor = { ...found };
    }

    const modalHtml = `
      <div class="modal-overlay active" id="vendor-modal">
        <div class="modal-card">
          <div class="modal-header">
            <h3>${existingId ? 'Edit Vendor Profile' : 'Add Celebration Vendor'}</h3>
            <button class="modal-close" id="modal-close-btn">&times;</button>
          </div>
          <form id="vendor-form" class="modal-body">
            <div class="form-row">
              <div class="form-group flex-2">
                <label>Vendor Company / Business Name *</label>
                <input type="text" class="form-control" name="name" value="${vendor.name}" required placeholder="e.g. Lumina Storytellers Photography">
              </div>
              <div class="form-group flex-1">
                <label>Category *</label>
                <select class="form-control" name="category">
                  <option value="Venue" ${vendor.category === 'Venue' ? 'selected' : ''}>Venue</option>
                  <option value="Catering" ${vendor.category === 'Catering' ? 'selected' : ''}>Catering & Bar</option>
                  <option value="Photography" ${vendor.category === 'Photography' ? 'selected' : ''}>Photography & Video</option>
                  <option value="Florist" ${vendor.category === 'Florist' ? 'selected' : ''}>Florals & Decor</option>
                  <option value="Music & DJ" ${vendor.category === 'Music & DJ' ? 'selected' : ''}>Music & DJ</option>
                  <option value="Bakery" ${vendor.category === 'Bakery' ? 'selected' : ''}>Bakery & Cake</option>
                  <option value="Rentals" ${vendor.category === 'Rentals' ? 'selected' : ''}>Rentals & Staging</option>
                  <option value="Production" ${vendor.category === 'Production' ? 'selected' : ''}>Lighting & Sound</option>
                  <option value="Logistics" ${vendor.category === 'Logistics' ? 'selected' : ''}>Permits & Security</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label>Key Contact Name</label>
                <input type="text" class="form-control" name="contact" value="${vendor.contact || ''}" placeholder="e.g. Chef Henri">
              </div>
              <div class="form-group flex-1">
                <label>Phone Number</label>
                <input type="text" class="form-control" name="phone" value="${vendor.phone || ''}" placeholder="(555) 123-4567">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label>Email Address</label>
                <input type="email" class="form-control" name="email" value="${vendor.email || ''}" placeholder="contact@vendor.com">
              </div>
              <div class="form-group flex-1">
                <label>Contract Amount (${event.currency})</label>
                <input type="number" step="any" class="form-control" name="cost" value="${vendor.cost || 0}">
              </div>
              <div class="form-group flex-1">
                <label>Booking Status</label>
                <select class="form-control" name="status">
                  <option value="Shortlisted" ${vendor.status === 'Shortlisted' ? 'selected' : ''}>Shortlisted</option>
                  <option value="Contacted" ${vendor.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
                  <option value="Proposal Sent" ${vendor.status === 'Proposal Sent' ? 'selected' : ''}>Proposal Sent</option>
                  <option value="Booked" ${vendor.status === 'Booked' ? 'selected' : ''}>Booked (Deposit Paid)</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Special Contract Deliverables & Notes</label>
              <textarea class="form-control" name="notes" rows="2" placeholder="e.g. Includes 10 hrs coverage, drone, raw 4K files...">${vendor.notes || ''}</textarea>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
              <button type="submit" class="btn btn-primary">${existingId ? 'Save Changes' : 'Add Vendor'}</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modalEl = document.getElementById('vendor-modal');

    const closeModal = () => modalEl.remove();
    modalEl.querySelector('#modal-close-btn').addEventListener('click', closeModal);
    modalEl.querySelector('#modal-cancel-btn').addEventListener('click', closeModal);

    modalEl.querySelector('#vendor-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);

      const newVendor = {
        id: existingId || `v-${Date.now()}`,
        name: formData.get('name'),
        category: formData.get('category'),
        contact: formData.get('contact'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        cost: Number(formData.get('cost')) || 0,
        status: formData.get('status'),
        notes: formData.get('notes')
      };

      if (existingId) {
        const idx = event.vendors.findIndex(v => v.id === existingId);
        if (idx !== -1) event.vendors[idx] = newVendor;
      } else {
        event.vendors.push(newVendor);
        fx.playPop();
      }

      this.app.saveState();
      closeModal();
      this.app.renderActiveTab();
      this.app.showToast('Vendor record saved', 'success');
    });
  }

  deleteVendor(id) {
    if (!confirm('Are you sure you want to delete this vendor?')) return;
    const event = this.getEvent();
    event.vendors = event.vendors.filter(v => v.id !== id);
    this.app.saveState();
    this.app.renderActiveTab();
    this.app.showToast('Vendor removed', 'info');
  }

  openTaskModal() {
    const event = this.getEvent();
    const categories = Array.from(new Set(event.checklists.map(c => c.category))).concat(['Logistics', 'Hospitality']);

    const modalHtml = `
      <div class="modal-overlay active" id="task-modal">
        <div class="modal-card">
          <div class="modal-header">
            <h3>Add Checklist Milestone</h3>
            <button class="modal-close" id="modal-close-btn">&times;</button>
          </div>
          <form id="task-form" class="modal-body">
            <div class="form-group">
              <label>Task Description *</label>
              <input type="text" class="form-control" name="task" required placeholder="e.g. Confirm final vegan meal count with caterer">
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label>Category *</label>
                <select class="form-control" name="category">
                  ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
                </select>
              </div>

              <div class="form-group flex-1">
                <label>Priority</label>
                <select class="form-control" name="priority">
                  <option value="High">High</option>
                  <option value="Medium" selected>Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div class="form-group flex-1">
                <label>Target Due Date</label>
                <input type="date" class="form-control" name="due" value="${new Date().toISOString().substring(0, 10)}">
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
              <button type="submit" class="btn btn-primary">Add Task</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modalEl = document.getElementById('task-modal');

    const closeModal = () => modalEl.remove();
    modalEl.querySelector('#modal-close-btn').addEventListener('click', closeModal);
    modalEl.querySelector('#modal-cancel-btn').addEventListener('click', closeModal);

    modalEl.querySelector('#task-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);

      const newTask = {
        id: `c-${Date.now()}`,
        task: formData.get('task'),
        category: formData.get('category'),
        priority: formData.get('priority'),
        due: formData.get('due'),
        completed: false
      };

      event.checklists.push(newTask);
      fx.playPop();

      this.app.saveState();
      closeModal();
      this.app.renderActiveTab();
      this.app.showToast('Task added to checklist', 'success');
    });
  }

  deleteTask(id) {
    const event = this.getEvent();
    event.checklists = event.checklists.filter(t => t.id !== id);
    this.app.saveState();
    this.app.renderActiveTab();
    this.app.showToast('Task removed', 'info');
  }
}
