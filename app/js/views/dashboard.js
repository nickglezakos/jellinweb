/**
 * Jellin Dashboard View
 * Post-login landing page showing account info and quick actions.
 */
const DashboardView = {
  async render() {
    return `
      ${Navbar.render('dashboard')}
      <div class="app-container" style="max-width: 640px;">
        <div style="margin-bottom: 2rem;">
          <h1 style="font-size: 1.75rem; font-weight: 800; color: #1e293b; margin-bottom: 0.25rem;">Dashboard</h1>
          <p class="text-muted">Welcome back to your Jellin dashboard</p>
        </div>

        <div id="dashboard-error" class="notice-message" style="display:none;"></div>

        <!-- Loading -->
        <div id="dashboard-loading" style="text-align:center; padding:3rem;">
          <span class="spinner spinner-dark" style="width:2.5rem; height:2.5rem;"></span>
          <p class="text-muted" style="margin-top:1rem;">Loading your account...</p>
        </div>

        <!-- Account Info Card -->
        <div class="card" id="dashboard-info" style="display:none; padding:1.5rem; margin-bottom:1.5rem;">
          <h2 style="font-size:1.25rem; font-weight:700; color:#1e293b; margin-bottom:1.25rem;">Account Overview</h2>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
            <div class="stat-card">
              <div class="stat-label">Email</div>
              <div class="stat-value" style="font-size:1rem;" id="dash-email">—</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Email Confirmed</div>
              <div class="stat-value" style="font-size:1rem;" id="dash-emailConfirmed">—</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Phone</div>
              <div class="stat-value" style="font-size:1rem;" id="dash-phone">—</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Phone Confirmed</div>
              <div class="stat-value" style="font-size:1rem;" id="dash-phoneConfirmed">—</div>
            </div>
          </div>
          <div id="dash-ownsTenant" style="margin-top:0.75rem;"></div>
        </div>

        <!-- Quick Actions -->
        <div class="card" id="dashboard-actions" style="display:none; padding:1.5rem;">
          <h2 style="font-size:1.25rem; font-weight:700; color:#1e293b; margin-bottom:1.25rem;">Quick Actions</h2>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
            <a href="#subscription" class="stat-card" style="text-decoration:none; cursor:pointer; text-align:center; padding:1.5rem;">
              <div style="margin-bottom:0.75rem; color:#64748b;" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" style="display:block; margin:0 auto;">
                  <rect x="2" y="5" width="20" height="14" rx="2"/>
                  <path d="M2 10h20"/>
                </svg>
              </div>
              <div style="font-weight:600; color:#1e293b;">Subscription</div>
              <div class="text-muted" style="font-size:0.875rem; margin-top:0.25rem;">Plans &amp; billing</div>
            </a>
            <a href="#profile" class="stat-card" style="text-decoration:none; cursor:pointer; text-align:center; padding:1.5rem;">
              <div style="margin-bottom:0.75rem; color:#64748b;" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" style="display:block; margin:0 auto;">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div style="font-weight:600; color:#1e293b;">Profile</div>
              <div class="text-muted" style="font-size:0.875rem; margin-top:0.25rem;">Account settings</div>
            </a>
          </div>
        </div>
      </div>
    `;
  },

  async init() {
    Navbar.init();

    const loadingEl = document.getElementById('dashboard-loading');
    const infoEl = document.getElementById('dashboard-info');
    const actionsEl = document.getElementById('dashboard-actions');
    const errorEl = document.getElementById('dashboard-error');

    try {
      const data = await API.Account.getConnectionInfo();
      
      loadingEl.style.display = 'none';
      infoEl.style.display = 'block';
      actionsEl.style.display = 'block';

      // Populate info
      document.getElementById('dash-email').textContent = data.email || '—';
      document.getElementById('dash-emailConfirmed').innerHTML = data.emailConfirmed
        ? '<span class="badge badge-success">Confirmed</span>'
        : '<span class="badge badge-warning">Pending</span>';
      document.getElementById('dash-phone').textContent = data.phoneNumber || 'Not set';
      document.getElementById('dash-phoneConfirmed').innerHTML = data.phoneNumberConfirmed
        ? '<span class="badge badge-success">Confirmed</span>'
        : data.phoneNumber
          ? '<span class="badge badge-warning">Pending</span>'
          : '<span class="text-muted">—</span>';

      if (data.operatorOwnsSeparateTenant) {
        document.getElementById('dash-ownsTenant').innerHTML = `
          <div class="badge badge-purple" style="margin-top:0.5rem;">Separate Tenant Owner</div>
        `;
      }

      // Store user info
      Auth.setUser(data);
    } catch (err) {
      loadingEl.style.display = 'none';
      Notice.show(errorEl, 'We could not load your account right now. Please go back and try again in a moment.', {
        goBack: true,
        fallbackHash: '#login',
      });
    }
  },
};