import { initSubTaskEvents } from "./initEventListeners.js";
import { addEl } from "./element.js";
import { todos } from "./script.js";

// 렌더링
const renderInitialSubTasks = () => {
  document.querySelectorAll(".currentTaskWrapper").forEach(wrapper => {
    const backlogId = wrapper.dataset.id;
    const container = wrapper.querySelector(".subtaskContainer");
    renderSubTaskWrapper(backlogId, container);
  });
  sortTodos();
};

// 특정 Wrapper에 대해 하위 태스크 렌더링
export const renderSubTaskWrapper = (backlogId, container) => {
  clearSubTaskEl(container);

  const backlog = findBacklogId(backlogId);
  console.log(backlog);
  if(!backlog) return;

  backlog.list.forEach(subTask => {
    const taskEl = createSubTaskElement(backlogId, subTask);
    insertSubTaskAddButton(container, taskEl);
  });
};

// 하위 태스크 요소 전체 삭제
const clearSubTaskEl = (container) => {
  if (!container) return;
  container.querySelectorAll(".subtaskItem").forEach(el => el.remove());
};

// ID로 백로그 찾기
const findBacklogId = (id) => todos.find(b => b.id === id);

// 하위 태스크 요소 삽입
const insertSubTaskAddButton = (container, element) => {
  const addBtn = container.querySelector(".addSubtaskBtn");
  container.insertBefore(element, addBtn);
};

// 하위 태스크 요소 생성
const createSubTaskElement = (backlogId, subTask, editable = false) => {
  const div = addEl("div", "subtaskItem");
  div.setAttribute("data-sub-id", subTask.id);

  const checkbox = addEl("input", "subtaskCheck", "", "", "checkbox");
  checkbox.checked = !!subTask.check;

  let textSpan = null;
  let input = null;

  if (editable) {
    const style = "width: 100%; text-align: center; border: none; outline: none; background: transparent;";
    input = addEl("input", "subtaskText", "", "", "text", style);
    input.value = subTask.text || "";
  } else {
    textSpan = addEl("span", "subtaskText", subTask.text);
    if (subTask.check) {
      textSpan.style.textDecoration = "line-through";
      textSpan.style.opacity = "0.6";
    }
  }

  const delBtn = addEl("button", "subtaskDelete", "🗑︎");

  if (editable) {
    div.append(checkbox, input, delBtn);
  } else {
    div.append(checkbox, textSpan, delBtn);
  }

  initSubTaskEvents({ div, backlogId, subTask, textSpan, checkbox, delBtn, input });
  return div;
};


// 버튼 이벤트 연결
const initSubtaskAddButtons = (backlogId, container, addBtn) => {
  const backlog = todos.find((b) => b.id === backlogId);
  if (!backlog) return;

  const newId = Date.now();
  const newTask = { id: newId, text: "", check: false };
  backlog.list.push(newTask);

  const div = createSubTaskElement(backlogId, newTask, true);
  container.insertBefore(div, addBtn);

  const input = div.querySelector('input[type="text"]');
  if (input) input.focus();
};

// 토글 버튼 연결
const toggleSubtask = (toggleBtn) => {
  const container = toggleBtn.closest(".currentTaskWrapper").querySelector(".subtaskContainer");
  if (!container) return;
  const isHidden = container.classList.contains("hidden");
  container.classList.toggle("hidden");
  toggleBtn.innerText = isHidden ? "▲" : "▼";
};

export { renderInitialSubTasks, initSubtaskAddButtons, toggleSubtask };
