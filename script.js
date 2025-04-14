import './currentTask.js';
import './subTask.js';

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

// 중요도 선택지 
document.querySelectorAll(".importanceDropdown").forEach((dropdown) => {
  const selected = dropdown.querySelector(".selected");
  const options = dropdown.querySelector(".dropdownOptions");

  selected.addEventListener("click", () => {
    options.classList.toggle("hidden");
  });

  options.querySelectorAll("li").forEach((option) => {
    option.addEventListener("click", () => {
      selected.innerHTML = option.innerHTML;
      options.classList.add("hidden");
    });
  });
});

// 다크모드
document.addEventListener("DOMContentLoaded", () => {
  const toggleCheckbox = document.getElementById("toggle");

  toggleCheckbox.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode", toggleCheckbox.checked);
  });
});