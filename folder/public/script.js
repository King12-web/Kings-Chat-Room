
document.addEventListener('DOMContentLoaded', function () {
  var btn = document.getElementById('hamburgerBtn');
  var menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', function () {
    var isOpen = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
    btn.classList.toggle('open', isOpen);
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.classList.remove('open');
    });
  });
});