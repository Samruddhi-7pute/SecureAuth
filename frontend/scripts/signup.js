document.addEventListener('DOMContentLoaded', () => {
  redirectIfAuthenticated();

  const form = document.getElementById('signupForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmInput = document.getElementById('confirmPassword');
  const submitBtn = document.getElementById('signupBtn');
  const alertBox = document.getElementById('signupAlert');

  const strengthWrapper = document.getElementById('strengthMeter');
  const strengthBars = strengthWrapper.querySelectorAll('.strength-bars span');
  const strengthLabel = document.getElementById('strengthLabel');

  initPasswordToggle(document.getElementById('togglePassword'), passwordInput);
  initPasswordToggle(document.getElementById('toggleConfirmPassword'), confirmInput);

  nameInput.addEventListener('input', () => validateName(false));
  emailInput.addEventListener('input', () => validateEmail(false));
  passwordInput.addEventListener('input', () => {
    updateStrengthMeter();
    validatePassword(false);
    if (confirmInput.value) validateConfirm(false);
  });
  confirmInput.addEventListener('input', () => validateConfirm(false));

  function validateName(showRequired = true) {
    const errorEl = document.getElementById('nameError');
    const value = nameInput.value.trim();
    if (!value && !showRequired) return true;
    if (!Validate.name(value)) {
      UI.setFieldError(nameInput, errorEl, 'Name must be between 2 and 50 characters.');
      return false;
    }
    UI.setFieldError(nameInput, errorEl, '');
    return true;
  }

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
    if (!Validate.isStrongPassword(value)) {
      UI.setFieldError(
        passwordInput,
        errorEl,
        'Use 8+ characters with uppercase, lowercase, a number, and a symbol.'
      );
      return false;
    }
    UI.setFieldError(passwordInput, errorEl, '');
    return true;
  }

  function validateConfirm(showRequired = true) {
    const errorEl = document.getElementById('confirmPasswordError');
    const value = confirmInput.value;
    if (!value && !showRequired) return true;
    if (value !== passwordInput.value) {
      UI.setFieldError(confirmInput, errorEl, 'Passwords do not match.');
      return false;
    }
    UI.setFieldError(confirmInput, errorEl, '');
    return true;
  }

  function updateStrengthMeter() {
    const value = passwordInput.value;
    const score = Validate.strengthScore(value); // 0-5
    const filled = value ? Math.max(1, Math.ceil((score / 5) * 4)) : 0;

    strengthBars.forEach((bar, idx) => {
      bar.style.background = idx < filled ? '' : 'var(--gray-200)';
    });

    let label = 'Password strength';
    let cssClass = '';
    if (value) {
      if (score <= 2) {
        label = 'Weak';
        cssClass = 'strength-weak';
      } else if (score === 3) {
        label = 'Fair';
        cssClass = 'strength-fair';
      } else if (score === 4) {
        label = 'Good';
        cssClass = 'strength-good';
      } else {
        label = 'Strong';
        cssClass = 'strength-strong';
      }
    }

    strengthWrapper.className = `strength-meter ${cssClass}`;
    strengthLabel.textContent = label;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    UI.hideAlert(alertBox);

    const validName = validateName(true);
    const validEmail = validateEmail(true);
    const validPassword = validatePassword(true);
    const validConfirm = validateConfirm(true);

    if (!validName || !validEmail || !validPassword || !validConfirm) {
      UI.showAlert(alertBox, 'Please fix the errors below.', 'error');
      return;
    }

    const payload = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value,
      confirmPassword: confirmInput.value,
    };

    UI.setLoading(submitBtn, true, 'Creating account...');

    try {
      const { token, user } = await AuthAPI.register(payload);
      Storage.setToken(token, false);
      Storage.setUser(user);
      window.location.href = 'dashboard.html';
    } catch (err) {
      UI.showAlert(alertBox, err.message || 'Registration failed. Please try again.', 'error');
      UI.setLoading(submitBtn, false);
    }
  });
});
