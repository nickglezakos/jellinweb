/**
 * Jellin Login View
 */
const LoginView = {
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
          <h1 style="font-size:1.5rem; font-weight:800; margin-top:0.75rem;">Welcome back</h1>
          <p style="opacity:0.85; font-size:0.95rem;">Sign in to your Jellin account</p>
        </div>
      </div>

      <div class="app-container" style="padding-top: 1.5rem;">
        <div class="auth-card">
          <div id="login-error" class="error-message" style="display:none;"></div>
          <div id="multi-tenant-section" style="display:none;">
            <p class="text-muted" style="margin-bottom: 1rem; text-align: center;">Select a tenant to continue:</p>
            <div id="tenant-list" style="margin-bottom: 1rem;"></div>
          </div>

          <form id="login-form">
            <div style="margin-bottom: 1rem;">
              <label style="display:block; font-weight:600; margin-bottom:0.25rem; font-size:0.875rem; color:#475569;">Email</label>
              <input type="email" id="login-email" class="input-field" placeholder="you@example.com" required autocomplete="email">
            </div>
            <div style="margin-bottom: 1.5rem;">
              <label style="display:block; font-weight:600; margin-bottom:0.25rem; font-size:0.875rem; color:#475569;">Password</label>
              <div style="position:relative;">
                <input type="password" id="login-password" class="input-field" style="padding-right:3rem;" placeholder="Enter your password" required autocomplete="current-password">
                <button type="button" class="toggle-password" data-target="login-password" style="position:absolute; right:0.5rem; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; padding:0.5rem; color:#94a3b8; font-size:1.25rem;" aria-label="Show password" title="Show password">
                  <svg id="login-password-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
            </div>
            <button type="submit" class="btn-primary" style="width:100%;" id="login-submit">Sign In</button>
          </form>

          <div style="text-align:center; margin-top:1.5rem;">
            <p class="text-muted">
              <a href="#forgot-password" class="link">Forgot password?</a>
            </p>
            <p style="margin-top:0.75rem; color:#64748b;">
              Don't have an account? <a href="#register" class="link">Sign up</a>
            </p>
            <p style="margin-top:0.5rem; color:#64748b;">
              Need to confirm your email? <a href="#confirm-email" class="link">Enter activation key</a>
            </p>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    const form = document.getElementById('login-form');
    const errorEl = document.getElementById('login-error');
    const submitBtn = document.getElementById('login-submit');
    const multiTenantSection = document.getElementById('multi-tenant-section');
    const tenantList = document.getElementById('tenant-list');

    // Store multi-tenant data
    let multiTenantData = null;

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

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Hide errors
      errorEl.style.display = 'none';
      multiTenantSection.style.display = 'none';

      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      // Basic validation
      if (!email || !password) {
        errorEl.textContent = 'Please enter both email and password.';
        errorEl.style.display = 'block';
        return;
      }

      // Set loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Signing in...';

      try {
        const response = await API.Account.login(email, password);

        if (response.token) {
          // Successful login
          Auth.setSession(response.token, response.refreshToken, { email });
          // Check if there's a redirect after login (e.g. from email confirmation)
          const returnTo = sessionStorage.getItem('jellin_returnTo');
          if (returnTo) {
            sessionStorage.removeItem('jellin_returnTo');
            window.location.hash = returnTo;
          } else {
            window.location.hash = '#dashboard';
          }
        } else if (response.associatedTenants) {
          // Multi-tenant: user belongs to multiple tenants
          multiTenantData = response;
          multiTenantSection.style.display = 'block';
          // Hide login form
          form.style.display = 'none';
          
          // Render tenant list
          tenantList.innerHTML = response.associatedTenants.map(t => `
            <button class="btn-secondary" style="width:100%; margin-bottom:0.5rem; text-align:left;"
              data-tenant-id="${t.id}">
              <span style="font-weight:700;">${t.name}</span>
              <span class="badge badge-${t.status === 'Active' ? 'success' : 'warning'}" style="float:right;">${t.status}</span>
            </button>
          `).join('');

          // Add tenant selection handler
          tenantList.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', async () => {
              const tenantId = parseInt(btn.dataset.tenantId);
              try {
                const retryResponse = await API.Account.login(email, password, tenantId);
                if (retryResponse.token) {
                  Auth.setSession(retryResponse.token, retryResponse.refreshToken, { email });
                  window.location.hash = '#dashboard';
                }
              } catch (err) {
                errorEl.textContent = err.message;
                errorEl.style.display = 'block';
              }
            });
          });

          // Back button to return to login form
          const backBtn = document.createElement('button');
          backBtn.className = 'link';
          backBtn.textContent = '← Back to login';
          backBtn.style.display = 'block';
          backBtn.style.marginTop = '1rem';
          backBtn.style.textAlign = 'center';
          backBtn.style.width = '100%';
          backBtn.addEventListener('click', () => {
            multiTenantSection.style.display = 'none';
            form.style.display = 'block';
          });
          multiTenantSection.appendChild(backBtn);

        } else {
          // Unconfirmed credentials
          errorEl.textContent = 'Your account is not yet confirmed. Please check your email for the activation link.';
          errorEl.style.display = 'block';
        }
      } catch (err) {
        errorEl.textContent = err.message || 'Login failed. Please check your credentials.';
        errorEl.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Sign In';
      }
    });

    // Check URL params for email confirmation redirect
    const hash = window.location.hash;
    if (hash.includes('activationKey')) {
      const params = new URLSearchParams(hash.split('?')[1] || '');
      const activationKey = params.get('activationKey');
      const email = params.get('email');
      if (activationKey && email) {
        // Pre-fill email and show password input for confirmation
        const emailInput = document.getElementById('login-email');
        if (emailInput) {
          emailInput.value = email;
        }
        // Show a message
        errorEl.textContent = 'Please enter your password to complete email confirmation.';
        errorEl.style.display = 'block';
        errorEl.style.background = '#eff6ff';
        errorEl.style.border = '1px solid #bfdbfe';
        errorEl.style.color = '#1e40af';
        
        // Store activation key for the login handler to process
        form.dataset.activationKey = activationKey;
      }
    }
  },
};