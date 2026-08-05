/**
 * Jellin Referral Register View
 */
const ReferralRegisterView = {
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
          <h1 style="font-size:1.5rem; font-weight:800; margin-top:0.75rem;">Become a Jellin Referral</h1>
          <p style="opacity:0.85; font-size:0.95rem;">Create your referral account and start earning</p>
        </div>
      </div>

      <div class="app-container" style="padding-top: 1.5rem;">
        <div class="auth-card">
          <div id="referral-register-error" class="error-message" style="display:none;"></div>

          <form id="referral-register-form">
            <div style="margin-bottom: 1rem;">
              <label style="display:block; font-weight:600; margin-bottom:0.25rem; font-size:0.875rem; color:#475569;">Referral Code *</label>
              <input type="text" id="ref-reg-code" class="input-field" placeholder="Your unique referral code" required>
            </div>
            <div style="margin-bottom: 1rem;">
              <label style="display:block; font-weight:600; margin-bottom:0.25rem; font-size:0.875rem; color:#475569;">First Name *</label>
              <input type="text" id="ref-reg-firstName" class="input-field" placeholder="Your first name" required>
            </div>
            <div style="margin-bottom: 1rem;">
              <label style="display:block; font-weight:600; margin-bottom:0.25rem; font-size:0.875rem; color:#475569;">Last Name *</label>
              <input type="text" id="ref-reg-lastName" class="input-field" placeholder="Your last name" required>
            </div>
            <div style="margin-bottom: 1rem;">
              <label style="display:block; font-weight:600; margin-bottom:0.25rem; font-size:0.875rem; color:#475569;">Phone Number *</label>
              <input type="tel" id="ref-reg-phone" class="input-field" placeholder="+306975468665" required>
            </div>
            <div style="margin-bottom: 1rem;">
              <label style="display:block; font-weight:600; margin-bottom:0.25rem; font-size:0.875rem; color:#475569;">Email *</label>
              <input type="email" id="ref-reg-email" class="input-field" placeholder="you@example.com" required autocomplete="email">
            </div>
            <div style="margin-bottom: 1rem;">
              <label style="display:block; font-weight:600; margin-bottom:0.25rem; font-size:0.875rem; color:#475569;">Password *</label>
              <div style="position:relative;">
                <input type="password" id="ref-reg-password" class="input-field" style="padding-right:3rem;" placeholder="Create a strong password" required autocomplete="new-password" minlength="6">
                <button type="button" class="toggle-password" data-target="ref-reg-password" style="position:absolute; right:0.5rem; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; padding:0.5rem; color:#94a3b8; font-size:1.25rem;" aria-label="Show password" title="Show password">
                  <svg id="ref-reg-password-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
            </div>
            <div style="margin-bottom: 1rem;">
              <label style="display:block; font-weight:600; margin-bottom:0.25rem; font-size:0.875rem; color:#475569;">Confirm Password *</label>
              <div style="position:relative;">
                <input type="password" id="ref-reg-password-confirm" class="input-field" style="padding-right:3rem;" placeholder="Re-enter your password" required autocomplete="new-password" minlength="6">
                <button type="button" class="toggle-password" data-target="ref-reg-password-confirm" style="position:absolute; right:0.5rem; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; padding:0.5rem; color:#94a3b8; font-size:1.25rem;" aria-label="Show password" title="Show password">
                  <svg id="ref-reg-password-confirm-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
              <div id="ref-reg-password-match" style="font-size:0.8rem; margin-top:0.25rem; min-height:1.25rem;"></div>
            </div>
            <button type="submit" class="btn-primary" style="width:100%;" id="referral-register-submit">Create Referral Account</button>
          </form>

          <div style="text-align:center; margin-top:1.5rem;">
            <p style="color:#64748b;">
              Already have a referral account? <a href="#referral-login" class="link">Sign in</a>
            </p>
            <p style="margin-top:0.75rem; color:#64748b;">
              <a href="#login" class="link">← Back to Business Login</a>
            </p>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    const form = document.getElementById('referral-register-form');
    const errorEl = document.getElementById('referral-register-error');
    const submitBtn = document.getElementById('referral-register-submit');
    const passwordInput = document.getElementById('ref-reg-password');
    const confirmInput = document.getElementById('ref-reg-password-confirm');
    const matchEl = document.getElementById('ref-reg-password-match');

    // Live password match indicator
    function checkPasswordMatch() {
      const pass = passwordInput.value;
      const confirm = confirmInput.value;
      if (confirm.length === 0) {
        matchEl.innerHTML = '';
        confirmInput.classList.remove('error');
      } else if (pass === confirm) {
        matchEl.innerHTML = '<span style="color:#10b981;">✓ Passwords match</span>';
        confirmInput.classList.remove('error');
      } else {
        matchEl.innerHTML = '<span style="color:#ef4444;">✗ Passwords do not match</span>';
        confirmInput.classList.add('error');
      }
    }

    passwordInput.addEventListener('input', checkPasswordMatch);
    confirmInput.addEventListener('input', checkPasswordMatch);

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const input = document.getElementById(targetId);
        const icon = document.getElementById(targetId + '-icon');
        if (!input || !icon) return;

        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';

        if (isPassword) {
          icon.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
            <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          `;
          btn.setAttribute('aria-label', 'Hide password');
          btn.setAttribute('title', 'Hide password');
        } else {
          icon.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          `;
          btn.setAttribute('aria-label', 'Show password');
          btn.setAttribute('title', 'Show password');
        }
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorEl.style.display = 'none';

      const code = document.getElementById('ref-reg-code').value.trim();
      const firstName = document.getElementById('ref-reg-firstName').value.trim();
      const lastName = document.getElementById('ref-reg-lastName').value.trim();
      const phoneNumber = document.getElementById('ref-reg-phone').value.trim();
      const email = document.getElementById('ref-reg-email').value.trim();
      const password = passwordInput.value;
      const confirmPassword = confirmInput.value;

      // Basic validation
      if (!code || !firstName || !lastName || !phoneNumber || !email || !password) {
        errorEl.textContent = 'Please fill in all required fields.';
        errorEl.style.display = 'block';
        return;
      }

      if (password.length < 6) {
        errorEl.textContent = 'Password must be at least 6 characters.';
        errorEl.style.display = 'block';
        return;
      }

      if (password !== confirmPassword) {
        errorEl.textContent = 'Passwords do not match. Please re-enter.';
        errorEl.style.display = 'block';
        confirmInput.classList.add('error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Creating account...';

      try {
        await API.Referral.register({
          code,
          firstName,
          lastName,
          phoneNumber,
          email,
          password,
        });

        Toast.success('Referral account created! Check your email for the activation key.');
        setTimeout(() => {
          window.location.hash = '#referral-confirm-email';
          sessionStorage.setItem('jellin_referral_registeredEmail', email);
        }, 1500);
      } catch (err) {
        errorEl.textContent = err.message || 'Registration failed. Please try again.';
        errorEl.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Create Referral Account';
      }
    });
  },
};