document.addEventListener('DOMContentLoaded', () => {
  redirectIfAuthenticated();

  const params = new URLSearchParams(window.location.search);
  const alertBox = document.getElementById('loginAlert');
  if (params.get('redirected') === '1') {
    UI.showAlert(alertBox, 'Please log in to continue.', 'warning');
  }

  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const rememberInput = document.getElementById('rememberMe');
  const submitBtn = document.getElementById('loginBtn');

  initPasswordToggle(document.getElementById('togglePassword'), passwordInput);

  emailInput.addEventListener('input', () => validateEmail(false));
  passwordInput.addEventListener('input', () => validatePassword(false));

  function validateEmail(showRequired = true) {
    const errorEl = document.getElementById('emailError');
    const value = emailInput.value.trim();
    if (!value && !showRequired) return true;
    if (!Validate.email(value)) {
      UI.setFieldError(emailInput, errorEl, 'Enter a valid email address.');
      return false;
    }
    UI.setFieldError(emailInput, errorEl, '');
    return true;
  }

  function validatePassword(showRequired = true) {
    const errorEl = document.getElementById('passwordError');
    const value = passwordInput.value;
    if (!value && !showRequired) return true;
    if (!value) {
      UI.setFieldError(passwordInput, errorEl, 'Password is required.');
      return false;
    }
    UI.setFieldError(passwordInput, errorEl, '');
    return true;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    UI.hideAlert(alertBox);

    const validEmail = validateEmail(true);
    const validPassword = validatePassword(true);
    if (!validEmail || !validPassword) {
      UI.showAlert(alertBox, 'Please fix the errors below.', 'error');
      return;
    }

    const payload = {
      email: emailInput.value.trim(),
      password: passwordInput.value,
      rememberMe: rememberInput.checked,
    };

    UI.setLoading(submitBtn, true, 'Signing in...');

    try {
      const { token, user } = await AuthAPI.login(payload);
      Storage.setToken(token, rememberInput.checked);
      Storage.setUser(user);
      window.location.href = 'dashboard.html';
    } catch (err) {
      UI.showAlert(alertBox, err.message || 'Login failed. Please try again.', 'error');
      UI.setLoading(submitBtn, false);
    }
  });

  // "Forgot password" is UI-only — no reset backend is implemented in this
  // build. Clicking it explains that clearly instead of pretending to work.
  const forgotLink = document.getElementById('forgotPasswordLink');
  if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      UI.showToast('Password reset isn\u2019t implemented in this demo yet.');
    });
  }
});
