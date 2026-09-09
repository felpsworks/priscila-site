// Estado do agendamento
const booking = {
  service: null,
  duration: null,
  price: null,
  date: null,
  time: null,
};

const steps = document.querySelectorAll('.wizard-step');
const panels = document.querySelectorAll('.wizard-panel');
const backBtn = document.getElementById('wizardBack');
const nextBtn = document.getElementById('wizardNext');
let currentStep = 1;

// ----- Categorias (accordion) -----
document.querySelectorAll('.category-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const body = toggle.nextElementSibling;
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    body.hidden = isOpen;
  });
});

// ----- Seleção de serviço -----
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.service-card').forEach(c => c.classList.remove('is-selected'));
    card.classList.add('is-selected');
    booking.service = card.dataset.service;
    booking.duration = card.dataset.duration;
    booking.price = card.dataset.price;
    updateNextState();
  });
});

// ----- Data (próximos 14 dias) -----
const dateStrip = document.getElementById('dateStrip');
const timeGroups = document.getElementById('timeGroups');
const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function buildDateStrip() {
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'date-pill';
    btn.dataset.iso = d.toISOString().slice(0, 10);
    btn.innerHTML = `<small>${diasSemana[d.getDay()]}</small><strong>${d.getDate()}</strong>`;
    btn.addEventListener('click', () => selectDate(d, btn));
    dateStrip.appendChild(btn);
  }
}

function selectDate(d, btn) {
  document.querySelectorAll('.date-pill').forEach(p => p.classList.remove('is-selected'));
  btn.classList.add('is-selected');
  booking.date = `${diasSemana[d.getDay()]}, ${d.getDate()} de ${meses[d.getMonth()]}`;
  booking.time = null;
  buildTimeSlots(d);
  updateNextState();
}

const horariosManha = ['09:00', '09:45', '10:30', '11:15'];
const horariosTarde = ['13:00', '13:45', '14:30', '15:15', '16:00', '16:45', '17:30'];

function buildTimeSlots(d) {
  timeGroups.innerHTML = '';
  // "indisponibiliza" alguns horários de forma determinística, só para dar realismo à prévia
  const seed = d.getDate();
  [['Manhã', horariosManha], ['Tarde', horariosTarde]].forEach(([label, horarios]) => {
    const group = document.createElement('div');
    group.className = 'time-group';
    const title = document.createElement('p');
    title.className = 'time-group-label';
    title.textContent = label;
    group.appendChild(title);
    const grid = document.createElement('div');
    grid.className = 'time-grid';
    horarios.forEach((h, i) => {
      const slot = document.createElement('button');
      slot.type = 'button';
      slot.className = 'time-slot';
      slot.textContent = h;
      if ((seed + i) % 5 === 0) {
        slot.disabled = true;
        slot.classList.add('is-unavailable');
      } else {
        slot.addEventListener('click', () => {
          document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('is-selected'));
          slot.classList.add('is-selected');
          booking.time = h;
          updateNextState();
        });
      }
      grid.appendChild(slot);
    });
    group.appendChild(grid);
    timeGroups.appendChild(group);
  });
}

buildDateStrip();

// ----- Navegação do wizard -----
function updateNextState() {
  let ok = false;
  if (currentStep === 1) ok = !!booking.service;
  if (currentStep === 2) ok = !!booking.date && !!booking.time;
  if (currentStep === 3) ok = true;
  nextBtn.disabled = !ok;
}

function goToStep(n) {
  currentStep = n;
  steps.forEach(s => s.classList.toggle('is-active', Number(s.dataset.step) === n));
  panels.forEach(p => p.hidden = Number(p.dataset.panel) !== n);
  backBtn.hidden = n === 1;
  nextBtn.textContent = n === 3 ? 'Concluído' : 'Próximo';
  nextBtn.hidden = n === 3;

  if (n === 2) {
    document.getElementById('recapService').textContent =
      `${booking.service} · ${booking.duration} · ${booking.price}`;
  }
  if (n === 3) {
    renderSummary();
  }
  window.scrollTo({ top: document.querySelector('.booking-wizard').offsetTop - 90, behavior: 'smooth' });
}

nextBtn.addEventListener('click', () => {
  if (nextBtn.disabled) return;
  if (currentStep < 3) goToStep(currentStep + 1);
});

backBtn.addEventListener('click', () => {
  if (currentStep > 1) goToStep(currentStep - 1);
});

function renderSummary() {
  const summary = document.getElementById('bookingSummary');
  summary.innerHTML = `
    <div><span>Serviço</span><strong>${booking.service}</strong></div>
    <div><span>Duração</span><strong>${booking.duration}</strong></div>
    <div><span>Valor</span><strong>${booking.price}</strong></div>
    <div><span>Data</span><strong>${booking.date}</strong></div>
    <div><span>Horário</span><strong>${booking.time}</strong></div>
  `;
  updateWhatsappLink();
}

function updateWhatsappLink() {
  const name = document.getElementById('clientName').value.trim();
  const greeting = name ? `Olá Priscila, meu nome é ${name}.` : 'Olá Priscila!';
  const msg = `${greeting} Gostaria de agendar: ${booking.service} (${booking.duration}) no dia ${booking.date}, às ${booking.time}. Pode confirmar a disponibilidade?`;
  const link = document.getElementById('confirmWhatsapp');
  link.href = `https://wa.me/5519981163983?text=${encodeURIComponent(msg)}`;
}

document.getElementById('clientName').addEventListener('input', updateWhatsappLink);

updateNextState();
