// Mobile nav toggle
const header = document.querySelector('.site-header');
const navToggle = document.getElementById('navToggle');

if (header && navToggle) {
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
}

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

// Contador animado da faixa de números
const statEls = document.querySelectorAll('.stats-band-inner strong');

function animateCount(el) {
  const match = el.textContent.trim().match(/^(\D*)(\d+)(\D*)$/);
  if (!match) return;
  const [, prefix, digits, suffix] = match;
  const target = parseInt(digits, 10);
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statsBand = document.querySelector('.stats-band');
if (statsBand && statEls.length) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statEls.forEach(animateCount);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  statsObserver.observe(statsBand);
}

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

// Certificado — tilt 3D bem leve ao mover o mouse
const tilt = document.getElementById('certificadoTilt');
if (tilt) {
  const tiltImg = tilt.querySelector('img');
  const maxTilt = 6;

  tilt.addEventListener('mousemove', (e) => {
    const rect = tilt.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * maxTilt * 2;
    const rotateX = (0.5 - y) * maxTilt * 2;
    tiltImg.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  tilt.addEventListener('mouseleave', () => {
    tiltImg.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}

// Técnica cards — tap to expand on touch devices (no :hover available)
document.querySelectorAll('.tecnica-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.tecnica-card').forEach(other => {
      if (other !== card) other.classList.remove('is-active');
    });
    card.classList.toggle('is-active');
  });
});
