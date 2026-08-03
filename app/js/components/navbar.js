/**
 * Jellin Navbar Component
 * Navigation bar shown on authenticated pages.
 */
const Navbar = {
  render(activePage) {
    return `
      <nav class="navbar">
        <div class="navbar-brand">Jellin</div>
        <div class="navbar-links">
          <a href="#dashboard" class="navbar-link ${activePage === 'dashboard' ? 'active' : ''}">Dashboard</a>
          <a href="#subscription" class="navbar-link ${activePage === 'subscription' ? 'active' : ''}">Subscription</a>
          <a href="#profile" class="navbar-link ${activePage === 'profile' ? 'active' : ''}">Profile</a>
          <a href="#" class="navbar-link" id="nav-logout" style="color: #ef4444;">Logout</a>
        </div>
      </nav>
    `;
  },

  init() {
    const logoutBtn = document.getElementById('nav-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await Auth.logout();
        window.location.hash = '#login';
      });
    }

    // Update active state based on current hash
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    const links = document.querySelectorAll('.navbar-link');
    links.forEach(link => {
      if (link.getAttribute('href') === `#${hash}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  },
};