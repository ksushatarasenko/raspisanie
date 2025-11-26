

// =============================
//   renderSchedule.js (готовый)
// =============================

// Клиент Supabase
import { supabase } from './supabaseClient.js';

// Работа с расписанием
import { loadSchedule, saveLesson } from './scheduleData.js';

// Утилиты
import {
  weekDays,
  lessonTimes,
  getWeekDates,
  formatDate,
  formatDateReadable,
  addDays
} from './utils.js';

// Глобальные переменные
let modal = null;               // DOM модалка
let modalLesson = null;         // объект урока для редактирования
let currentWeekStart = null;    // строка YYYY-MM-DD
let currentSchedule = null;     // объект schedules.data


/* ───────────────────────────────────────────
   Создание модалки редактирования уроков
────────────────────────────────────────── */
function createModal() {
  if (modal) return;

  modal = document.createElement('div');
  modal.className = 'rs-modal hidden';
  modal.innerHTML = `
    <div class="modal-bg"></div>
    <div class="modal-box">
      <h3>Edytuj lekcję</h3>

      <label>Przedmiot:</label>
      <input id="modal-subject" type="text"/>

      <label>Sala:</label>
      <input id="modal-room" type="text"/>

      <label>Domowe zadanie:</label>
      <textarea id="modal-homework"></textarea>

      <div class="modal-buttons">
        <button id="modal-save">💾 Zapisz</button>
        <button id="modal-cancel">❌ Anuluj</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Закрытие модалки
  modal.querySelector('.modal-bg').onclick = closeModal;
  modal.querySelector('#modal-cancel').onclick = closeModal;
  modal.querySelector('#modal-save').onclick = saveModal;
}

/* ───────────────────────────────────────────
   Открыть модалку
────────────────────────────────────────── */
function openModal(info) {
  if (!modal) createModal();

  modalLesson = info;

  const lesson = info.ref || {};
  document.getElementById('modal-subject').value = lesson.subject || '';
  document.getElementById('modal-room').value = lesson.room || '';
  document.getElementById('modal-homework').value = lesson.homework || '';

  modal.classList.remove('hidden');
}

/* ───────────────────────────────────────────
   Закрыть модалку
────────────────────────────────────────── */
function closeModal() {
  modal.classList.add('hidden');
  modalLesson = null;
}

/* ───────────────────────────────────────────
   Сохранить урок (редактирование)
────────────────────────────────────────── */
async function saveModal() {
  if (!modalLesson) return;

  const { day, index } = modalLesson;
  const entry = modalLesson.ref;

  entry.subject = document.getElementById('modal-subject').value.trim();
  entry.room = document.getElementById('modal-room').value.trim();
  entry.homework = document.getElementById('modal-homework').value.trim();

  // Обновляем в локальном объекте
  currentSchedule[day][index] = entry;

  // Сохраняем на сервере
  await saveLesson(currentWeekStart, currentSchedule);

  closeModal();
  renderSchedule(currentWeekStart);
}

/* ───────────────────────────────────────────
   Главная функция — отрисовка расписания
────────────────────────────────────────── */
export async function renderSchedule(weekStart) {
  currentWeekStart = weekStart;

  if (!modal) createModal();

  // Показываем диапазон недели (Пн — Пт)
  const label = document.getElementById('weekLabel');
  if (label) {
    const weekDates = getWeekDates(weekStart); // массив из 5 дат (Mon..Fri)

    const monday = formatDateReadable(weekDates[0]);
    const friday = formatDateReadable(weekDates[4]);

    label.textContent = `${monday} — ${friday}`;
  }


  // Загружаем расписание
  const scheduleRow = await loadSchedule(weekStart);
  currentSchedule = scheduleRow?.data || {};

  const container = document.getElementById('daysContainer');
  container.innerHTML = '';

  // Даты Mon–Fri (5 дней)
  const weekDates = getWeekDates(weekStart);

  // Дата понедельника и воскресенья для диапазона задач
  const mondayStr = formatDate(weekDates[0]);
  const sundayStr = addDays(mondayStr, 6);

  // Загружаем задачи
  const { data: allTasks } = await supabase
    .from('tasks')
    .select('*')
    .gte('task_date', mondayStr)
    .lte('task_date', sundayStr);

  // Группируем задачи по дню
  const tasksByDay = {};
  for (const t of allTasks || []) {
    const date = new Date(t.task_date).toISOString().split('T')[0];
    const dayName = weekDays[weekDates.findIndex(d => formatDate(d) === date)];

    if (!tasksByDay[dayName]) tasksByDay[dayName] = [];
    tasksByDay[dayName].push(t);
  }

  /* ───────────────────────────────────────────
     Рисуем карточки дней
  ─────────────────────────────────────────── */
  weekDays.forEach((day, dayIndex) => {
    const card = document.createElement('div');
    card.className = 'day-card';

    const dateObj = weekDates[dayIndex];

    // Заголовок дня
    card.innerHTML = `
      <h3>
        ${day}
        <div class="day-date">${formatDateReadable(dateObj)}</div>
      </h3>
    `;

    /* ───────────────
       Таблица уроков
    ─────────────── */
    const lessons = currentSchedule[day] || [];
    currentSchedule[day] = lessons;

    const table = document.createElement('table');
    table.className = 'lesson-table';

    table.innerHTML = `
      <tr>
        <th>#</th><th>Godzina</th><th>Przedmiot</th><th>Sala</th><th>Domowe zadanie</th><th>Edytuj</th>
      </tr>
    `;

    lessonTimes.forEach((time, i) => {
      if (!lessons[i]) lessons[i] = {};

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${i + 1}</td>
        <td>${time}</td>
        <td>${lessons[i].subject || '—'}</td>
        <td>${lessons[i].room || '—'}</td>
        <td>${lessons[i].homework || '—'}</td>
        <td><button class="edit-btn">✎</button></td>
      `;

      row.querySelector('.edit-btn').onclick = () => {
        openModal({
          day,
          index: i,
          ref: lessons[i],
          scheduleId: scheduleRow?.id || null
        });
      };

      table.appendChild(row);
    });

    card.appendChild(table);

    /* ───────────────
       ЗАДАЧИ ДНЯ
    ─────────────── */
    const taskBox = document.createElement('div');
    taskBox.className = 'day-tasks';

    const dayTasks = tasksByDay[day] || [];

    dayTasks.forEach(t => {
      const item = document.createElement('div');
      item.className = 'task-item';

      // чекбокс выполнено
      const check = document.createElement('input');
      check.type = 'checkbox';
      check.checked = !!t.completed;

      check.onchange = async () => {
        await supabase.from('tasks').update({ completed: check.checked }).eq('id', t.id);
      };

      // текст задачи
      const txt = document.createElement('span');
      txt.textContent = `${t.time ? '[' + t.time + '] ' : ''}${t.title}`;

      // удалить ❌
      const del = document.createElement('button');
      del.textContent = '❌';
      del.className = 'task-del';

      del.onclick = async () => {
        if (!confirm('Удалить задачу?')) return;
        await supabase.from('tasks').delete().eq('id', t.id);
        renderSchedule(currentWeekStart);
      };

      item.appendChild(check);
      item.appendChild(txt);
      item.appendChild(del);

      taskBox.appendChild(item);
    });

    /* ───────────────
       КНОПКА ДОБАВИТЬ ЗАДАЧУ
    ─────────────── */
    const addBtn = document.createElement('button');
    addBtn.className = 'task-add-btn';
    addBtn.textContent = '➕ Dodaj zadanie';

    addBtn.onclick = async () => {
      const title = prompt('Tytuł zadania:');
      if (!title) return;

      const description = prompt('Opis:') || '';
      const time = prompt('Godzina (HH:MM)') || '';

      const taskDateStr = formatDate(dateObj);

      await supabase.from('tasks').insert([
        {
          title,
          description,
          time,
          completed: false,
          task_date: taskDateStr,
          week_start: currentWeekStart,
          day
        }
      ]);

      renderSchedule(currentWeekStart);
    };

    card.appendChild(taskBox);
    card.appendChild(addBtn);

    container.appendChild(card);
  });
}
