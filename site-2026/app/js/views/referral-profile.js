/**
 * Jellin Referral Profile View
 * Update email, password, delete account, logout.
 */
const ReferralProfileView = {
  async render() {
    return `
      ${ReferralNavbar.render('profile')}
      <div class="app-container" style="max-width: 640px;">
        <div style="margin-bottom: 2rem;">
          <h1 style="font-size: 1.75rem; font-weight: 800; color: #1e293b; margin-bottom: 0.25rem;">Referral Profile</h1>
          <p class="text-muted">Manage your referral account details</p>
        </div>

        <div id="referral-profile-error" class="error-message" style="display:none;"></div>

        <!-- Profile Info Card -->
        <div class="card" style="padding:1.5rem; margin-bottom:1.5rem;" id="ref-profile-info-card">
          <h2 style="font-size:1.25rem; font-weight:700; color:#1e293b; margin-bottom:1rem;">Account Info</h2>
          <div id="ref-profile-info" style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
            <div class="stat-card"><div class="stat-label">Name</div><div class="stat-value" style="font-size:0.95rem;" id="ref-prof-name">—</div></div>
            <div class="stat-card"><div class="stat-label">Referral Code</div><div class="stat-value" style="font-size:0.95rem;" id="ref-prof-code">—</div></div>
            <div class="stat-card"><div class="stat-label">Email</div><div class="stat-value" style="font-size:0.95rem;" id="ref-prof-email">—</div></div>
            <div class="stat-card"><div class="stat-label">Email Status</div><div class="stat-value" style="font-size:0.95rem;" id="ref-prof-emailStatus">—</div></div>
            <div class="stat-card"><div class="stat-label">Phone</div><div class="stat-value" style="font-size:0.95rem;" id="ref-prof-phone">—</div></div>
            <div class="stat-card"><div class="stat-label">Phone Status</div><div class="stat-value" style="font-size:0.95rem;" id="ref-prof-phoneStatus">—</div></div>
          </div>
        </div>

        <!-- Update Email -->
        <div class="card" style="padding:1.5rem; margin-bottom:1.5rem;">
          <h2 style="font-size:1.25rem; font-weight:700; color:#1e293b; margin-bottom:1rem;">Update Email</h2>
          <form id="ref-profile-email-form">
            <div style="margin-bottom:1rem;">
              <label style="display:block; font-weight:600; margin-bottom:0.25rem; font-size:0.875rem; color:#475569;">New Email</label>
              <input type="email" id="ref-prof-newEmail" class="input-field" placeholder="new@example.com" required autocomplete="email">
            </div>
            <button type="submit" class="btn-primary" id="ref-prof-email-submit">Update Email</button>
          </form>
          <div id="ref-prof-email-error" class="error-message" style="display:none; margin-top:0.75rem;"></div>
        </div>

        <!-- Update Password -->
        <div class="card" style="padding:1.5rem; margin-bottom:1.5rem;">
          <h2 style="font-size:1.25rem; font-weight:700; color:#1e293b; margin-bottom:1rem;">Update Password</h2>
          <form id="ref-profile-password-form">
            <div style="margin-bottom:1rem;">
              <label style="display:block; font-weight:600; margin-bottom:0.25rem; font-size:0.875rem; color:#475569;">Current Password</label>
              <input type="password" id="ref-prof-currentPassword" class="input-field" placeholder="Enter current password" required autocomplete="current-password">
            </div>
            <div style="margin-bottom:1rem;">
              <label style="display:block; font-weight:600; margin-bottom:0.25rem; font-size:0.875rem; color:#475569;">New Password</label>
              <input type="password" id="ref-prof-newPassword" class="input-field" placeholder="Enter new password" required minlength="6" autocomplete="new-password">
            </div>
            <button type="submit" class="btn-primary" id="ref-prof-password-submit">Update Password</button>
          </form>
          <div id="ref-prof-password-error" class="error-message" style="display:none; margin-top:0.75rem;"></div>
        </div>

        <!-- Danger Zone -->
        <div class="danger-zone" style="margin-bottom:1.5rem;">
          <h3 style="font-weight:700; color:#dc2626; margin-bottom:0.75rem;">Danger Zone</h3>
          <p class="text-muted" style="margin-bottom:1rem;">Permanently delete your referral account and all associated data.</p>
          <button class="btn-danger" id="ref-profile-delete-btn">Delete Referral Account</button>
        </div>

        <!-- Delete Confirmation Modal -->
        <div id="ref-profile-delete-modal" class="loading-overlay" style="display:none;">
          <div class="card" style="padding:2rem; max-width:400px; text-align:center;">
            <h3 style="font-size:1.25rem; font-weight:700; color:#dc2626; margin-bottom:0.75rem;">Delete Referral Account</h3>
            <p style="color:#64748b; margin-bottom:1.5rem;">Are you sure? This action cannot be undone.</p>
            <div style="display:flex; gap:0.75rem; justify-content:center;">
              <button id="ref-prof-delete-confirm" class="btn-danger">Yes, Delete</button>
              <button id="ref-prof-delete-dismiss" class="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async init() {
    ReferralNavbar.init();

    const errorEl = document.getElementById('referral-profile-error');
    const emailForm = document.getElementById('ref-profile-email-form');
    const emailError = document.getElementById('ref-prof-email-error');
    const passwordForm = document.getElementById('ref-profile-password-form');
    const passwordError = document.getElementById('ref-prof-password-error');
    const deleteBtn = document.getElementById('ref-profile-delete-btn');
    const deleteModal = document.getElementById('ref-profile-delete-modal');
    const deleteConfirm = document.getElementById('ref-prof-delete-confirm');
    const deleteDismiss = document.getElementById('ref-prof-delete-dismiss');

    try {
      const profile = await API.Referral.getMyProfile();

      document.getElementById('ref-prof-name').textContent = (profile.firstName && profile.lastName)
        ? `${profile.firstName} ${profile.lastName}` : '—';
      document.getElementById('ref-prof-code').textContent = profile.code || '—';
      document.getElementById('ref-prof-email').textContent = profile.email || '—';
      document.getElementById('ref-prof-emailStatus').innerHTML = profile.emailConfirmed
        ? '<span class="badge badge-success">Confirmed</span>'
        : '<span class="badge badge-warning">Pending</span>';
      document.getElementById('ref-prof-phone').textContent = profile.phoneNumber || 'Not set';
      document.getElementById('ref-prof-phoneStatus').innerHTML = profile.phoneNumberConfirmed
        ? '<span class="badge badge-success">Confirmed</span>'
        : profile.phoneNumber ? '<span class="badge badge-warning">Pending</span>' : '<span class="text-muted">—</span>';

      ReferralAuth.setUser(profile);
    } catch (err) {
      errorEl.textContent = `Failed to load profile: ${err.message}`;
      errorEl.style.display = 'block';
    }

    // Update email
    emailForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      emailError.style.display = 'none';
      const newEmail = document.getElementById('ref-prof-newEmail').value.trim();
      if (!newEmail) return;

      const submitBtn = document.getElementById('ref-prof-email-submit');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Updating...';

      try {
        await API.Referral.updateEmail(newEmail);
        Toast.success('Email updated! Please check your new email to confirm.');
        document.getElementById('ref-prof-email').textContent = newEmail;
        document.getElementById('ref-prof-emailStatus').innerHTML = '<span class="badge badge-warning">Pending</span>';
        document.getElementById('ref-prof-newEmail').value = '';
        ReferralAuth.setUser({ ...ReferralAuth.getUser(), email: newEmail });
      } catch (err) {
        emailError.textContent = err.message || 'Failed to update email.';
        emailError.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Update Email';
      }
    });

    // Update password
    passwordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      passwordError.style.display = 'none';
      const currentPassword = document.getElementById('ref-prof-currentPassword').value;
      const newPassword = document.getElementById('ref-prof-newPassword').value;

      if (newPassword.length < 6) {
        passwordError.textContent = 'New password must be at least 6 characters.';
        passwordError.style.display = 'block';
        return;
      }

      const submitBtn = document.getElementById('ref-prof-password-submit');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Updating...';

      try {
        await API.Referral.updatePassword(currentPassword, newPassword);
        Toast.success('Password updated successfully!');
        passwordForm.reset();
      } catch (err) {
        passwordError.textContent = err.message || 'Failed to update password.';
        passwordError.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Update Password';
      }
    });

    // Delete account modal
    deleteBtn.addEventListener('click', () => {
      deleteModal.style.display = 'flex';
    });

    deleteDismiss.addEventListener('click', () => {
      deleteModal.style.display = 'none';
    });

    deleteModal.addEventListener('click', (e) => {
      if (e.target === deleteModal) deleteModal.style.display = 'none';
    });

    deleteConfirm.addEventListener('click', async () => {
      deleteConfirm.disabled = true;
      deleteConfirm.innerHTML = '<span class="spinner"></span> Deleting...';

      try {
        await API.Referral.deleteAccount();
        Toast.success('Referral account deleted successfully.');
        ReferralAuth.clearSession();
        window.location.hash = '#referral-login';
      } catch (err) {
        Toast.error(`Failed to delete account: ${err.message}`);
        deleteConfirm.disabled = false;
        deleteConfirm.innerHTML = 'Yes, Delete';
        deleteModal.style.display = 'none';
      }
    });
  },
};