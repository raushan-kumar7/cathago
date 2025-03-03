// Sidebar toggle functionality
document.addEventListener('DOMContentLoaded', function() {
  const openSidebarBtn = document.getElementById('open-sidebar');
  const closeSidebarBtn = document.getElementById('close-sidebar');
  const mobileSidebar = document.getElementById('mobile-sidebar');
  const profileMenuBtn = document.getElementById('profile-menu-button');
  const profileDropdown = document.getElementById('profile-dropdown');
  
  // Open mobile sidebar
  if (openSidebarBtn) {
    openSidebarBtn.addEventListener('click', function() {
      mobileSidebar.classList.remove('hidden');
    });
  }
  
  // Close mobile sidebar
  if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener('click', function() {
      mobileSidebar.classList.add('hidden');
    });
  }
  
  // Toggle profile dropdown
  if (profileMenuBtn && profileDropdown) {
    profileMenuBtn.addEventListener('click', function() {
      profileDropdown.classList.toggle('hidden');
    });
    
    // Close dropdown when clicking elsewhere
    document.addEventListener('click', function(event) {
      if (!profileMenuBtn.contains(event.target) && !profileDropdown.contains(event.target)) {
        profileDropdown.classList.add('hidden');
      }
    });
  }
});