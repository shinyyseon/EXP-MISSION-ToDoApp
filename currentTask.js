import { todos, saveToLocalStorage } from './backLog.js';
import { initSubtaskAddButtons } from './subTask.js';
import { renderInitialSubTasks } from './subTask.js';

const checkList = document.querySelector(".currentScrollArea");

// 본문 렌더링
export const checkListBody = () => {
  checkList.innerHTML = "";
  todos.filter(todo => todo.moveCheck && !todo.complete)
    .forEach(todo => checkList.append(addCheckListBodyElement(todo)));
    renderInitialSubTasks();
    initSubtaskAddButtons();
};


// El 생성
const addEl = (tag, className = "", text = "") => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.innerText = text;
  return el;
};

// body 요소 그리기
export const addCheckListBodyElement = (todo) => {
  const currentTaskWrapper = addEl("div", "currentTaskWrapper");
  const container = addEl("div", "currentTaskContainer");
  const mainTask = addEl("div", "mainTaskEx");
  currentTaskWrapper.dataset.id = todo.id; //동적으로 data-id 불러오기

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

  const subtaskContainer = addEl("div", "subtaskContainer hidden");
  const addBtn = addEl("button", "addSubtaskBtn", "+");
  subtaskContainer.appendChild(addBtn);
  currentTaskWrapper.append(container, subtaskContainer);
  addEventListeners({ titleSpan, titleInput, dateSpan, dateInput, modBtnEl, TaskBtnEl, todo });

  return currentTaskWrapper;
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

      console.log("edit");
      window.dispatchEvent(new CustomEvent("updateBacklog"));
    }
  });
};