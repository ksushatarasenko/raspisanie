// scripts/app.js
import { renderSchedule } from './renderSchedule.js';
import { getWeekStart } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // текущий понедельник
    const today = new Date();
    let currentWeekStart = getWeekStart(today);
    window.currentWeekStart = currentWeekStart;

    const prevBtn = document.getElementById('prevWeek');
    const nextBtn = document.getElementById('nextWeek');
    const weekLabel = document.getElementById('weekLabel');

    // render initial
    renderSchedule(currentWeekStart);

    prevBtn?.addEventListener('click', () => {
        const d = new Date(currentWeekStart);
        d.setDate(d.getDate() - 7);
        currentWeekStart = getWeekStart(d);
        window.currentWeekStart = currentWeekStart;
        renderSchedule(currentWeekStart);
    });

    nextBtn?.addEventListener('click', () => {
        const d = new Date(currentWeekStart);
        d.setDate(d.getDate() + 7);
        currentWeekStart = getWeekStart(d);
        window.currentWeekStart = currentWeekStart;
        renderSchedule(currentWeekStart);
    });
});
