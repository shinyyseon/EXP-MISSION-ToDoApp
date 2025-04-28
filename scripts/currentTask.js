import { modBtnEvent, taskBtnEvent, addBtnEvent } from './initEventListeners.js';
import { addEl } from './element.js';
import { todos, saveToLocalStorage } from './script.js';

const checkList = document.querySelector(".currentScrollArea");

// 렌더링
const checkListBody = () => {
  checkList.innerHTML = "";
  todos
      .filter(todo => todo.moveCheck && !todo.complete)
      .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            if (dateA < dateB) return -1;
            if (dateA > dateB) return 1;
            return a.importance - b.importance;
          })
      .forEach(todo => checkList.appendChild(addCheckListBodyElement(todo)));
};

// body 요소 그리기
const addCheckListBodyElement = (todo) => {

  const wrapper = addEl("div", "currentTaskWrapper");
  wrapper.dataset.id = todo.id;

  const container = addEl("div", "currentTaskContainer");
  const mainTask = addEl("div", "mainTaskEx");

  // 제목과 date 요소 기본 text와 input 두개 생성
  const titleSpan = addEl("span", "mainTaskName", todo.title);
  const titleInput = addEl("input", "", "", todo.title, "text", "", "none");

  const dateSpan = addEl("span", "taskDueDate", todo.date);
  const dateInput = addEl("input", "", "", todo.date, "date", "", "none");

  mainTask.append(titleSpan, titleInput, dateSpan, dateInput);

  const actionBtn = addEl("div", "taskButtons");
  const modBtnEl = addEl("button", "edit", "✎");
  const taskBtnEl = addEl("button", "toggleSubtask", "▼");

  actionBtn.append(modBtnEl, taskBtnEl);
  container.append(mainTask, actionBtn);

  const subtaskContainer = addEl("div", "subtaskContainer hidden");
  const addBtnEl = addEl("button", "addSubtaskBtn", "+");
  subtaskContainer.appendChild(addBtnEl);

  wrapper.append(container, subtaskContainer);

  // 이벤트 리스너
  modBtnEvent({ titleSpan, titleInput, dateSpan, dateInput, modBtnEl, todo });
  taskBtnEvent({ taskBtnEl });
  addBtnEvent({ addBtnEl, todo, wrapper });

  return wrapper;
};

// 수정 완료시 적용
const finishEdit = ({ isEditing, titleSpan, titleInput, dateSpan, dateInput, todo }) => {
  if (!isEditing) return;

  titleSpan.innerText = titleInput.value;
  dateSpan.innerText = dateInput.value;

  titleInput.style.display = "none";
  dateInput.style.display = "none";
  titleSpan.style.display = "inline";
  dateSpan.style.display = "inline";

  todo.title = titleInput.value;
  todo.date = dateInput.value;
  saveToLocalStorage();
};

export { checkListBody, finishEdit, todos };