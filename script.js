import { loadLocalStorage } from './backLog.js';
import { checkListBody } from './currentTask.js';
import { displayTodoList } from './backLog.js';
import './backLog.js';
import './currentTask.js';
import './subTask.js';

loadLocalStorage();
displayTodoList();
checkListBody();

window.addEventListener("updateChecklist", () => {  
  checkListBody();
});

window.addEventListener("updateBacklog", () => {  
  displayTodoList({ fromLocal: false });
});

// 하위태스크 접기/펼치기 토글
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("toggleSubtask")) {
    const toggleBtn = e.target;
    const wrapper = toggleBtn.closest(".currentTaskWrapper");
    const subtaskContainer = wrapper.querySelector(".subtaskContainer");

    if (!subtaskContainer) return;

    subtaskContainer.classList.toggle("hidden");
    toggleBtn.textContent = subtaskContainer.classList.contains("hidden") ? "▼" : "▲";

    if (!subtaskContainer.classList.contains("hidden")) {
      subtaskContainer.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  }
});

// 다크모드
document.addEventListener("DOMContentLoaded", () => {
  const toggleCheckbox = document.getElementById("toggle");

  toggleCheckbox.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode", toggleCheckbox.checked);
  });
});