const stripe = {
  course: 'https://buy.stripe.com/test_bJebJ17dXgEAal9dHue3e00',
  monthly: 'https://buy.stripe.com/test_6oU14ngOx9c80Kz8nae3e01',
  pass: 'https://buy.stripe.com/test_00w7sL55PagcfFtgTGe3e02',
};

const courses = [
  {title: 'Tu primer deploy', category: 'CLOUD', description: 'Publica una página y verifica que cargue correctamente.', available: true},
  {title: 'Diseña tu primera API', category: 'SOFTWARE', description: 'Define un endpoint, su respuesta y sus casos de error.'},
  {title: 'Automatiza un proceso con IA', category: 'IA APLICADA', description: 'Convierte una tarea repetitiva en un flujo medible.'},
];

const rail = document.querySelector('#course-rail');
const template = document.querySelector('#course-card');
for (const course of courses) {
  const card = template.content.cloneNode(true);
  card.querySelector('.course-category').textContent = course.category;
  card.querySelector('.card-meta').textContent = course.available ? '1 hora · Acceso por 12 meses' : '1 hora · En preparación';
  card.querySelector('h3').textContent = course.title;
  card.querySelector('.card-description').textContent = course.description;
  card.querySelector('.card-price').textContent = course.available ? 'US$10' : 'US$10 · Precio previsto';
  if (course.available) {
    const buy = document.createElement('a');
    buy.href = stripe.course;
    buy.className = 'action';
    buy.textContent = 'Probar compra en Stripe';
    card.querySelector('.card-actions').append(buy);
  }
  rail.append(card);
}

const carouselButtons = [...document.querySelectorAll('[data-scroll]')];
function updateCarousel() {
  carouselButtons[0].disabled = rail.scrollLeft < 2;
  carouselButtons[1].disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
}
for (const button of carouselButtons) {
  button.addEventListener('click', () => {
    const step = rail.firstElementChild.getBoundingClientRect().width + 12;
    rail.scrollBy({
      left: step * Number(button.dataset.scroll),
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  });
}
rail.addEventListener('scroll', updateCarousel, {passive: true});
new ResizeObserver(updateCarousel).observe(rail);
updateCarousel();

const plans = [
  ['Suscripción mensual', 'US$25 al mes · Cancela cuando quieras', stripe.monthly],
  ['Pase de un mes', 'US$50 · Pago único, sin renovación', stripe.pass],
];
for (const [title, description, url] of plans) {
  const card = document.createElement('article');
  const heading = document.createElement('h3');
  heading.textContent = title;
  const copy = document.createElement('p');
  copy.textContent = description;
  const button = document.createElement('a');
  button.href = url;
  button.className = 'action secondary';
  button.textContent = 'Probar en Stripe';
  card.append(heading, copy, button);
  document.querySelector('#plan-grid').append(card);
}

const video = document.querySelector('#preview-player');
const play = document.querySelector('.video-play');
const videoStatus = document.querySelector('#lesson-status');
function showVideoStatus(message) {
  videoStatus.textContent = message;
  videoStatus.hidden = false;
}

play.addEventListener('click', async () => {
  try {
    await video.play();
    video.controls = true;
    play.hidden = true;
    video.focus({preventScroll: true});
  } catch {
    showVideoStatus('El video no se pudo reproducir. Puedes leer la clase debajo.');
  }
});
video.querySelector('source').addEventListener('error', () => {
  showVideoStatus('El video no se pudo cargar. Puedes leer la clase debajo.');
});

const checklist = document.querySelector('#descargas');
const items = [...checklist.querySelectorAll('input[type="checkbox"]')];
const storageKey = 'rtd-deploy-checklist-v1';
const checklistStatus = document.querySelector('#checklist-status');
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (Array.isArray(saved)) {
    for (const item of items) item.checked = saved.includes(item.value);
  }
} catch {}

function updateChecklist() {
  const completed = items.filter(item => item.checked).length;
  document.querySelector('#checklist-count').textContent = completed + ' de ' + items.length;
  document.querySelector('#checklist-progress').value = completed;
}
checklist.addEventListener('change', () => {
  updateChecklist();
  try {
    localStorage.setItem(storageKey, JSON.stringify(items.filter(item => item.checked).map(item => item.value)));
  } catch {
    checklistStatus.textContent = 'El progreso está disponible hasta que cierres esta página.';
  }
});
if (location.hash === '#descargas') checklist.open = true;
window.addEventListener('hashchange', () => {
  if (location.hash === '#descargas') checklist.open = true;
});
updateChecklist();
