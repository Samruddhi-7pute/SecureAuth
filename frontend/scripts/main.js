/**
 * Runs on every page: syncs navbar links to auth state, wires up logout
 * buttons, and exposes guard functions used by protected pages.
 */

async function refreshAuthState() {
  const token = Storage.getToken();
  if (!token) return null;

  try {
    const { user } = await AuthAPI.me();
    Storage.setUser(user);
    return user;
  } catch (err) {
    Storage.clear();
    return null;
  }
}

function updateNavbar(user) {
  document.querySelectorAll('[data-guest-link]').forEach((el) => {
    el.style.display = user ? 'none' : '';
  });
  document.querySelectorAll('[data-auth-link]').forEach((el) => {
    el.style.display = user ? '' : 'none';
  });
  if (user) {
    document.querySelectorAll('[data-user-name]').forEach((el) => {
      el.textContent = user.name.split(' ')[0];
    });
  }
}

async function handleLogoutClick(e) {
  e.preventDefault();
  const btn = e.currentTarget;
  UI.setLoading(btn, true, 'Logging out...');

  try {
    await AuthAPI.logout();
  } catch (err) {
    console.warn('Logout request failed:', err.message);
  } finally {
    Storage.clear();
    window.location.href = 'login.html';
  }
}

function wireLogoutButtons() {
  document.querySelectorAll('[data-logout-btn]').forEach((btn) => {
    btn.addEventListener('click', handleLogoutClick);
  });
}

/**
 * Call at the top of protected pages (Dashboard, Profile). Redirects to
 * login.html if there is no valid session.
 */
async function guardProtectedPage() {
  const loader = document.getElementById('pageLoader');
  const user = await refreshAuthState();

  if (!user) {
    window.location.href = 'login.html?redirected=1';
    return null;
  }

  if (loader) loader.classList.add('hidden');
  updateNavbar(user);
  return user;
}

/**
 * Call on public-only pages (Login, Sign Up) to redirect an already
 * authenticated user straight to the Dashboard.
 */
async function redirectIfAuthenticated() {
  const token = Storage.getToken();
  if (!token) return;

  const user = await refreshAuthState();
  if (user) window.location.href = 'dashboard.html';
}

document.addEventListener('DOMContentLoaded', () => {
  wireLogoutButtons();
  const user = Storage.getUser();
  if (user) updateNavbar(user);
});
