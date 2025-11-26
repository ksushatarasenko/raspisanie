// scripts/modal.js
import { addTask } from './tasks.js';

const modal = document.getElementById("taskModal");
const closeModalBtn = document.getElementById("closeModal");
const saveTaskBtn = document.getElementById("saveTaskBtn");
const taskTitleInput = document.getElementById("taskTitle");
const taskDescriptionInput = document.getElementById("taskDescription");

function openModal() {
    modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
    taskTitleInput.value = "";
    taskDescriptionInput.value = "";
}

async function saveTask(weekStart, day) {
    const title = taskTitleInput.value.trim();
    const description = taskDescriptionInput.value.trim();
    if (!title) { alert("Podaj tytuł zadania!"); return; }
    // Добавляем задачу в базу
    await addTask(weekStart, day, title, description, "");
    closeModal();
    // renderSchedule перерисует список — вызывай его в месте где открыл модалку
}

document.getElementById("addTaskBtn")?.addEventListener("click", openModal);
closeModalBtn?.addEventListener("click", closeModal);
window.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
saveTaskBtn?.addEventListener("click", () => saveTask(window.currentWeekStartForModal, window.currentDayForModal));

export { openModal, closeModal, saveTask };
