/**
 * Subtle in-page notices (same tone as subscription Stripe unavailable).
 */
const Notice = {
  /**
   * Show a quiet message in an existing notice/error element.
   * @param {HTMLElement|string} elOrId
   * @param {string} message
   * @param {{ goBack?: boolean, fallbackHash?: string }} [options]
   */
  show(elOrId, message, options = {}) {
    const el = typeof elOrId === 'string' ? document.getElementById(elOrId) : elOrId;
    if (!el) return;

    const goBack = options.goBack === true;
    const fallbackHash = options.fallbackHash || '#dashboard';
    const safe = Notice.escape(message || 'Something went wrong. Please try again.');

    el.classList.remove('error-message');
    el.classList.add('notice-message');
    el.style.display = 'block';

    if (goBack) {
      el.innerHTML = `
        <p class="notice-message__text">${safe}</p>
        <button type="button" class="btn-secondary notice-message__back">Go back</button>
      `;
      const btn = el.querySelector('.notice-message__back');
      if (btn) {
        btn.addEventListener('click', () => {
          if (window.history.length > 1) {
            window.history.back();
          } else {
            window.location.hash = fallbackHash;
          }
        });
      }
    } else {
      el.innerHTML = `<p class="notice-message__text">${safe}</p>`;
    }
  },

  /**
   * Hide a notice/error element and clear content.
   */
  hide(elOrId) {
    const el = typeof elOrId === 'string' ? document.getElementById(elOrId) : elOrId;
    if (!el) return;
    el.style.display = 'none';
    el.innerHTML = '';
    el.textContent = '';
  },

  escape(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },
};
