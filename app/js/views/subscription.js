/**
 * Jellin Subscription View
 * View Stripe products, subscribe, manage current subscription.
 * Purchase is limited to JWT role Owner.
 */
const SubscriptionView = {
  async render() {
    return `
      ${Navbar.render('subscription')}
      <div class="app-container" style="max-width: 640px;">
        <div style="margin-bottom: 2rem;">
          <h1 style="font-size: 1.75rem; font-weight: 800; color: #1e293b; margin-bottom: 0.25rem;">Subscription</h1>
          <p class="text-muted">Manage your Jellin subscription plan</p>
        </div>

        <div id="sub-error" class="notice-message" style="display:none;"></div>

        <!-- Loading -->
        <div id="sub-loading" style="text-align:center; padding:3rem;">
          <span class="spinner spinner-dark" style="width:2.5rem; height:2.5rem;"></span>
          <p class="text-muted" style="margin-top:1rem;">Loading plans...</p>
        </div>

        <!-- Non-Owner / unavailable message -->
        <div id="sub-notice" style="display:none;">
          <div style="text-align:center; padding:2.5rem 1rem 1.5rem;">
            <p id="sub-notice-text" style="color:#64748b; font-size:1rem; line-height:1.6; margin:0 auto 1.5rem; max-width:26rem;"></p>
            <button type="button" id="sub-go-back-btn" class="btn-secondary">Go back</button>
          </div>
        </div>

        <!-- Current Subscription Card -->
        <div class="card" id="sub-current" style="display:none; padding:1.5rem; margin-bottom:1.5rem;">
          <h2 style="font-size:1.25rem; font-weight:700; color:#1e293b; margin-bottom:1rem;">Current Plan</h2>
          <div id="sub-current-details"></div>
        </div>

        <!-- Available Plans -->
        <div id="sub-plans" style="display:none;">
          <h2 style="font-size:1.25rem; font-weight:700; color:#1e293b; margin-bottom:1rem;">Available Plans</h2>
          <div id="sub-plans-list" style="display:grid; gap:1rem;"></div>
          <div id="sub-actions" style="margin-top:1.5rem; text-align:center; display:none;">
            <button id="sub-subscribe-btn" class="btn-primary" style="width:100%; max-width:300px;">Subscribe Now</button>
          </div>
        </div>

        <!-- Empty State -->
        <div id="sub-empty" style="display:none;">
          <div class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <h3>No Subscription Plans Available</h3>
            <p>Please contact support for assistance.</p>
          </div>
        </div>

        <!-- Cancel Confirmation Modal -->
        <div id="sub-cancel-modal" class="loading-overlay" style="display:none;">
          <div class="card" style="padding:2rem; max-width:400px; text-align:center;">
            <h3 style="font-size:1.25rem; font-weight:700; color:#dc2626; margin-bottom:0.75rem;">Cancel Subscription</h3>
            <p style="color:#64748b; margin-bottom:1.5rem;">Are you sure? You will receive a full refund for the unused period and lose access immediately.</p>
            <div style="display:flex; gap:0.75rem; justify-content:center;">
              <button id="sub-cancel-confirm" class="btn-danger">Yes, Cancel</button>
              <button id="sub-cancel-dismiss" class="btn-secondary">Keep Plan</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  showNotice(message) {
    const loadingEl = document.getElementById('sub-loading');
    const errorEl = document.getElementById('sub-error');
    const noticeEl = document.getElementById('sub-notice');
    const noticeText = document.getElementById('sub-notice-text');
    const goBackBtn = document.getElementById('sub-go-back-btn');

    if (loadingEl) loadingEl.style.display = 'none';
    if (errorEl) Notice.hide(errorEl);
    if (noticeText) noticeText.textContent = message;
    if (noticeEl) noticeEl.style.display = 'block';

    if (goBackBtn && !goBackBtn.dataset.bound) {
      goBackBtn.dataset.bound = '1';
      goBackBtn.addEventListener('click', () => {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.hash = '#dashboard';
        }
      });
    }
  },

  isForbiddenError(err) {
    const msg = (err && err.message) ? String(err.message) : '';
    return /\b403\b/i.test(msg) || /forbidden/i.test(msg);
  },

  /**
   * Normalize products API payload to selectable plan rows.
   * Live API shape: { id, name, description, prices: [{ id, billingCycle, price, currency }] }
   * `price` is major currency units (e.g. 20 = EUR 20), not Stripe cents.
   */
  normalizeProducts(data) {
    if (!data) return [];
    let list = data;
    if (!Array.isArray(list)) {
      if (Array.isArray(data.products)) list = data.products;
      else if (Array.isArray(data.Products)) list = data.Products;
      else if (data.id || data.Id || data.prices || data.Prices) list = [data];
      else list = [];
    }

    const rows = [];
    list.forEach((product) => {
      const prices = product.prices || product.Prices || [];
      const name = product.name || product.Name || 'Plan';
      const id = product.id || product.Id || '';
      const description = product.description || product.Description || '';

      (Array.isArray(prices) ? prices : []).forEach((price) => {
        const priceId = price.id || price.Id || '';
        if (!priceId) return;

        const hasMajorPrice = price.price != null || price.Price != null;
        const raw = hasMajorPrice
          ? Number(price.price != null ? price.price : price.Price)
          : Number(price.amount != null ? price.amount : price.Amount);
        const displayAmount = Number.isFinite(raw)
          ? (hasMajorPrice ? raw : raw / 100)
          : null;
        const interval = price.billingCycle || price.BillingCycle || price.interval || price.Interval || '';

        rows.push({
          id,
          name,
          description,
          prices: [{
            id: priceId,
            amount: displayAmount,
            currency: (price.currency || price.Currency || 'eur').toString(),
            interval: String(interval),
          }],
        });
      });
    });
    return rows;
  },

  /**
   * Load products with the authorized Postman body (one call returns all cycles).
   */
  async loadOwnerProducts() {
    const data = await API.Stripe.getProducts({
      subscriptionType: 'appUsage',
      billingCycle: 'monthly',
      referenceId: null,
    });
    return SubscriptionView.normalizeProducts(data);
  },

  async init() {
    Navbar.init();

    const loadingEl = document.getElementById('sub-loading');
    const plansList = document.getElementById('sub-plans-list');
    const plansSection = document.getElementById('sub-plans');
    const emptyEl = document.getElementById('sub-empty');
    const subscribeBtn = document.getElementById('sub-subscribe-btn');
    const actionsDiv = document.getElementById('sub-actions');
    const currentCard = document.getElementById('sub-current');
    const cancelModal = document.getElementById('sub-cancel-modal');

    let selectedPriceId = null;
    let products = [];

    // Non-Owners: subtle message + go back, no Stripe calls
    if (!Auth.isOwner()) {
      this.showNotice(
        'Subscriptions on the web are managed by the business Owner. Please use the Jellin mobile app for your account, or ask your Owner if you need plan access.'
      );
      return;
    }

    const tenantId = Auth.getTenantId();
    if (!tenantId) {
      this.showNotice(
        'We could not confirm your business account from this session. Please sign out, sign in again, and try once more.'
      );
      return;
    }

    try {
      products = await this.loadOwnerProducts();

      loadingEl.style.display = 'none';

      if (!products || products.length === 0) {
        emptyEl.style.display = 'block';
        return;
      }

      plansSection.style.display = 'block';

      // Render plan cards (one selectable row per product + billing cycle)
      plansList.innerHTML = products.map((product, idx) => {
        const price = product.prices[0];
        if (!price) return '';

        const amount = Number.isFinite(Number(price.amount))
          ? Number(price.amount).toFixed(2)
          : '—';
        const currency = String(price.currency || 'eur').toUpperCase();
        const interval = price.interval ? `/${price.interval}` : '';
        const safeName = Notice.escape(product.name);
        const description = product.description
          ? `<p class="text-muted" style="margin:0.35rem 0 0; font-size:0.875rem;">${Notice.escape(product.description)}</p>`
          : '';

        return `
          <div class="plan-card" data-price-id="${price.id}" data-plan-name="${safeName}" data-index="${idx}">
            <div style="display:flex; justify-content:space-between; align-items:start; gap:1rem;">
              <div style="text-align:left;">
                <h3 style="font-weight:700; font-size:1.1rem; color:#1e293b; margin:0;">${safeName}</h3>
                ${description}
              </div>
              <div style="text-align:right; flex-shrink:0;">
                <div class="price">${currency} ${amount}</div>
                <span class="text-muted">${interval}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Handle plan selection
      const planCards = plansList.querySelectorAll('.plan-card');
      planCards.forEach(card => {
        card.addEventListener('click', () => {
          planCards.forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          selectedPriceId = card.dataset.priceId;
          actionsDiv.style.display = 'block';
        });
      });

      // Subscribe button
      subscribeBtn.addEventListener('click', async () => {
        Notice.hide('sub-error');
        if (!selectedPriceId) {
          Notice.show('sub-error', 'Please select a plan first.');
          return;
        }

        subscribeBtn.disabled = true;
        subscribeBtn.innerHTML = '<span class="spinner"></span> Redirecting to checkout...';

        try {
          const checkoutUrl = await API.Stripe.createSubscription(tenantId, selectedPriceId);

          if (checkoutUrl && typeof checkoutUrl === 'string') {
            // Redirect to Stripe Checkout
            window.location.href = checkoutUrl;
          } else {
            Toast.success('Subscription initiated! Check your email for details.');
          }
        } catch (err) {
          if (SubscriptionView.isForbiddenError(err)) {
            Notice.show('sub-error', 'Checkout is not available for this account yet. Please try again later.');
          } else {
            Notice.show('sub-error', 'We could not start checkout right now. Please try again in a moment.');
          }
          subscribeBtn.disabled = false;
          subscribeBtn.innerHTML = 'Subscribe Now';
        }
      });

      // Cancel modal handlers
      const dismissBtn = document.getElementById('sub-cancel-dismiss');
      const confirmBtn = document.getElementById('sub-cancel-confirm');

      dismissBtn.addEventListener('click', () => {
        cancelModal.style.display = 'none';
      });

      confirmBtn.addEventListener('click', async () => {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<span class="spinner"></span> Cancelling...';

        try {
          const subscriptionExternalId = cancelModal.dataset.subId;
          await API.Stripe.cancelSubscription(tenantId, subscriptionExternalId);
          Toast.success('Subscription cancelled. Refund will be processed.');
          cancelModal.style.display = 'none';
          // Refresh the view
          window.location.hash = '#subscription';
        } catch (err) {
          cancelModal.style.display = 'none';
          Notice.show('sub-error', 'We could not cancel the subscription right now. Please try again in a moment.');
          confirmBtn.disabled = false;
          confirmBtn.innerHTML = 'Yes, Cancel';
        }
      });

      // Show current subscription info if available (placeholder)
      // The API doesn't have a "get active subscription" endpoint exposed,
      // but the user may have one from a previous checkout session.
      currentCard.style.display = 'none'; // Hide until we have a get-subscription endpoint

    } catch (err) {
      if (SubscriptionView.isForbiddenError(err)) {
        this.showNotice(
          'Plans are not available to load for this account yet. Please go back for now, or try again later once billing access is enabled.'
        );
      } else {
        this.showNotice(
          'We could not load subscription plans right now. Please go back and try again in a moment.'
        );
      }
    }
  },
};
