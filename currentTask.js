const checkList = document.querySelector(".currentTaskWrapper");
let todos = [
{
      id: 1,
      title: "첫 번째 항목",
      importance: 1,
      moveCheck: true,
      complete: false,
      date: "2025-04-07",
      list: [
        { id: 101, text: "할 일 1", check: false },
        { id: 102, text: "할 일 2", check: true },
      ],
    },
    {
      id: 2,
      title: "두 번째 항목",
      importance: 1,
      moveCheck: true,
      complete: true,
      date: "2025-04-08",
      list: [
        { id: 201, text: "할 일 A", check: true },
        { id: 202, text: "할 일 B", check: false },
      ],
    },
    {
      id: 3,
      title: "세 번째 항목",
      importance: 1,
      moveCheck: true,
      complete: false,
      date: "2025-04-09",
      list: [
        { id: 201, text: "할 일 A", check: true },
        { id: 202, text: "할 일 B", check: false },
      ],
    },
];

// 본문 렌더링
const checkListBody = () => {
  todos.filter(todo => todo.moveCheck && !todo.complete)
       .forEach(todo => checkList.prepend(addCheckListBodyElement(todo)));
};

// El 생성
const addEl = (tag, className = "", text = "") => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.innerText = text;
  return el;
};

// body 요소 그리기
const addCheckListBodyElement = (todo) => {

  const container = addEl("div", "currentTaskContainer");
  const mainTask = addEl("div", "mainTaskEx");

  // 제목과 date 요소 기본 text와 input 두개 생성
  const titleSpan = addEl("span", "mainTaskName", todo.title);
  const titleInput = addEl("input");
  titleInput.type = "text";
  titleInput.value = todo.title;
  titleInput.style.display = "none";

  const dateSpan = addEl("span", "taskDueDate", todo.date);
  const dateInput = addEl("input");
  dateInput.type = "date";
  dateInput.value = todo.date;
  dateInput.style.display = "none";

  mainTask.append(titleSpan, titleInput, dateSpan, dateInput);

  const buttons = addEl("div", "taskButtons");
  const modBtnEl = addEl("button", "edit", "✎");
  const TaskBtnEl = addEl("button", "toggleSubtask", "▼");
  buttons.append(modBtnEl, TaskBtnEl);

  container.append(mainTask, buttons);
  addEventListeners({ titleSpan, titleInput, dateSpan, dateInput, modBtnEl, TaskBtnEl, todo });
  return container;
};

// 이벤트 함수
const addEventListeners = ({ titleSpan, titleInput, dateSpan, dateInput, modBtnEl, TaskBtnEl, todo }) => {
  // title, date 수정 모드 체크
  let isEditing = false;

  modBtnEl.addEventListener("click", () => {
    // 수정 버튼 클릭 시
    if (!isEditing) {
      isEditing = true;
      titleSpan.style.display = "none";
      titleInput.style.display = "inline";
      dateSpan.style.display = "none";
      dateInput.style.display = "inline";

    // 저장 버튼 클릭 시
    } else {
      isEditing = false;

      titleSpan.innerText = titleInput.value;
      dateSpan.innerText = dateInput.value;

      titleSpan.style.display = "inline";
      titleInput.style.display = "none";
      dateSpan.style.display = "inline";
      dateInput.style.display = "none";

      todo.title = titleInput.value;
      todo.date = dateInput.value;
      saveToLocalStorage();
    }
  });
};

checkListBody();

// 하위태스크 접기/펼치기 토글
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtns = document.querySelectorAll(".toggleSubtask");

  toggleBtns.forEach((toggleBtn) => {
    toggleBtn.addEventListener("click", () => {
      const wrapper = toggleBtn.closest(".currentTaskWrapper");
      const subtaskContainer = wrapper.querySelector(".subtaskContainer");

      subtaskContainer.classList.toggle("hidden");

      toggleBtn.textContent = subtaskContainer.classList.contains("hidden")
        ? "▼"
        : "▲";

      // 펼쳐질 경우 자동 스크롤
      if (!subtaskContainer.classList.contains("hidden")) {
        subtaskContainer.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      }
    });
  });
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
