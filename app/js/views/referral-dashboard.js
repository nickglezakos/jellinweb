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
          <p class="text-muted">Welcome back to your referral account</p>
        </div>

        <div id="referral-dashboard-error" class="notice-message" style="display:none;"></div>

        <!-- Loading -->
        <div id="referral-dashboard-loading" style="text-align:center; padding:3rem;">
          <span class="spinner spinner-dark" style="width:2.5rem; height:2.5rem;"></span>
          <p class="text-muted" style="margin-top:1rem;">Loading your referral account...</p>
        </div>

        <!-- Account Info Card -->
        <div class="card" id="referral-dashboard-info" style="display:none; padding:1.5rem; margin-bottom:1.5rem;">
          <h2 style="font-size:1.25rem; font-weight:700; color:#1e293b; margin-bottom:1.25rem;">Account Overview</h2>
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
              <div style="margin-bottom:0.75rem; color:#64748b;" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" style="display:block; margin:0 auto;">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div style="font-weight:600; color:#1e293b;">Profile</div>
              <div class="text-muted" style="font-size:0.875rem; margin-top:0.25rem;">Account settings</div>
            </a>
            <div class="stat-card" style="text-align:center; padding:1.5rem;">
              <div style="margin-bottom:0.75rem; color:#64748b;" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" style="display:block; margin:0 auto;">
                  <path d="M18 20V10"/>
                  <path d="M12 20V4"/>
                  <path d="M6 20v-6"/>
                </svg>
              </div>
              <div style="font-weight:600; color:#1e293b;">Stats</div>
              <div class="text-muted" style="font-size:0.875rem; margin-top:0.25rem;">Coming soon</div>
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
      const profile = await API.Referral.getMyProfile();

      loadingEl.style.display = 'none';
      infoEl.style.display = 'block';
      actionsEl.style.display = 'block';

      document.getElementById('ref-dash-name').textContent = (profile.firstName && profile.lastName)
        ? `${profile.firstName} ${profile.lastName}`
        : profile.email || '—';
      document.getElementById('ref-dash-code').textContent = profile.code || '—';
      document.getElementById('ref-dash-email').textContent = profile.email || '—';
      document.getElementById('ref-dash-phone').textContent = profile.phoneNumber || 'Not set';

      ReferralAuth.setUser(profile);
    } catch (err) {
      loadingEl.style.display = 'none';
      Notice.show(errorEl, 'We could not load your referral account right now. Please go back and try again in a moment.', {
        goBack: true,
        fallbackHash: '#referral-login',
      });
    }
  },
};
