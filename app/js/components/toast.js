/**
 * Jellin Toast Notification Component
 * Displays temporary success/error/info messages.
 */
const Toast = {
  /**
   * Show a toast notification
   * @param {string} message - The message to display
   * @param {'success'|'error'|'info'} type - Toast type
   * @param {number} duration - Display duration in ms (default 4000)
   */
  show(message, type = 'info', duration = 4000) {
    // Remove any existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);

    // Auto remove after duration
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, duration);
  },

  success(message, duration) {
    this.show(message, 'success', duration);
  },

  error(message, duration) {
    this.show(message, 'error', duration);
  },

  info(message, duration) {
    this.show(message, 'info', duration);
  },
};