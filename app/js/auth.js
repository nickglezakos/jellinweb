/**
 * Jellin Auth Module
 * Manages JWT token storage and session state.
 */
const Auth = (() => {
  const TOKEN_KEY = 'jellin_token';
  const REFRESH_TOKEN_KEY = 'jellin_refreshToken';
  const USER_KEY = 'jellin_user';

  /**
   * Store tokens after successful login
   */
  function setSession(token, refreshToken, userData = null) {
    localStorage.setItem(TOKEN_KEY, token);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    if (userData) {
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    }
  }

  /**
   * Check if user is authenticated (has a token)
   */
  function isAuthenticated() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;

    // Optional: Check token expiry (basic check, parse JWT payload)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      // Token expired? (Allow 30 second buffer)
      if (payload.exp && payload.exp < now - 30) {
        // Token expired but we have a refresh token - let the API layer handle refresh
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        return !!refreshToken; // Still "authenticated" if we can refresh
      }
      return true;
    } catch {
      // Can't parse token, assume valid
      return !!token;
    }
  }

  /**
   * Get the stored user info
   */
  function getUser() {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  /**
   * Store user info
   */
  function setUser(userData) {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  }

  /**
   * Clear all auth data (logout)
   */
  function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  /**
   * Logout - call API then clear local storage
   */
  async function logout() {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (refreshToken) {
        await API.Account.logout(refreshToken).catch(() => {});
      }
    } catch {
      // Ignore logout API errors
    }
    clearSession();
  }

  /**
   * Get JWT token
   */
  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Get refresh token
   */
  function getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  /**
   * Decode JWT payload (for debugging / display)
   */
  function decodeToken() {
    const token = getToken();
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  return {
    setSession,
    isAuthenticated,
    getUser,
    setUser,
    clearSession,
    logout,
    getToken,
    getRefreshToken,
    decodeToken,
  };
})();