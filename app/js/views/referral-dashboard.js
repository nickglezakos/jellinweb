/**
 * Jellin Referral Dashboard View
 * Post-login landing page for referral accounts.
 */
const ReferralDashboardView = {
  async render() {
    return `
      ${ReferralNavbar.render('dashboard')}
      <div class="app-container" style="max-width: 640px;">
        <div style="margin-bottom: 2rem;">
          <h1 style="font-size: 1.75rem; font-weight: 800; color: #1e293b; margin-bottom: 0.25rem;">Referral Dashboard</h1>
          <p class="text-muted">Welcome back to your Jellin referral account</p>
        </div>

        <div id="referral-dashboard-error" class="error-message" style="display:none;"></div>

        <!-- Loading -->
        <div id="referral-dashboard-loading" style="text-align:center; padding:3rem;">
          <span class="spinner spinner-dark" style="width:2.5rem; height:2.5rem;"></span>
          <p class="text-muted" style="margin-top:1rem;">Loading your referral account...</p>
        </div>

        <!-- Account Info Card -->
        <div class="card" id="referral-dashboard-info" style="display:none; padding:1.5rem; margin-bottom:1.5rem;">
          <h2 style="font-size:1.25rem; font-weight:700; color:#1e293b; margin-bottom:1.25rem;">Referral Account Overview</h2>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
            <div class="stat-card">
              <div class="stat-label">Name</div>
              <div class="stat-value" style="font-size:1rem;" id="ref-dash-name">—</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Referral Code</div>
              <div class="stat-value" style="font-size:1rem;" id="ref-dash-code">—</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Email</div>
              <div class="stat-value" style="font-size:1rem;" id="ref-dash-email">—</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Phone</div>
              <div class="stat-value" style="font-size:1rem;" id="ref-dash-phone">—</div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card" id="referral-dashboard-actions" style="display:none; padding:1.5rem;">
          <h2 style="font-size:1.25rem; font-weight:700; color:#1e293b; margin-bottom:1.25rem;">Quick Actions</h2>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
            <a href="#referral-profile" class="stat-card" style="text-decoration:none; cursor:pointer; text-align:center; padding:1.5rem;">
              <div style="font-size:2rem; margin-bottom:0.5rem;">👤</div>
              <div style="font-weight:700; color:#1e293b;">Profile Settings</div>
              <div class="text-muted">Update your account</div>
            </a>
            <div class="stat-card" style="text-align:center; padding:1.5rem;">
              <div style="font-size:2rem; margin-bottom:0.5rem;">📊</div>
              <div style="font-weight:700; color:#1e293b;">Referral Stats</div>
              <div class="text-muted">Coming soon</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async init() {
    ReferralNavbar.init();

    const loadingEl = document.getElementById('referral-dashboard-loading');
    const infoEl = document.getElementById('referral-dashboard-info');
    const actionsEl = document.getElementById('referral-dashboard-actions');
    const errorEl = document.getElementById('referral-dashboard-error');

    try {
      // Get user info from stored session
      const user = ReferralAuth.getUser();
      
      loadingEl.style.display = 'none';
      infoEl.style.display = 'block';
      actionsEl.style.display = 'block';

      // Populate info from stored user data
      document.getElementById('ref-dash-name').textContent = user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : user?.email || '—';
      document.getElementById('ref-dash-code').textContent = user?.code || '—';
      document.getElementById('ref-dash-email').textContent = user?.email || '—';
      document.getElementById('ref-dash-phone').textContent = user?.phoneNumber || 'Not set';

    } catch (err) {
      loadingEl.style.display = 'none';
      errorEl.textContent = `Failed to load referral account info: ${err.message}`;
      errorEl.style.display = 'block';
    }
  },
};