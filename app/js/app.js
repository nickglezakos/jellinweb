/**
 * Jellin App Router
 * Hash-based SPA router with auth guard.
 */
const App = {
  // Route definitions
  routes: {
    login: { view: LoginView, auth: false },
    register: { view: RegisterView, auth: false },
    'forgot-password': { view: ForgotPasswordView, auth: false },
    dashboard: { view: DashboardView, auth: true },
    subscription: { view: SubscriptionView, auth: true },
    profile: { view: ProfileView, auth: true },
  },

  currentRoute: null,

  /**
   * Initialize the app
   */
  async init() {
    // Handle hash changes
    window.addEventListener('hashchange', () => this.handleRoute());
    
    // Handle initial route
    await this.handleRoute();
  },

  /**
   * Get the current route name from hash
   */
  getRouteName() {
    const hash = window.location.hash.replace('#', '');
    // Remove query params
    const routeName = hash.split('?')[0] || 'login';
    return routeName;
  },

  /**
   * Handle route navigation
   */
  async handleRoute() {
    const routeName = this.getRouteName();
    const route = this.routes[routeName];

    // Fallback to login for unknown routes
    if (!route) {
      window.location.hash = '#login';
      return;
    }

    // Auth guard
    if (route.auth && !Auth.isAuthenticated()) {
      // Store intended destination
      sessionStorage.setItem('jellin_returnTo', routeName);
      window.location.hash = '#login';
      return;
    }

    // If already authenticated and trying to access auth pages, redirect to dashboard
    if (!route.auth && Auth.isAuthenticated()) {
      // Allow forgot-password even when logged in (edge case: user wants to reset)
      if (routeName !== 'forgot-password') {
        window.location.hash = '#dashboard';
        return;
      }
    }

    this.currentRoute = routeName;

    // Get app root element
    const appRoot = document.getElementById('app-root');
    if (!appRoot) return;

    // Show loading
    appRoot.innerHTML = '<div style="text-align:center; padding:4rem 1rem;"><span class="spinner spinner-dark" style="width:2.5rem; height:2.5rem;"></span></div>';

    // Render view
    try {
      const html = await route.view.render();
      appRoot.innerHTML = html;

      // Trigger page transition
      const pages = appRoot.querySelectorAll('.page');
      pages.forEach(p => {
        requestAnimationFrame(() => p.classList.add('active'));
      });

      // Add active class to auth-card for transition
      const authCard = appRoot.querySelector('.auth-card');
      if (authCard) {
        authCard.classList.add('page');
        requestAnimationFrame(() => authCard.classList.add('active'));
      }

      // Initialize view
      if (typeof route.view.init === 'function') {
        await route.view.init();
      }
    } catch (error) {
      console.error('Route error:', error);
      appRoot.innerHTML = `
        <div class="app-container">
          <div class="auth-card" style="text-align:center;">
            <h1 style="color:#dc2626; margin-bottom:1rem;">Something went wrong</h1>
            <p style="color:#64748b; margin-bottom:1.5rem;">${error.message || 'An unexpected error occurred.'}</p>
            <a href="#dashboard" class="btn-primary" style="display:inline-block; text-decoration:none;">Go to Dashboard</a>
          </div>
        </div>
      `;
    }
  },

  /**
   * Navigate to a route
   */
  navigate(routeName) {
    window.location.hash = `#${routeName}`;
  },
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());