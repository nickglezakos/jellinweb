/**
 * Jellin Subscription View
 * View Stripe products, subscribe, manage current subscription.
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

        <div id="sub-error" class="error-message" style="display:none;"></div>

        <!-- Loading -->
        <div id="sub-loading" style="text-align:center; padding:3rem;">
          <span class="spinner spinner-dark" style="width:2.5rem; height:2.5rem;"></span>
          <p class="text-muted" style="margin-top:1rem;">Loading plans...</p>
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

  async init() {
    Navbar.init();

    const loadingEl = document.getElementById('sub-loading');
    const errorEl = document.getElementById('sub-error');
    const plansList = document.getElementById('sub-plans-list');
    const plansSection = document.getElementById('sub-plans');
    const emptyEl = document.getElementById('sub-empty');
    const subscribeBtn = document.getElementById('sub-subscribe-btn');
    const actionsDiv = document.getElementById('sub-actions');
    const currentCard = document.getElementById('sub-current');
    const currentDetails = document.getElementById('sub-current-details');
    const cancelModal = document.getElementById('sub-cancel-modal');

    let selectedPriceId = null;
    let selectedPlanName = null;
    let products = [];

    try {
      products = await API.Stripe.getProducts();

      loadingEl.style.display = 'none';

      if (!products || products.length === 0) {
        emptyEl.style.display = 'block';
        return;
      }

      plansSection.style.display = 'block';

      // Render plan cards
      plansList.innerHTML = products.map((product, idx) => {
        // Take the first active price
        const price = product.prices && product.prices.length > 0 ? product.prices[0] : null;
        if (!price) return '';

        const amount = (price.amount / 100).toFixed(2);
        const currency = price.currency.toUpperCase();
        const interval = price.interval ? `/${price.interval}` : '';

        return `
          <div class="plan-card" data-price-id="${price.id}" data-plan-name="${product.name}" data-index="${idx}">
            <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:0.5rem;">
              <div>
                <h3 style="font-weight:700; font-size:1.1rem; color:#1e293b;">${product.name}</h3>
                <span class="badge badge-purple" style="margin-top:0.25rem;">${product.id}</span>
              </div>
              <div style="text-align:right;">
                <div class="price">${currency} ${amount}</div>
                <span class="text-muted">${interval}</span>
              </div>
            </div>
            <div style="margin-top:0.75rem;">
              <span class="badge badge-info">Price ID: ${price.id}</span>
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
          selectedPlanName = card.dataset.planName;
          actionsDiv.style.display = 'block';
        });
      });

      // Subscribe button
      subscribeBtn.addEventListener('click', async () => {
        if (!selectedPriceId) {
          Toast.error('Please select a plan first.');
          return;
        }

        subscribeBtn.disabled = true;
        subscribeBtn.innerHTML = '<span class="spinner"></span> Redirecting to checkout...';

        try {
          // Note: tenantId needs to come from the auth context
          // For now we pass a default value; the API doc says it's required
          const user = Auth.getUser();
          const tenantId = 1; // This should ideally come from the JWT or user context

          const checkoutUrl = await API.Stripe.createSubscription(tenantId, selectedPriceId);

          if (checkoutUrl && typeof checkoutUrl === 'string') {
            // Redirect to Stripe Checkout
            window.location.href = checkoutUrl;
          } else {
            Toast.success('Subscription initiated! Check your email for details.');
          }
        } catch (err) {
          Toast.error(`Failed to create subscription: ${err.message}`);
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
          const tenantId = 1; // TODO: from auth context
          await API.Stripe.cancelSubscription(tenantId, subscriptionExternalId);
          Toast.success('Subscription cancelled. Refund will be processed.');
          cancelModal.style.display = 'none';
          // Refresh the view
          window.location.hash = '#subscription';
        } catch (err) {
          Toast.error(`Failed to cancel: ${err.message}`);
          confirmBtn.disabled = false;
          confirmBtn.innerHTML = 'Yes, Cancel';
        }
      });

      // Show current subscription info if available (placeholder)
      // The API doesn't have a "get active subscription" endpoint exposed,
      // but the user may have one from a previous checkout session.
      currentCard.style.display = 'none'; // Hide until we have a get-subscription endpoint

    } catch (err) {
      loadingEl.style.display = 'none';
      errorEl.textContent = `Failed to load plans: ${err.message}`;
      errorEl.style.display = 'block';
    }
  },
};