// Mobile nav toggle
const header = document.querySelector('.site-header');
const navToggle = document.getElementById('navToggle');

navToggle.addEventListener('click', () => {
  const isOpen = header.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    header.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Scroll reveal animation
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));
