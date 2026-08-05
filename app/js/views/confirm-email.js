/**
 * Jellin Confirm Email View
 * Allows users to manually enter their activation key from the confirmation email.
 */
const ConfirmEmailView = {
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
          <h1 style="font-size:1.5rem; font-weight:800; margin-top:0.75rem;">Confirm Your Email</h1>
          <p style="opacity:0.85; font-size:0.95rem;">Enter the activation key from your email</p>
        </div>
      </div>

      <div class="app-container" style="padding-top: 1.5rem;">
        <div class="auth-card">
          <div id="confirm-email-error" class="error-message" style="display:none;"></div>
          <div id="confirm-email-success" class="success-message" style="display:none;"></div>

          <form id="confirm-email-form">
            <div style="margin-bottom: 1rem;">
              <label style="display:block; font-weight:600; margin-bottom:0.25rem; font-size:0.875rem; color:#475569;">Activation Key *</label>
              <input type="text" id="confirm-activationKey" class="input-field" placeholder="Paste your activation key here" required>
              <p class="text-muted" style="font-size:0.75rem; margin-top:0.25rem;">You received this key in your confirmation email.</p>
            </div>
            <div style="margin-bottom: 1rem;">
              <label style="display:block; font-weight:600; margin-bottom:0.25rem; font-size:0.875rem; color:#475569;">Email *</label>
              <input type="email" id="confirm-email" class="input-field" placeholder="you@example.com" required autocomplete="email">
            </div>
            <div style="margin-bottom: 1.5rem;">
              <label style="display:block; font-weight:600; margin-bottom:0.25rem; font-size:0.875rem; color:#475569;">Password *</label>
              <div style="position:relative;">
                <input type="password" id="confirm-password" class="input-field" style="padding-right:3rem;" placeholder="Enter your password" required autocomplete="current-password">
                <button type="button" class="toggle-password" data-target="confirm-password" style="position:absolute; right:0.5rem; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; padding:0.5rem; color:#94a3b8; font-size:1.25rem;" aria-label="Show password" title="Show password">
                  <svg id="confirm-password-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
            </div>
            <button type="submit" class="btn-primary" style="width:100%;" id="confirm-email-submit">Confirm Email</button>
          </form>

          <div style="text-align:center; margin-top:1.5rem;">
            <p class="text-muted">
              Didn't receive the email? <a href="#" id="confirm-resend-link" class="link">Resend confirmation email</a>
            </p>
            <p style="margin-top:0.75rem; color:#64748b;">
              <a href="#login" class="link">← Back to Login</a>
            </p>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    const form = document.getElementById('confirm-email-form');
    const errorEl = document.getElementById('confirm-email-error');
    const successEl = document.getElementById('confirm-email-success');
    const submitBtn = document.getElementById('confirm-email-submit');
    const resendLink = document.getElementById('confirm-resend-link');

    // Pre-fill email if available from registration
    const registeredEmail = sessionStorage.getItem('jellin_registeredEmail');
    if (registeredEmail) {
      document.getElementById('confirm-email').value = registeredEmail;
    }

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

    // Resend confirmation email
    resendLink.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = document.getElementById('confirm-email').value.trim();
      const password = document.getElementById('confirm-password').value;
      
      if (!email || !password) {
        errorEl.textContent = 'Please enter your email and password to resend the confirmation email.';
        errorEl.style.display = 'block';
        return;
      }

      resendLink.style.pointerEvents = 'none';
      resendLink.textContent = 'Sending...';

      try {
        await API.Account.resendConfirmationEmail(email, password);
        Toast.success('Confirmation email resent! Check your inbox.');
      } catch (err) {
        errorEl.textContent = err.message || 'Failed to resend confirmation email.';
        errorEl.style.display = 'block';
      } finally {
        resendLink.style.pointerEvents = 'auto';
        resendLink.textContent = 'Resend confirmation email';
      }
    });

    // Submit confirmation
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorEl.style.display = 'none';
      successEl.style.display = 'none';

      const activationKey = document.getElementById('confirm-activationKey').value.trim();
      const email = document.getElementById('confirm-email').value.trim();
      const password = document.getElementById('confirm-password').value;

      if (!activationKey || !email || !password) {
        errorEl.textContent = 'Please fill in all fields.';
        errorEl.style.display = 'block';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Confirming...';

      try {
        await API.Account.confirmEmail(activationKey, email, password);
        
        // Hide form, show success
        form.style.display = 'none';
        successEl.innerHTML = `
          <p style="font-weight:700; margin-bottom:0.5rem;">Email confirmed successfully!</p>
          <p>You can now <a href="#login" class="link">sign in</a> to your account.</p>
        `;
        successEl.style.display = 'block';
        
        // Clear stored email
        sessionStorage.removeItem('jellin_registeredEmail');
        
        // Pre-fill email for login
        sessionStorage.setItem('jellin_registeredEmail', email);
      } catch (err) {
        errorEl.textContent = err.message || 'Email confirmation failed. Please check your activation key and try again.';
        errorEl.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Confirm Email';
      }
    });
  },
};