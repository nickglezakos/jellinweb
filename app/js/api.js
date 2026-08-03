/**
 * Jellin API Client
 * Handles all HTTP requests to the backend with JWT auth.
 */
const API = (() => {
  // Base URL from Postman environment (Production - GR)
  const BASE_URL = 'https://jellinprd-gr-baffgfaegxhrbqfr.westeurope-01.azurewebsites.net/api';

  /**
   * Get the stored auth token
   */
  function getToken() {
    return localStorage.getItem('jellin_token');
  }

  /**
   * Get the stored refresh token
   */
  function getRefreshToken() {
    return localStorage.getItem('jellin_refreshToken');
  }

  /**
   * Core fetch wrapper with auth headers and error handling
   * @param {string} endpoint - API path (e.g., '/account/login')
   * @param {object} options - Fetch options (method, body, etc.)
   * @param {boolean} anonymous - If true, skip auth header
   * @param {boolean} ignoreExpiration - If true, use IgnoreTokenExpiration scheme
   */
  async function request(endpoint, options = {}, anonymous = false, ignoreExpiration = false) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (!anonymous) {
      const token = getToken();
      if (token) {
        if (ignoreExpiration) {
          headers['Authorization'] = `IgnoreTokenExpiration ${token}`;
        } else {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }
    }

    const config = {
      ...options,
      headers,
    };

    // Remove custom options from fetch config
    delete config.headers;

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...config,
        headers: options.headers ? { ...headers, ...options.headers } : headers,
      });

      // Handle 401 - try token refresh
      if (response.status === 401 && !anonymous && !ignoreExpiration) {
        const refreshed = await refreshToken();
        if (refreshed) {
          // Retry original request with new token
          const newToken = getToken();
          const retryHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${newToken}`,
            ...options.headers,
          };
          const retryResponse = await fetch(`${BASE_URL}${endpoint}`, {
            ...config,
            headers: retryHeaders,
          });
          return handleResponse(retryResponse);
        } else {
          // Refresh failed - force logout
          Auth.logout();
          throw new Error('Session expired. Please login again.');
        }
      }

      return handleResponse(response);
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Network error. Please check your connection.');
      }
      throw error;
    }
  }

  /**
   * Parse response, throw on error
   */
  async function handleResponse(response) {
    // Handle 204 No Content
    if (response.status === 204) {
      return null;
    }

    // Check if response has content
    const contentType = response.headers.get('content-type');
    let data = null;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }
      }
    }

    if (!response.ok) {
      // If the response is a ResultInfo error object
      if (data && data.errors) {
        const messages = Array.isArray(data.errors)
          ? data.errors.map(e => e.message || e).join(', ')
          : JSON.stringify(data.errors);
        throw new Error(messages || `Request failed with status ${response.status}`);
      }
      if (data && typeof data === 'string') {
        throw new Error(data);
      }
      throw new Error(data?.message || data?.title || `Request failed with status ${response.status}`);
    }

    return data;
  }

  /**
   * Refresh the JWT token
   */
  async function refreshToken() {
    const refreshTokenValue = getRefreshToken();
    const token = getToken();
    if (!refreshTokenValue || !token) return false;

    try {
      const response = await fetch(`${BASE_URL}/account/refreshToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `IgnoreTokenExpiration ${token}`,
        },
        body: JSON.stringify({
          refreshToken: refreshTokenValue,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('jellin_token', data.token);
          if (data.refreshToken) {
            localStorage.setItem('jellin_refreshToken', data.refreshToken);
          }
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }

  // ─── Account Endpoints ──────────────────────────────────

  const Account = {
    /**
     * Register a new user/tenant
     */
    register(data) {
      return request('/account/register', {
        method: 'POST',
        body: JSON.stringify({
          tenantName: data.tenantName,
          countryCode: data.countryCode || 'GR',
          vat: data.vat || null,
          email: data.email,
          password: data.password,
          referralCode: data.referralCode || null,
        }),
      }, true);
    },

    /**
     * Login
     */
    login(email, password, tenantId = null) {
      const body = { email, password };
      if (tenantId) body.tenantId = tenantId;
      return request('/account/login', {
        method: 'POST',
        body: JSON.stringify(body),
      }, true);
    },

    /**
     * External login (system-initiated)
     */
    externalLogin(email, password, tenantId, countryCode) {
      return request('/account/externalLogin', {
        method: 'POST',
        body: JSON.stringify({ email, password, tenantId, countryCode }),
      });
    },

    /**
     * Logout - invalidate refresh token
     */
    logout(refreshToken, fcmToken = null) {
      return request('/account/logout', {
        method: 'POST',
        body: JSON.stringify({
          refreshToken: refreshToken || getRefreshToken(),
          fcmToken: fcmToken,
        }),
      });
    },

    /**
     * Confirm email
     */
    confirmEmail(activationKey, email, password) {
      return request('/account/confirmEmail', {
        method: 'POST',
        body: JSON.stringify({ activationKey, email, password }),
      }, true);
    },

    /**
     * Get connection/contact info
     */
    getConnectionInfo() {
      return request('/account/connectionInfo', {
        method: 'GET',
      });
    },

    /**
     * Request password reset
     */
    requestPasswordReset(email) {
      return request('/account/requestPasswordReset', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }, true);
    },

    /**
     * Reset password with OTP
     */
    resetPassword(email, otp) {
      return request('/account/resetPassword', {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      }, true);
    },

    /**
     * Resend confirmation email
     */
    resendConfirmationEmail(email, password, tenantId = null) {
      return request('/account/resendConfirmationEmail', {
        method: 'POST',
        body: JSON.stringify({ email, password, tenantId }),
      }, true);
    },

    /**
     * Update email
     */
    updateEmail(email) {
      return request('/account/updateEmail', {
        method: 'PUT',
        body: JSON.stringify({ email }),
      });
    },

    /**
     * Update password
     */
    updatePassword(currentPassword, updatedPassword) {
      return request('/account/updatePassword', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, updatedPassword }),
      });
    },

    /**
     * Delete account
     */
    deleteAccount() {
      return request('/account', {
        method: 'DELETE',
      });
    },
  };

  // ─── Stripe Endpoints ──────────────────────────────────

  const Stripe = {
    /**
     * Get all active Stripe products with prices
     */
    getProducts() {
      return request('/stripe/products', {
        method: 'GET',
      });
    },

    /**
     * Create checkout session (subscribe)
     * Returns the Stripe hosted checkout URL
     */
    createSubscription(tenantId, externalPriceId) {
      return request('/stripe/subscriptions', {
        method: 'POST',
        body: JSON.stringify({ tenantId, externalPriceId }),
      });
    },

    /**
     * Upgrade subscription to new price
     */
    upgradeSubscription(tenantId, subscriptionExternalId, newExternalPriceId) {
      return request('/stripe/subscriptions', {
        method: 'PUT',
        body: JSON.stringify({ tenantId, subscriptionExternalId, newExternalPriceId }),
      });
    },

    /**
     * Cancel subscription with refund
     */
    cancelSubscription(tenantId, subscriptionExternalId) {
      return request('/stripe/subscriptions', {
        method: 'DELETE',
        body: JSON.stringify({ tenantId, subscriptionExternalId }),
      });
    },
  };

  return {
    Account,
    Stripe,
    getToken,
    getRefreshToken,
  };
})();