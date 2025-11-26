// lessonModal.js
import { saveSchedule } from "./scheduleData.js";
import { renderSchedule, currentWeekStart } from "./renderSchedule.js";

let modal = document.querySelector("#lessonModal");
let timeInput = document.querySelector("#lessonTime");
let subjectInput = document.querySelector("#lessonSubject");
let teacherInput = document.querySelector("#lessonTeacher");
let modalSaveBtn = document.querySelector("#saveLessonBtn");

let modalState = null;

export function openLessonModal(state) {
    modalState = state;

    const day = state.day;
    const index = state.index;
    const lesson = state.data[day][index];

    timeInput.value = lesson.time || "";
    subjectInput.value = lesson.subject || "";
    teacherInput.value = lesson.teacher || "";

    modal.style.display = "flex";
}

modalSaveBtn.addEventListener("click", async () => {
    const { day, index, data } = modalState;

    data[day][index] = {
        time: timeInput.value,
        subject: subjectInput.value,
        teacher: teacherInput.value
    };

    await saveSchedule(currentWeekStart, data);

    modal.style.display = "none";
    await renderSchedule(currentWeekStart);
});

document.querySelector("#closeLessonModal").addEventListener("click", () => {
    modal.style.display = "none";
});
