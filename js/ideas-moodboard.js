/**
 * AuraFest Celebration Planner - Personalized Ideas & Moodboard Studio
 * Dynamic Color Palette with Hex copy, Signature Drinks, Speech / Invitation Copy Generator
 */

import { fx } from './audio-confetti.js';

export class IdeasMoodboardManager {
  constructor(app) {
    this.app = app;
  }

  getEvent() {
    return this.app.getActiveEvent();
  }

  render(container) {
    const event = this.getEvent();
    if (!event) return;

    const theme = event.theme || {
      name: 'Modern Luxury',
      description: 'Elegant and tailored aesthetics.',
      palette: [],
      dressCode: 'Formal Elegance',
      signatureDrinks: [],
      playlistVibes: 'Chic acoustic & jazz lounge'
    };

    container.innerHTML = `
      <div class="moodboard-studio">
        <!-- Visual Hero Showcase Banner -->
        <div class="card glass-card moodboard-hero-banner" style="background-image: linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9)), url('${event.coverImage}');">
          <div class="hero-banner-content">
            <span class="badge badge-gold">🎨 Theme & Aesthetic Architecture</span>
            <h2 class="hero-banner-title">${theme.name}</h2>
            <p class="hero-banner-desc">${theme.description}</p>
            <div class="hero-meta-row">
              <span class="meta-tag">👔 Dress Code: <strong>${theme.dressCode || 'Smart Casual'}</strong></span>
              <span class="meta-tag">🎶 Music Direction: <strong>${theme.playlistVibes || 'Curated'}</strong></span>
            </div>
          </div>
        </div>

        <!-- Color Palette Harmony Grid -->
        <div class="card glass-card mt-4">
          <div class="card-header-flex">
            <div>
              <h3 class="card-title">Color Palette & Atmosphere Harmony</h3>
              <p class="card-subtitle">Click any color swatch to copy its HEX code</p>
            </div>
            <button class="btn btn-secondary btn-sm" id="btn-ai-gen-palette">
              ✨ AI Palette Generator
            </button>
          </div>

          <div class="palette-swatches-grid mt-3">
            ${theme.palette.map(color => `
              <div class="palette-swatch-card" data-hex="${color.hex}">
                <div class="swatch-color-box" style="background-color: ${color.hex}">
                  <span class="copy-hint">Copy HEX</span>
                </div>
                <div class="swatch-info">
                  <span class="swatch-name">${color.name}</span>
                  <code class="swatch-hex">${color.hex}</code>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Two Column: Signature Drinks & Creative Copy / Ideas -->
        <div class="grid-two-col mt-4">
          <!-- Signature Mixology & Drinks -->
          <div class="card glass-card">
            <div class="card-header-flex">
              <div>
                <h3 class="card-title">🍸 Signature Cocktails & Pairings</h3>
                <p class="card-subtitle">Custom crafted drinks matching the event tone</p>
              </div>
              <button class="btn btn-secondary btn-sm" id="btn-add-drink">+ Add Drink</button>
            </div>

            <div class="drinks-list mt-3">
              ${theme.signatureDrinks.map((drink, idx) => `
                <div class="drink-item-card">
                  <div class="drink-icon">🍹</div>
                  <div class="drink-details">
                    <h4 class="drink-name">${drink.name}</h4>
                    <p class="drink-recipe">${drink.ingredients}</p>
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="mt-4 pt-2 border-top">
              <button class="btn btn-outline btn-sm w-100" id="btn-ai-cocktail-pair">
                ✨ Generate Zero-Proof Mocktail Pairing with AI
              </button>
            </div>
          </div>

          <!-- Personalized Invitation Copy & Speeches -->
          <div class="card glass-card">
            <div class="card-header-flex">
              <div>
                <h3 class="card-title">✍️ Invitation Copy & Speech Frameworks</h3>
                <p class="card-subtitle">Ready-to-use celebration messaging</p>
              </div>
              <button class="btn btn-secondary btn-sm" id="btn-copy-all-templates">📋 Copy</button>
            </div>

            <div class="copy-templates-stack mt-3">
              <div class="template-box">
                <span class="template-label">✨ Formal Invitation Wording</span>
                <p class="template-content" id="tmpl-invitation">
                  "Together with their cherished family & friends, we invite you to share in the joy and wonder of 
                  ${event.title}. Join us for an enchanting celebration of love, laughter, and lifelong memories at ${event.location} on ${event.date}."
                </p>
              </div>

              <div class="template-box">
                <span class="template-label">🥂 The 3-Minute Golden Toast Formula</span>
                <p class="template-content" id="tmpl-toast">
                  1. <strong>The Hook (30s):</strong> Warm thank you to everyone in the room + a vivid memory of how you met.<br>
                  2. <strong>The Essence (60s):</strong> Share 1 specific story highlighting the honoree's kindness or humorous quirk.<br>
                  3. <strong>The Elevation (45s):</strong> What this milestone represents for the future.<br>
                  4. <strong>The Clink (15s):</strong> "Raise your glasses high: to joy, health, and a lifetime of adventures!"
                </p>
              </div>

              <div class="template-box">
                <span class="template-label">📱 Warm SMS RSVP Reminder</span>
                <p class="template-content" id="tmpl-sms">
                  "Friendly reminder from ${event.title}! Please let us know your RSVP & dietary choices by this Friday so we can save your seat & craft cocktail! Can't wait to celebrate together! 🥂"
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Experiential Guest Activations & Favors -->
        <div class="card glass-card mt-4">
          <h3 class="card-title">🎁 Bespoke Guest Activations & Keepsake Favors</h3>
          <p class="card-subtitle">Creative touches that turn a good event into an unforgettable landmark</p>

          <div class="ideas-cards-grid mt-3">
            <div class="idea-box">
              <div class="idea-emoji">📻</div>
              <h4>Vintage Audio Guestbook</h4>
              <p>Place a retro rotary phone in a velvet phone booth for guests to leave heartfelt voice recordings and hilarious midnight messages.</p>
            </div>

            <div class="idea-box">
              <div class="idea-emoji">🌿</div>
              <h4>Botanical Seed Paper Favors</h4>
              <p>Custom printed thank-you cards embedded with wildflower seeds that bloom in your guests' gardens next spring.</p>
            </div>

            <div class="idea-box">
              <div class="idea-emoji">📸</div>
              <h4>Polaroid Wall & Mini Clips</h4>
              <p>Two instant cameras with metallic pens and fairy-lit twine where guests pin their live snapshots before leaving.</p>
            </div>

            <div class="idea-box">
              <div class="idea-emoji">🧁</div>
              <h4>Late-Night Comfort Bites</h4>
              <p>Warm churros with cinnamon spiced chocolate dipping cups, passed around the dance floor at 10:30 PM.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container);
  }

  bindEvents(container) {
    // Copy HEX swatches
    container.querySelectorAll('.palette-swatch-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const hex = e.currentTarget.getAttribute('data-hex');
        navigator.clipboard.writeText(hex).then(() => {
          fx.playPop();
          this.app.showToast(`Copied ${hex} to clipboard!`, 'success');
        });
      });
    });

    // AI Palette Generator
    container.querySelector('#btn-ai-gen-palette')?.addEventListener('click', () => {
      this.app.openAiChatWithPrompt(`Generate a stunning, high-contrast 5-color palette for ${this.getEvent().title} with HEX codes and aesthetic rationale.`);
    });

    // AI Cocktail Pair
    container.querySelector('#btn-ai-cocktail-pair')?.addEventListener('click', () => {
      this.app.openAiChatWithPrompt(`Design 2 artisanal zero-proof mocktails and a signature spritz for ${this.getEvent().title}`);
    });

    // Copy all templates
    container.querySelector('#btn-copy-all-templates')?.addEventListener('click', () => {
      const inv = container.querySelector('#tmpl-invitation')?.innerText || '';
      const sms = container.querySelector('#tmpl-sms')?.innerText || '';
      navigator.clipboard.writeText(`${inv}\n\nRSVP SMS:\n${sms}`).then(() => {
        fx.playChime();
        this.app.showToast('Celebration copy templates copied to clipboard!', 'success');
      });
    });

    // Add drink modal
    container.querySelector('#btn-add-drink')?.addEventListener('click', () => {
      this.openDrinkModal();
    });
  }

  openDrinkModal() {
    const event = this.getEvent();

    const modalHtml = `
      <div class="modal-overlay active" id="drink-modal">
        <div class="modal-card">
          <div class="modal-header">
            <h3>Add Signature Beverage</h3>
            <button class="modal-close" id="modal-close-btn">&times;</button>
          </div>
          <form id="drink-form" class="modal-body">
            <div class="form-group">
              <label>Drink Name *</label>
              <input type="text" class="form-control" name="name" required placeholder="e.g. Lavender French 75">
            </div>
            <div class="form-group">
              <label>Ingredients & Garnish *</label>
              <textarea class="form-control" name="ingredients" rows="3" required placeholder="e.g. Gin, lavender reduction, lemon juice, topped with brut champagne, lemon ribbon..."></textarea>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Drink</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modalEl = document.getElementById('drink-modal');

    const closeModal = () => modalEl.remove();
    modalEl.querySelector('#modal-close-btn').addEventListener('click', closeModal);
    modalEl.querySelector('#modal-cancel-btn').addEventListener('click', closeModal);

    modalEl.querySelector('#drink-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);

      event.theme.signatureDrinks.push({
        name: formData.get('name'),
        ingredients: formData.get('ingredients')
      });

      fx.playPop();
      this.app.saveState();
      closeModal();
      this.app.renderActiveTab();
      this.app.showToast('Signature drink added to celebration menu', 'success');
    });
  }
}
