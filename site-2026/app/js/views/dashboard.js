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

        <div id="dashboard-error" class="error-message" style="display:none;"></div>

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
              <div style="font-size:2rem; margin-bottom:0.5rem;">💳</div>
              <div style="font-weight:700; color:#1e293b;">Manage Subscription</div>
              <div class="text-muted">View plans & billing</div>
            </a>
            <a href="#profile" class="stat-card" style="text-decoration:none; cursor:pointer; text-align:center; padding:1.5rem;">
              <div style="font-size:2rem; margin-bottom:0.5rem;">👤</div>
              <div style="font-weight:700; color:#1e293b;">Profile Settings</div>
              <div class="text-muted">Update your account</div>
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
      errorEl.textContent = `Failed to load account info: ${err.message}`;
      errorEl.style.display = 'block';
    }
  },
};