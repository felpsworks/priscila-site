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

// Before/after comparison sliders
document.querySelectorAll('.ba-frame').forEach(frame => {
  const handle = frame.querySelector('.ba-handle');

  const setPos = (percent) => {
    const clamped = Math.min(100, Math.max(0, percent));
    frame.style.setProperty('--pos', clamped + '%');
    handle.setAttribute('aria-valuenow', Math.round(clamped));
  };

  const posFromX = (clientX) => {
    const rect = frame.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  };

  let dragging = false;

  const onMove = (clientX) => {
    if (!dragging) return;
    setPos(posFromX(clientX));
  };

  frame.addEventListener('pointerdown', (e) => {
    dragging = true;
    frame.setPointerCapture(e.pointerId);
    setPos(posFromX(e.clientX));
  });
  frame.addEventListener('pointermove', (e) => onMove(e.clientX));
  frame.addEventListener('pointerup', () => { dragging = false; });
  frame.addEventListener('pointercancel', () => { dragging = false; });

  handle.addEventListener('keydown', (e) => {
    const current = parseFloat(frame.style.getPropertyValue('--pos')) || 50;
    if (e.key === 'ArrowLeft') { setPos(current - 5); e.preventDefault(); }
    if (e.key === 'ArrowRight') { setPos(current + 5); e.preventDefault(); }
  });
});

// Técnica cards — tap to expand on touch devices (no :hover available)
document.querySelectorAll('.tecnica-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.tecnica-card').forEach(other => {
      if (other !== card) other.classList.remove('is-active');
    });
    card.classList.toggle('is-active');
  });
});
