document.addEventListener('DOMContentLoaded', function () {
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (!darkModeToggle) return;

  const darkModeIcon = darkModeToggle.querySelector('i');

  // Logo swap setup
  const logoImg = document.querySelector('.nav-left .icon') || document.querySelector('.icon');
  const logoOriginalSrc = logoImg ? logoImg.getAttribute('src') : null;
  const logoWhiteSrc = (logoOriginalSrc || '').replace(/[^/]+$/, 'kreative_white_logo.png');

  function applyTheme(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    if (isDark) {
      darkModeIcon.classList.remove('fa-moon');
      darkModeIcon.classList.add('fa-sun');
      darkModeToggle.classList.add('dark');
      if (logoImg && logoOriginalSrc) {
        logoImg.setAttribute('src', logoWhiteSrc);
      }
    } else {
      darkModeIcon.classList.remove('fa-sun');
      darkModeIcon.classList.add('fa-moon');
      darkModeToggle.classList.remove('dark');
      if (logoImg && logoOriginalSrc) {
        logoImg.setAttribute('src', logoOriginalSrc);
      }
    }
  }

  const savedMode = localStorage.getItem('darkMode');
  const isDark = savedMode === 'true' || savedMode === 'enabled';

  if (isDark) {
    applyTheme(true);
    localStorage.setItem('darkMode', 'true');
  }

  darkModeToggle.addEventListener('click', function () {
    const willBeDark = !document.body.classList.contains('dark-mode');
    applyTheme(willBeDark);
    localStorage.setItem('darkMode', willBeDark ? 'true' : 'false');
  });

  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  if (!savedMode && prefersDarkScheme.matches) {
    applyTheme(true);
  }

  prefersDarkScheme.addEventListener('change', function (e) {
    if (localStorage.getItem('darkMode')) return;
    applyTheme(e.matches);
  });
});
