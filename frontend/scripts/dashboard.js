document.addEventListener('DOMContentLoaded', async () => {
  const user = await guardProtectedPage();
  if (!user) return;

  document.getElementById('welcomeName').textContent = user.name.split(' ')[0];
  document.getElementById('summaryName').textContent = user.name;
  document.getElementById('summaryEmail').textContent = user.email;
  document.getElementById('avatarInitials').textContent = UI.getInitials(user.name);

  document.getElementById('infoEmail').textContent = user.email;
  document.getElementById('infoLastLogin').textContent = UI.formatDate(user.lastLogin);
  document.getElementById('infoMemberSince').textContent = UI.formatDate(user.createdAt);
});
