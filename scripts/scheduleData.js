// scripts/scheduleData.js
;

// Загружаем строку schedules по weekStart (в таблице у тебя week_start как text)
import { supabase } from './supabaseClient.js';
import { TEMPLATE_WEEK } from './templateWeek.js';

// Загружаем расписание
export async function loadSchedule(weekStart) {
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('week_start', weekStart)
    .maybeSingle();

  // ❗ Если ошибка или пусто → создаём новую неделю по шаблону
  if (!data) {
    console.warn("Неделя пустая — создаём по шаблону:", weekStart);

    const copy = JSON.parse(JSON.stringify(TEMPLATE_WEEK));

    const { data: inserted, error: insertError } = await supabase
      .from('schedules')
      .insert([{ week_start: weekStart, data: copy }])
      .select()
      .single();

    if (insertError) {
      console.error("Ошибка создания новой недели:", insertError);
      return null;
    }

    return inserted; // вернём созданную
  }

  return data;
}


// Сохраняем/обновляем расписание — ВАЖНО: onConflict: 'week_start' чтобы обновлять существующую строку
export async function saveLesson(weekStart, updatedData) {
    console.log("saveLesson() called with:", weekStart);

    const normalized = String(weekStart).trim();

    const { data, error } = await supabase
        .from('schedules')
        .upsert(
            {
                week_start: normalized,
                data: updatedData
            },
            {
                onConflict: 'week_start' // <- ключ к обновлению вместо вставки
            }
        );

    if (error) {
        console.error("Error saving schedule:", error);
        return null;
    }

    console.log("Schedule saved:", data);
    return data;
}
