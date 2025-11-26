// scripts/tasks.js
// scripts/tasks.js
import { supabase } from './supabaseClient.js';

// Загрузка задач на неделю (будет возвращать массив)
export async function loadTasks(weekStart) {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('week_start', weekStart);

    if (error) {
      console.error('Error loading tasks:', error);
      return []; // возвращаем массив даже при ошибке
    }
    return data || [];
  } catch (err) {
    console.error('Exception loading tasks:', err);
    return [];
  }
}

/* ----------------------
   ДОБАВИТЬ ЗАДАЧУ
   weekStart → понедельник недели
   taskDate → YYYY-MM-DD конкретная дата задачи
   day → "Poniedziałek" / "Wtorek" / ...
-------------------------*/
export async function addTask(weekStart, taskDate, day, title, description, time) {
  const { data, error } = await supabase
    .from('tasks')
    .insert([{
      week_start: weekStart,     // для фильтра недель
      task_date: taskDate,       // ДОЛЖНО ОБЯЗАТЕЛЬНО быть!
      day: day,                  // дублируем для удобства
      title: title,
      description: description || null,
      time: time || null,
      completed: false           // по умолчанию
    }]);

  if (error) {
    console.error("Error adding task:", error);
  }
  return data;
}

/* ----------------------
   ОБНОВИТЬ ЗАДАЧУ (в т.ч. completed)
-------------------------*/
export async function updateTask(id, fields) {
  const { data, error } = await supabase
    .from('tasks')
    .update(fields)
    .eq('id', id);

  if (error) console.error("Error updating task:", error);
  return data;
}

/* ----------------------
   УДАЛИТЬ ЗАДАЧУ
-------------------------*/
export async function deleteTask(id) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) console.error("Error deleting task:", error);
}