// scripts/scheduleData.js
// работа с таблицей schedules
import { supabase } from './supabaseClient.js';

// Загружаем строку schedules по weekStart (в таблице у тебя week_start как text)
export async function loadSchedule(weekStart) {
    console.log("loadSchedule called with weekStart:", weekStart);

    const normalized = String(weekStart).trim(); // твой weekStart уже "YYYY-MM-DD"
    console.log("Normalized weekStart:", normalized);

    const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('week_start', normalized);

    if (error) {
        console.error("Supabase error on loadSchedule:", error);
        return null;
    }

    if (!data || data.length === 0) {
        console.log("No schedule row found for", normalized);
        return null;
    }

    console.log("Found schedule row:", data[0]);
    return data[0]; // возвращаем полную строку { id, week_start, data, ... }
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
