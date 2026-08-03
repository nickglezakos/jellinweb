/**
 * Jellin Profile View
 * Update email, password, delete account, logout.
 */
const ProfileView = {
  async render() {
    return `
      ${Navbar.render('profile')}
      <div class="app-container" style="max-width: 640px;">
        <div style="margin-bottom: 2rem;">
          <h1 style="font-size: 1.75rem; font-weight: 800; color: #1e293b; margin-bottom: 0.25rem;">Profile Settings</h1>
          <p class="text-muted">Manage your account details</p>
        </div>

        <div id="profile-error" class="error-message" style="display:none;"></div>

        <!-- Connection Info Card -->
        <div class="card" style="padding:1.5rem; margin-bottom:1.5rem;" id="profile-info-card">
          <h2 style="font-size:1.25rem; font-weight:700; color:#1e293b; margin-bottom:1rem;">Account Info</h2>
          <div id="profile-info" style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
            <div class="stat-card">
              <div class="stat-label">Email</div>
              <div class="stat-value" style="font-size:0.95rem;" id="prof-email">—</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Email Status</div>
              <div class="stat-value" style="font-size:0.95rem;" id="prof-emailStatus">—</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Phone</div>
              <div class="stat-value" style="font-size:0.95rem;" id="prof-phone">—</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Phone Status</div>
              <div class="stat-value" style="font-size:0.95rem;" id="prof-phoneStatus">—</div>
            </div>
          </div>
          <div id="prof-tenant-info" style="margin-top:0.75rem;"></div>
        </div>

        <!-- Update Email -->
        <div class="card" style="padding:1.5rem; margin-bottom:1.5rem;">
          <h2 style="font-size:1.25rem; font-weight:700; color:#1e293b; margin-bottom:1rem;">Update Email</h2>
          <form id="profile-email-form">
            <div style="margin-bottom:1rem;">
              <label style="display:block; font-weight:600; margin-bottom:0.25rem; font-size:0.875rem; color:#475569;">New Email</label>
              <input type="email" id="prof-newEmail" class="input-field" placeholder="new@example.com" required autocomplete="email">
            </div>
            <button type="submit" class="btn-primary" id="prof-email-submit">Update Email</button>
          </form>
          <div id="prof-email-error" class="error-message" style="display:none; margin-top:0.75rem;"></div>
        </div>

        <!-- Update Password -->
        <div class="card" style="padding:1.5rem; margin-bottom:1.5rem;">
          <h2 style="font-size:1.25rem; font-weight:700; color:#1e293b; margin-bottom:1rem;">Update Password</h2>
          <form id="profile-password-form">
            <div style="margin-bottom:1rem;">
              <label style="display:block; font-weight:600; margin-bottom:0.25rem; font-size:0.875rem; color:#475569;">Current Password</label>
              <input type="password" id="prof-currentPassword" class="input-field" placeholder="Enter current password" required autocomplete="current-password">
            </div>
            <div style="margin-bottom:1rem;">
              <label style="display:block; font-weight:600; margin-bottom:0.25rem; font-size:0.875rem; color:#475569;">New Password</label>
              <input type="password" id="prof-newPassword" class="input-field" placeholder="Enter new password" required minlength="6" autocomplete="new-password">
            </div>
            <button type="submit" class="btn-primary" id="prof-password-submit">Update Password</button>
          </form>
          <div id="prof-password-error" class="error-message" style="display:none; margin-top:0.75rem;"></div>
        </div>

        <!-- Danger Zone -->
        <div class="danger-zone" style="margin-bottom:1.5rem;">
          <h3 style="font-weight:700; color:#991b1b; margin-bottom:0.5rem;">Danger Zone</h3>
          <p style="color:#64748b; font-size:0.875rem; margin-bottom:1rem;">Once you delete your account, there is no going back. Please be certain.</p>
          <button id="prof-delete-btn" class="btn-danger">Delete Account</button>
        </div>

        <!-- Delete Confirmation Modal -->
        <div id="prof-delete-modal" class="loading-overlay" style="display:none;">
          <div class="card" style="padding:2rem; max-width:400px; text-align:center;">
            <h3 style="font-size:1.25rem; font-weight:700; color:#dc2626; margin-bottom:0.75rem;">Delete Account</h3>
            <p style="color:#64748b; margin-bottom:1.5rem;">This action is permanent and cannot be undone. All your data will be deleted.</p>
            <div style="display:flex; gap:0.75rem; justify-content:center;">
              <button id="prof-delete-confirm" class="btn-danger">Yes, Delete My Account</button>
              <button id="prof-delete-dismiss" class="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async init() {
    Navbar.init();

    const emailForm = document.getElementById('profile-email-form');
    const passwordForm = document.getElementById('profile-password-form');
    const emailError = document.getElementById('prof-email-error');
    const passwordError = document.getElementById('prof-password-error');
    const deleteBtn = document.getElementById('prof-delete-btn');
    const deleteModal = document.getElementById('prof-delete-modal');
    const deleteConfirm = document.getElementById('prof-delete-confirm');
    const deleteDismiss = document.getElementById('prof-delete-dismiss');

    // Load account info
    try {
      const data = await API.Account.getConnectionInfo();
      document.getElementById('prof-email').textContent = data.email || '—';
      document.getElementById('prof-emailStatus').innerHTML = data.emailConfirmed
        ? '<span class="badge badge-success">Confirmed</span>'
        : '<span class="badge badge-warning">Pending</span>';
      document.getElementById('prof-phone').textContent = data.phoneNumber || 'Not set';
      document.getElementById('prof-phoneStatus').innerHTML = data.phoneNumberConfirmed
        ? '<span class="badge badge-success">Confirmed</span>'
        : data.phoneNumber
          ? '<span class="badge badge-warning">Pending</span>'
          : '<span class="text-muted">—</span>';

      if (data.operatorOwnsSeparateTenant) {
        document.getElementById('prof-tenant-info').innerHTML = `
          <div class="badge badge-purple">Separate Tenant Owner</div>
        `;
      }
    } catch (err) {
      document.getElementById('profile-error').textContent = `Failed to load account info: ${err.message}`;
      document.getElementById('profile-error').style.display = 'block';
    }

    // Update email
    emailForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      emailError.style.display = 'none';
      const newEmail = document.getElementById('prof-newEmail').value.trim();
      if (!newEmail) return;

      const submitBtn = document.getElementById('prof-email-submit');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Updating...';

      try {
        await API.Account.updateEmail(newEmail);
        Toast.success('Email updated! Please check your new email to confirm.');
        document.getElementById('prof-email').textContent = newEmail;
        document.getElementById('prof-emailStatus').innerHTML = '<span class="badge badge-warning">Pending</span>';
        document.getElementById('prof-newEmail').value = '';
        Auth.setUser({ ...Auth.getUser(), email: newEmail });
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
      const currentPassword = document.getElementById('prof-currentPassword').value;
      const newPassword = document.getElementById('prof-newPassword').value;

      if (newPassword.length < 6) {
        passwordError.textContent = 'New password must be at least 6 characters.';
        passwordError.style.display = 'block';
        return;
      }

      const submitBtn = document.getElementById('prof-password-submit');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Updating...';

      try {
        await API.Account.updatePassword(currentPassword, newPassword);
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
        await API.Account.deleteAccount();
        Toast.success('Account deleted successfully.');
        Auth.clearSession();
        window.location.hash = '#login';
      } catch (err) {
        Toast.error(`Failed to delete account: ${err.message}`);
        deleteConfirm.disabled = false;
        deleteConfirm.innerHTML = 'Yes, Delete My Account';
        deleteModal.style.display = 'none';
      }
    });
  },
};