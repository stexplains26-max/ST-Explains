document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('#mobile-menu');
  const menuLinks = document.querySelector('#primary-navigation'); // use id now

  if (!menuBtn || !menuLinks) return;

  menuBtn.addEventListener('click', function () {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    this.classList.toggle('is-active');  // for animated bars if you add CSS
    menuLinks.classList.toggle('active'); // show/hide mobile menu (your existing CSS expects .active)
  });

  // optional: close menu when a link clicked
  menuLinks.addEventListener('click', (e) => {
    if (e.target.classList.contains('navbar__links')) {
      menuLinks.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.classList.remove('is-active');
    }
  });
});
