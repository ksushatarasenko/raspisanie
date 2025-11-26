
// scripts/utils.js
/// scripts/utils.js

export const weekDays = ["Poniedziałek","Wtorek","Środa","Czwartek","Piątek"];

export const lessonTimes = [
  "08:00 - 08:45",
  "08:55 - 09:40",
  "09:50 - 10:35",
  "10:50 - 11:35",
  "11:45 - 12:30",
  "12:50 - 13:35",
  "13:50 - 14:35"
];

export function getWeekDates(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);
  const weekDates = [];
  for (let i = 0; i < 5; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + i);
    weekDates.push(dayDate);
  }
  return weekDates;
}

export function formatDate(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function formatDateReadable(date) {
  const d = new Date(date);
  return d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function addDays(dateInput, days) {
  const d = new Date(dateInput);
  d.setDate(d.getDate() + Number(days));
  return d.toISOString().split('T')[0]; // вернёт "YYYY-MM-DD"
}
// ---- новая функция, на которую жаловался импорт ----
export function getWeekStart(date = new Date()) {
  // возвращает строку YYYY-MM-DD для понедельника той недели
  const d = new Date(date);
  const day = d.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);
  return formatDate(monday);
}
