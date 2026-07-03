/**
 * Shared utilities: token/user storage, validation helpers mirroring the
 * backend rules, and small DOM/UX helpers used across pages.
 */

const Storage = {
  TOKEN_KEY: 'sa_token',
  USER_KEY: 'sa_user',

  setToken(token, persist) {
    if (persist) {
      localStorage.setItem(this.TOKEN_KEY, token);
      sessionStorage.removeItem(this.TOKEN_KEY);
    } else {
      sessionStorage.setItem(this.TOKEN_KEY, token);
      localStorage.removeItem(this.TOKEN_KEY);
    }
  },

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
  },

  setUser(user) {
    const store = localStorage.getItem(this.TOKEN_KEY) ? localStorage : sessionStorage;
    store.setItem(this.USER_KEY, JSON.stringify(user));
  },

  getUser() {
    const raw = localStorage.getItem(this.USER_KEY) || sessionStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  clear() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
  },
};

const Validate = {
  email(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
  },

  name(value) {
    return typeof value === 'string' && value.trim().length >= 2 && value.trim().length <= 50;
  },

  passwordRules(value) {
    const password = String(value || '');
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password),
    };
  },

  isStrongPassword(value) {
    return Object.values(this.passwordRules(value)).every(Boolean);
  },

  strengthScore(value) {
    const rules = this.passwordRules(value);
    let score = Object.values(rules).filter(Boolean).length; // 0-5
    if (value && value.length >= 12) score += 1;
    return Math.min(score, 5);
  },
};

const UI = {
  showAlert(el, message, type = 'error') {
    if (!el) return;
    el.textContent = message;
    el.className = `alert alert-${type} show`;
  },

  hideAlert(el) {
    if (!el) return;
    el.classList.remove('show');
  },

  setFieldError(inputEl, errorEl, message) {
    if (inputEl) inputEl.classList.toggle('input-error', !!message);
    if (errorEl) errorEl.textContent = message || '';
  },

  setLoading(buttonEl, isLoading, loadingText = 'Please wait...') {
    if (!buttonEl) return;
    if (isLoading) {
      buttonEl.dataset.originalText = buttonEl.dataset.originalText || buttonEl.innerHTML;
      buttonEl.innerHTML = `<span class="spinner"></span> ${loadingText}`;
      buttonEl.disabled = true;
    } else {
      buttonEl.innerHTML = buttonEl.dataset.originalText || buttonEl.innerHTML;
      buttonEl.disabled = false;
    }
  },

  getInitials(name) {
    if (!name) return '?';
    return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
  },

  formatDate(dateString) {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2600);
  },
};

/** Wires up a show/hide toggle button next to a password input. */
function initPasswordToggle(toggleBtn, inputEl) {
  if (!toggleBtn || !inputEl) return;
  toggleBtn.addEventListener('click', () => {
    const isPassword = inputEl.type === 'password';
    inputEl.type = isPassword ? 'text' : 'password';
    toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    toggleBtn.innerHTML = isPassword ? eyeOffIcon() : eyeIcon();
  });
}

function eyeIcon() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>`;
}

function eyeOffIcon() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.9 19.9 0 0 1 5.06-5.94M9.9 4.24A10.6 10.6 0 0 1 12 4c7 0 11 8 11 8a19.86 19.86 0 0 1-3.22 4.44M14.12 14.12a3 3 0 1 1-4.24-4.24"/><path d="M1 1l22 22"/></svg>`;
}

/** Wires up the mobile nav hamburger toggle, if present. */
function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => links.classList.toggle('open'));
}

document.addEventListener('DOMContentLoaded', initNavToggle);
