/**
 * Jellin Forgot / Reset Password View
 * Two-step flow: request OTP → enter OTP + new password
 */
const ForgotPasswordView = {
  STEP_REQUEST: 'request',
  STEP_RESET: 'reset',

  async render() {
    return `
      <!-- Hero Banner with Gradient Background -->
      <div class="jell-gradient text-white py-10 px-4 text-center relative overflow-hidden">
        <div class="absolute inset-0 bg-white opacity-10"></div>
        <div class="relative z-10">
          <svg viewBox="0 0 200 80" style="width: 180px; height: auto; display: block; margin: 0 auto;">
            <g transform="translate(22, 0)">
              <path d="M50 5 L50 55 Q50 75 30 75 Q10 75 10 55 L10 48"
                    fill="none" stroke="white" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M62 45 Q62 35 72 35 Q82 35 82 45 L82 47 L62 47 Q62 57 72 57 Q77 57 82 54"
                    fill="none" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M92 25 L92 57"
                    fill="none" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M104 25 L104 57"
                    fill="none" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M116 37 L116 57"
                    fill="none" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="116" cy="30" r="3" fill="white"/>
              <path d="M128 57 L128 45 Q128 37 136 37 Q144 37 144 45 L144 57"
                    fill="none" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
          </svg>
          <h1 style="font-size:1.5rem; font-weight:800; margin-top:0.75rem;">Reset your password</h1>
          <p style="opacity:0.85; font-size:0.95rem;" id="fp-subtitle">Enter your email to receive a reset code</p>
        </div>
      </div>

      <div class="app-container" style="padding-top: 1.5rem;">
        <div class="auth-card">
          <div id="fp-error" class="error-message" style="display:none;"></div>

          <!-- Step 1: Request OTP -->
          <form id="fp-request-form">
            <div style="margin-bottom: 1.5rem;">
              <label style="display:block; font-weight:600; margin-bottom:0.25rem; font-size:0.875rem; color:#475569;">Email</label>
              <input type="email" id="fp-email" class="input-field" placeholder="you@example.com" required autocomplete="email">
            </div>
            <button type="submit" class="btn-primary" style="width:100%;" id="fp-request-submit">Send Reset Code</button>
          </form>

          <!-- Step 2: Enter OTP + new password -->
          <form id="fp-reset-form" style="display:none;">
            <div style="margin-bottom: 1rem;">
              <label style="display:block; font-weight:600; margin-bottom:0.25rem; font-size:0.875rem; color:#475569;">Reset Code (OTP)</label>
              <input type="text" id="fp-otp" class="input-field" placeholder="Enter the code sent to your email" required inputmode="numeric">
            </div>
            <div style="margin-bottom: 1rem;">
              <label style="display:block; font-weight:600; margin-bottom:0.25rem; font-size:0.875rem; color:#475569;">New Password</label>
              <div style="position:relative;">
                <input type="password" id="fp-newPassword" class="input-field" style="padding-right:3rem;" placeholder="Enter a new password" required minlength="6" autocomplete="new-password">
                <button type="button" class="toggle-password" data-target="fp-newPassword" style="position:absolute; right:0.5rem; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; padding:0.5rem; color:#94a3b8; font-size:1.25rem;" aria-label="Show password" title="Show password">
                  <svg id="fp-newPassword-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
            </div>
            <div style="margin-bottom: 1.5rem;">
              <label style="display:block; font-weight:600; margin-bottom:0.25rem; font-size:0.875rem; color:#475569;">Confirm New Password</label>
              <div style="position:relative;">
                <input type="password" id="fp-newPassword-confirm" class="input-field" style="padding-right:3rem;" placeholder="Re-enter your new password" required minlength="6" autocomplete="new-password">
                <button type="button" class="toggle-password" data-target="fp-newPassword-confirm" style="position:absolute; right:0.5rem; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; padding:0.5rem; color:#94a3b8; font-size:1.25rem;" aria-label="Show password" title="Show password">
                  <svg id="fp-newPassword-confirm-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
              <div id="fp-password-match" style="font-size:0.8rem; margin-top:0.25rem; min-height:1.25rem;"></div>
            </div>
            <button type="submit" class="btn-primary" style="width:100%;" id="fp-reset-submit">Reset Password</button>
            <button type="button" class="link" id="fp-back-btn" style="display:block; margin:1rem auto 0; text-align:center; background:none; border:none; font-size:0.875rem;">
              ← Back
            </button>
          </form>

          <div style="text-align:center; margin-top:1.5rem;">
            <p style="color:#64748b;">
              Remember your password? <a href="#login" class="link">Sign in</a>
            </p>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    const requestForm = document.getElementById('fp-request-form');
    const resetForm = document.getElementById('fp-reset-form');
    const errorEl = document.getElementById('fp-error');
    const subtitleEl = document.getElementById('fp-subtitle');
    const emailInput = document.getElementById('fp-email');
    const newPasswordInput = document.getElementById('fp-newPassword');
    const confirmPasswordInput = document.getElementById('fp-newPassword-confirm');
    const matchEl = document.getElementById('fp-password-match');
    let currentEmail = '';

    // Live password match indicator
    function checkPasswordMatch() {
      const pass = newPasswordInput.value;
      const confirm = confirmPasswordInput.value;
      if (confirm.length === 0) {
        matchEl.innerHTML = '';
        confirmPasswordInput.classList.remove('error');
      } else if (pass === confirm) {
        matchEl.innerHTML = '<span style="color:#10b981;">✓ Passwords match</span>';
        confirmPasswordInput.classList.remove('error');
      } else {
        matchEl.innerHTML = '<span style="color:#ef4444;">✗ Passwords do not match</span>';
        confirmPasswordInput.classList.add('error');
      }
    }

    newPasswordInput.addEventListener('input', checkPasswordMatch);
    confirmPasswordInput.addEventListener('input', checkPasswordMatch);

    // Password show/hide toggle
    document.querySelectorAll('.toggle-password').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const input = document.getElementById(targetId);
        const icon = document.getElementById(targetId + '-icon');
        if (!input || !icon) return;

        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';

        if (isPassword) {
          icon.innerHTML = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`;
          btn.setAttribute('aria-label', 'Hide password');
        } else {
          icon.innerHTML = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
          btn.setAttribute('aria-label', 'Show password');
        }
      });
    });

    // Step 1: Request OTP
    requestForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorEl.style.display = 'none';

      const email = emailInput.value.trim();
      if (!email) {
        errorEl.textContent = 'Please enter your email address.';
        errorEl.style.display = 'block';
        return;
      }

      currentEmail = email;
      const submitBtn = document.getElementById('fp-request-submit');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Sending...';

      try {
        await API.Account.requestPasswordReset(email);
        Toast.success('Reset code sent! Check your email.');
        // Switch to step 2
        requestForm.style.display = 'none';
        resetForm.style.display = 'block';
        subtitleEl.textContent = `Enter the code sent to ${email}`;
      } catch (err) {
        errorEl.textContent = err.message || 'Failed to send reset code. Please try again.';
        errorEl.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Reset Code';
      }
    });

    // Step 2: Reset password with OTP
    resetForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorEl.style.display = 'none';

      const otp = parseInt(document.getElementById('fp-otp').value.trim(), 10);
      const newPassword = newPasswordInput.value;
      const confirmPassword = confirmPasswordInput.value;

      if (!otp || isNaN(otp)) {
        errorEl.textContent = 'Please enter a valid numeric OTP code.';
        errorEl.style.display = 'block';
        return;
      }
      if (newPassword.length < 6) {
        errorEl.textContent = 'Password must be at least 6 characters.';
        errorEl.style.display = 'block';
        return;
      }
      if (newPassword !== confirmPassword) {
        errorEl.textContent = 'Passwords do not match. Please re-enter.';
        errorEl.style.display = 'block';
        confirmPasswordInput.classList.add('error');
        return;
      }

      const submitBtn = document.getElementById('fp-reset-submit');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Resetting...';

      try {
        await API.Account.resetPassword(currentEmail, otp);
        Toast.success('Password reset successful! You can now sign in.');
        window.location.hash = '#login';
      } catch (err) {
        errorEl.textContent = err.message || 'Failed to reset password. Check your OTP code.';
        errorEl.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Reset Password';
      }
    });

    // Back button
    document.getElementById('fp-back-btn').addEventListener('click', () => {
      resetForm.style.display = 'none';
      requestForm.style.display = 'block';
      subtitleEl.textContent = 'Enter your email to receive a reset code';
      errorEl.style.display = 'none';
      document.getElementById('fp-request-submit').disabled = false;
      document.getElementById('fp-request-submit').innerHTML = 'Send Reset Code';
    });

    // Pre-fill email from registered session if available
    const registeredEmail = sessionStorage.getItem('jellin_registeredEmail');
    if (registeredEmail) {
      emailInput.value = registeredEmail;
      sessionStorage.removeItem('jellin_registeredEmail');
    }
  },
};