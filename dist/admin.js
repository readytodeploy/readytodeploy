const key = 'rtd-admin-demo-v1';
const initial = {
  courses: [{id: 'sample', title: 'Tu primer deploy', description: 'Publica y verifica una página estática.', price: 10, video: 'assets/primer-deploy.mp4', state: 'Borrador', note: ''}],
  students: [],
  subscriptions: [],
};
function readState() {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && ['courses', 'students', 'subscriptions'].every(name => Array.isArray(saved[name]))) return saved;
  } catch {}
  return initial;
}
const state = readState();
const status = document.querySelector('#admin-status');
const courseForm = document.querySelector('#course-form');
const subscriptionForm = document.querySelector('#subscription-form');
const player = document.querySelector('#admin-player');
const video = player.querySelector('video');
const videoStatus = player.querySelector('[role=status]');

function save(message) {
  try {
    localStorage.setItem(key, JSON.stringify(state));
    status.textContent = message;
  } catch {
    status.textContent = 'El navegador no pudo guardar los cambios. Se perderán al recargar.';
  }
  render();
}
function element(tag, text) {
  const node = document.createElement(tag);
  node.textContent = text;
  return node;
}
function button(label, handler) {
  const node = element('button', label);
  node.type = 'button';
  node.className = 'action secondary';
  node.addEventListener('click', handler);
  return node;
}
function renderList(selector, rows, empty) {
  document.querySelector(selector).replaceChildren(...(rows.length ? rows : [element('li', empty)]));
}
function render() {
  renderList('#content-list', state.courses.map(course => {
    const row = element('li', '');
    row.append(element('span', course.title + ' · US$' + course.price + ' · ' + course.state));
    row.append(button('Editar', () => {
      for (const name of ['id', 'title', 'description', 'price', 'video']) {
        courseForm.elements.namedItem(name).value = name === 'video' && course.video.startsWith('assets/')
          ? new URL(course.video, location.href).href
          : course[name];
      }
      courseForm.elements.namedItem('title').focus();
    }));
    if (course.video) row.append(button('Reproducir', () => {
      document.querySelector('#admin-player-title').textContent = course.title;
      videoStatus.hidden = true;
      video.src = course.video;
      player.showModal();
    }));
    if (['Borrador', 'Devuelto'].includes(course.state)) row.append(button('Enviar a revisión', () => {
      course.state = 'En revisión';
      course.note = '';
      save('Curso enviado a revisión en la demo.');
    }));
    return row;
  }), 'Todavía no hay cursos.');

  renderList('#moderation-list', state.courses.filter(course => course.state !== 'Borrador').map(course => {
    const row = element('li', '');
    row.append(element('span', course.title + ' · ' + course.state + (course.note ? ' · ' + course.note : '')));
    if (course.state === 'En revisión') {
      const reason = document.createElement('input');
      reason.setAttribute('aria-label', 'Observación de revisión para ' + course.title);
      reason.placeholder = 'Observación para devolver';
      reason.maxLength = 160;
      row.append(reason, button('Aprobar', () => {
        course.state = 'Aprobado';
        save('Curso aprobado en la demo.');
      }), button('Devolver', () => {
        if (!reason.value.trim()) {
          status.textContent = 'Escribe una observación para devolver el curso.';
          reason.focus();
          return;
        }
        course.state = 'Devuelto';
        course.note = reason.value.trim();
        save('Curso devuelto con observaciones.');
      }));
    }
    return row;
  }), 'Envía un borrador a revisión para empezar.');

  const studentSelect = subscriptionForm.elements.namedItem('student');
  const selected = studentSelect.value;
  studentSelect.replaceChildren(new Option('Selecciona un estudiante', ''), ...state.students.map(student => new Option(student.alias, student.id)));
  if (state.students.some(student => student.id === selected)) studentSelect.value = selected;
  subscriptionForm.querySelector('button').disabled = !state.students.length;
  renderList('#student-list', state.students.map(student => {
    const row = element('li', student.alias + (student.active ? ' · Activo' : ' · Suspendido'));
    row.append(button(student.active ? 'Suspender' : 'Reactivar', () => {
      student.active = !student.active;
      save('Estado del estudiante de prueba actualizado.');
    }));
    return row;
  }), 'Todavía no hay estudiantes de prueba.');

  renderList('#subscription-list', state.subscriptions.map(subscription => {
    const student = state.students.find(item => item.id === subscription.student);
    const row = element('li', (student?.alias || 'Estudiante') + ' · US$25/mes · ' + subscription.state);
    if (subscription.state === 'Activa') row.append(button('Programar cancelación', () => {
      subscription.state = 'Cancela al final del período';
      save('Cancelación simulada. Stripe no recibió cambios.');
    }));
    return row;
  }), 'Todavía no hay suscripciones simuladas.');
}

courseForm.addEventListener('submit', event => {
  event.preventDefault();
  const fields = Object.fromEntries(new FormData(courseForm));
  const title = fields.title.trim();
  const description = fields.description.trim();
  const url = fields.video.trim();
  if (!title || !description) {
    status.textContent = 'Completa el título y la descripción.';
    return;
  }
  if (url && new URL(url).protocol !== 'https:') {
    const sample = new URL('assets/primer-deploy.mp4', location.href).href;
    if (url !== sample) {
      status.textContent = 'Usa una URL HTTPS para el video.';
      return;
    }
  }
  const course = {id: fields.id || crypto.randomUUID(), title, description, price: Number(fields.price), video: url, state: 'Borrador', note: ''};
  const index = state.courses.findIndex(item => item.id === course.id);
  if (index < 0) state.courses.push(course);
  else state.courses[index] = course;
  courseForm.reset();
  courseForm.elements.namedItem('id').value = '';
  save('Borrador guardado.');
});

document.querySelector('#student-form').addEventListener('submit', event => {
  event.preventDefault();
  const alias = new FormData(event.currentTarget).get('alias').trim();
  if (!alias || alias.includes('@')) {
    status.textContent = 'Usa un alias ficticio sin correo electrónico.';
    return;
  }
  state.students.push({id: crypto.randomUUID(), alias, active: true});
  event.currentTarget.reset();
  save('Estudiante de prueba creado.');
});

subscriptionForm.addEventListener('submit', event => {
  event.preventDefault();
  const student = new FormData(subscriptionForm).get('student');
  if (!state.students.some(item => item.id === student && item.active)) {
    status.textContent = 'Selecciona un estudiante activo.';
    return;
  }
  if (state.subscriptions.some(item => item.student === student)) {
    status.textContent = 'Este estudiante ya tiene una suscripción de prueba.';
    return;
  }
  state.subscriptions.push({student, state: 'Activa'});
  save('Suscripción simulada creada.');
});

video.addEventListener('error', () => { videoStatus.hidden = false; });
player.addEventListener('close', () => {
  video.pause();
  video.removeAttribute('src');
  video.load();
});
render();
