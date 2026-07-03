document.addEventListener('DOMContentLoaded', async () => {
  const user = await guardProtectedPage();
  if (!user) return;

  document.getElementById('avatarInitials').textContent = UI.getInitials(user.name);
  document.getElementById('profileName').value = user.name;
  document.getElementById('profileEmail').value = user.email;

  const form = document.getElementById('profileForm');
  const alertBox = document.getElementById('profileAlert');
  const saveBtn = document.getElementById('saveProfileBtn');

  const nameInput = document.getElementById('profileName');
  const emailInput = document.getElementById('profileEmail');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    UI.hideAlert(alertBox);

    let valid = true;
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!Validate.name(name)) {
      UI.setFieldError(nameInput, document.getElementById('profileNameError'), 'Name must be between 2 and 50 characters.');
      valid = false;
    } else {
      UI.setFieldError(nameInput, document.getElementById('profileNameError'), '');
    }

    if (!Validate.email(email)) {
      UI.setFieldError(emailInput, document.getElementById('profileEmailError'), 'Enter a valid email address.');
      valid = false;
    } else {
      UI.setFieldError(emailInput, document.getElementById('profileEmailError'), '');
    }

    if (!valid) return;

    UI.setLoading(saveBtn, true, 'Saving...');
    try {
      const { user: updated } = await UserAPI.updateProfile({ name, email });
      Storage.setUser(updated);
      updateNavbar(updated);
      document.getElementById('avatarInitials').textContent = UI.getInitials(updated.name);
      UI.showAlert(alertBox, 'Profile updated successfully.', 'success');
    } catch (err) {
      UI.showAlert(alertBox, err.message || 'Failed to update profile.', 'error');
    } finally {
      UI.setLoading(saveBtn, false);
    }
  });
});
