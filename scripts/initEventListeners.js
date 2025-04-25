import { todoDelete, saveToLocalStorage, todos } from "./script.js";
import { addEl } from "./element.js";
import { createTask, sortTodos, backLogList } from "./backlogTask.js";
import { finishEdit, checkListBody } from "./currentTask.js";
import { toggleSubtask, initSubtaskAddButtons, renderInitialSubTasks } from "./subTask.js";
import { renderCompletedTasks } from "./completedTask.js";

// 다크모드
document.addEventListener("DOMContentLoaded", () => {
  const toggleCheckbox = document.getElementById("toggle");

  toggleCheckbox.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode", toggleCheckbox.checked);
    highlightUrgentTasks();
  });
});

// 전체 백로그 이벤트 초기화
const initBackLogEvents = ({ finishDateContent, backLogTaskContent, backLogContainer, editBtn, deleteBtn, dropdownOptions, selected, label, items }) => {
  const state = { editing: false };

  document.addEventListener("click", (e) => {
    // 클릭한 대상이 backLogContainer 내부가 아닌 경우
    if (state.editing && !backLogContainer.contains(e.target)) {
      // finishDateContent와 backLogTaskContent를 disabled로 설정
      finishDateContent.disabled = true;
      backLogTaskContent.disabled = true;
      state.editing = false;
      renderInitialSubTasks();
    }
  });

  editBtnEvent({ state, finishDateContent, backLogTaskContent, editBtn, items });
  deleteBtnEvent({ backLogContainer, deleteBtn, items });
  selectedEvent({ selected, dropdownOptions, label, items });
  arrowEvent({ backLogContainer, items });
  searchBtnEvent();
};

// 백로그 이벤트 - edit 버튼 이벤트
const editBtnEvent = ({ state, finishDateContent, backLogTaskContent, editBtn, items }) => {
  editBtn.addEventListener("click", () => {
    backLogTaskContent.removeAttribute("disabled");
    finishDateContent.removeAttribute("disabled");
    backLogTaskContent.focus();
    state.editing = true;
  });

  // 날짜를 변경 했을 시
  finishDateContent.addEventListener("change", (e) => {
    items.date = e.target.value;
    window.dispatchEvent(new CustomEvent("updateChecklist"));
    sortTodos();
  });

  // 제목을 입력 시
  backLogTaskContent.addEventListener("input", (e) => {
    items.title = e.target.value;
    saveToLocalStorage();
  });
  //제목 엔티 눌렀을 떄
  backLogTaskContent.addEventListener("keydown", (e) => {
    e.key == "Enter" ? (e.target.disabled = true) : "";
    saveToLocalStorage();
  });

  backLogTaskContent.addEventListener("blur", () => {
    backLogTaskContent.disabled = items.title === "" ? false : true;
    window.dispatchEvent(new CustomEvent("updateChecklist"));
  });
};

// 백로그 이벤트 - 삭제 버튼 이벤트
const deleteBtnEvent = ({ backLogContainer, deleteBtn, items }) => {
  deleteBtn.addEventListener("click", (e) => {
    backLogList.removeChild(backLogContainer);
    todoDelete(items);
    window.dispatchEvent(new CustomEvent("updateChecklist"));
  });
};

// 백로그 이벤트 - 중요도 변경 이벤트
const selectedEvent = ({ selected, dropdownOptions, label, items }) => {
  // dropDownElement ( ul ) 안에 있는 li 를 가져온다
  const importanceList = dropdownOptions.querySelectorAll("li");
  importanceList.forEach((li, index) => {
    li.addEventListener("click", () => {
      // li 가 리스트 형식으로 들어오기 때문에 index 0-2 존재
      // 0 - 상, 1 - 중, 2 - 하
      items.importance = index + 1;
      // 중요도 1, 2, 3 에 대해 그때에 해당하는 스타일을 보여주는 삼항 연산자
      items.importance === 1 ? (label.innerText = "상") : items.importance === 2 ? (label.innerText = "중") : (label.innerText = "하");
      sortTodos();
    });
  });

  selected.addEventListener("click", () => {
    dropdownOptions.classList.toggle("hidden");
  });

  dropdownOptions.querySelectorAll("li").forEach((option) => {
    dropdownOptions.addEventListener("click", () => {
      selected.innerHTML = option.innerHTML;
      dropdownOptions.classList.add("hidden");
    });
  });
};

// 백로그 이벤트 - 화살 표 버튼 이벤트
const arrowEvent = ({ backLogContainer, items }) => {
  backLogContainer.addEventListener("mouseenter", () => {
    // 이미 .move-btn이 있는 경우 중복 생성을 막기 위해 함수 종료
    if (backLogContainer.querySelector(".move-btn")) return;

    // 완료된 항목이면 버튼 생성 안 함
    if (items.complete) return;

    // ">>>", "<<<" 버튼 생성
    const isMoved = items.moveCheck;
    const btnText = isMoved ? "<<<" : ">>>";
    const moveBtn = addEl("button", "move-btn", items.moveCheck ? "<<<" : ">>>");
    if (items.moveCheck) moveBtn.classList.add("reverse"); // <<<일 때 클래스 추가

    // ">>>", "<<<" 버튼 클릭 시
    moveBtn.addEventListener("click", () => {
      items.moveCheck = !items.moveCheck;
      console.log("moveCheck:", items.moveCheck);
      window.dispatchEvent(new CustomEvent("updateChecklist"));
      saveToLocalStorage();
      renderInitialSubTasks();
    });

    // 이동 버튼을 backLogContainer에 추가함
    backLogContainer.appendChild(moveBtn);
  });

  // 마우스가 backLogContainer에서 벗어났을 때 이벤트
  backLogContainer.addEventListener("mouseleave", () => {
    // .move-btn이 있는지 확인 후 있다면 제거
    const btn = backLogContainer.querySelector(".move-btn");
    if (btn) btn.remove();
  });
};

// 백로그 이벤트 - 검색 기능 이벤트
const searchBtnEvent = () => {
  const keyword = document.querySelector(".searchBar");
  keyword.addEventListener("keydown", (e) => {
    const word = keyword.value.trim();
    if (e.key == "Enter") {
      sortTodos(word);
    }
  });
};

// todo List 생성 버튼
// addTask 버튼을 누를 시 이벤트 발생
const initBackLogButtons = () => {
  const addTaskBtn = document.querySelector(".addTask");
  const searchBtn = document.querySelector(".searchButton");

  addTaskBtn.addEventListener("click", () => {
    createTask();
    saveToLocalStorage();
    console.log(todos);
  });

  searchBtn.addEventListener("click", () => {
    const keyword = document.querySelector(".searchBar").value.trim();
    sortTodos(keyword);
  });
};

// 종료일 마감 임박시 이벤트
const highlightUrgentTasks = () => {
  const tasks = document.querySelectorAll(".maintaskContainer");
  const isDarkMode = document.body.classList.contains("dark-mode");

  const today = new Date(); // ← 기존 코드에 없으면 추가
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  tasks.forEach((task) => {
    const dateInput = task.querySelector(".finishDateContent");
    if (dateInput && dateInput.value) {
      const dueDate = new Date(dateInput.value);
      const dueOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

      const diffTime = dueOnly - todayOnly;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // 색상 설정
      if (diffDays < 0) {
        task.style.backgroundColor = isDarkMode ? "#555555" : "#e0e0e0"; // 마감일 지남 (회색)
      } else if (diffDays <= 1 && diffDays >= 0) {
        task.style.backgroundColor = isDarkMode ? "#663344" : "#ffe0e9"; // 당일~1일
      } else if (diffDays === 2 || diffDays === 3) {
        task.style.backgroundColor = isDarkMode ? "#665c33" : "#fff7cc"; // 2~3일
      } else {
        task.style.backgroundColor = ""; // 기본값
      }
    }
  });
};

// 체크리스트 본문 - 수정 이벤트
export const modBtnEvent = ({ titleSpan, titleInput, dateSpan, dateInput, modBtnEl, todo }) => {
  let isEditing = false;
  modBtnEl.addEventListener("click", (e) => {
    e.stopPropagation();
    isEditing = true;

    titleInput.style.display = "inline";
    dateInput.style.display = "inline";
    titleSpan.style.display = "none";
    dateSpan.style.display = "none";

    titleInput.style = "display: inline; padding: 8px; border-radius: 8px; border: 1px solid #ccc; font-size: 14px; width: 90%; margin-bottom: 6px;";
    dateInput.style = "display: inline; padding: 6px; border-radius: 6px; border: 1px solid #ccc; font-size: 14px;";

    titleInput.focus();
    saveEvent({ isEditing, titleSpan, titleInput, dateSpan, dateInput, todo });
  });
};

// 체크리스트 본문 - toggle 버튼 이벤트
export const taskBtnEvent = ({ taskBtnEl }) => {
  taskBtnEl.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleSubtask(taskBtnEl);
  });
};

// 체크리스트 본문 - 추가(+) 버튼 이벤트
export const addBtnEvent = ({ addBtnEl, todo, wrapper }) => {
  addBtnEl.addEventListener("click", (e) => {
    const container = wrapper.querySelector(".subtaskContainer");
    initSubtaskAddButtons(todo.id, container, addBtnEl);
  });
};

// 체크리스트 본문 - save 이벤트
const saveEvent = ({ isEditing, titleSpan, titleInput, dateSpan, dateInput, todo }) => {
  // 외부 클릭 시 저장
  const clickHandler = (e) => {
    if (isEditing && ![titleInput, dateInput].includes(e.target)) {
      finishEdit({ isEditing, titleSpan, titleInput, dateSpan, dateInput, todo });
      document.removeEventListener("click", clickHandler);
    }
  };

  document.addEventListener("click", clickHandler);

  // 엔터 키 클릭 시 저장
  titleInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      finishEdit({ isEditing, titleSpan, titleInput, dateSpan, dateInput, todo });
      document.removeEventListener("click", clickHandler);
    }
  });

  dateInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      finishEdit({ isEditing, titleSpan, titleInput, dateSpan, dateInput, todo });
      document.removeEventListener("click", clickHandler);
    }
  });
};

// 하위 태스크 이벤트
// 전체 하위 태스크 이벤트 초기화
const initSubTaskEvents = ({ div, backlogId, subTask, textEl, checkbox, delBtn, input }) => {
  checkboxEvent({ div, backlogId, subTask, textEl, checkbox });
  deleteEvent({ div, backlogId, subTask, delBtn });
  if (input) inputConfirmEvent({ div, backlogId, subTask, checkbox, delBtn, input });
};

// 체크박스 이벤트
const checkboxEvent = ({ div, backlogId, subTask, textEl, checkbox }) => {
  checkbox.addEventListener("change", () => {
    subTask.check = checkbox.checked;
    const text = textEl || div.querySelector(".subtaskText");
    if (text) {
      text.style.textDecoration = checkbox.checked ? "line-through" : "none";
      text.style.opacity = checkbox.checked ? "0.6" : "1";
    }

    const backlog = todos.find((b) => b.id === backlogId);
    if (!backlog) return;

    const allChecked = backlog.list.every((sub) => sub.check === true);
    backlog.complete = allChecked;
    if (allChecked) window.dispatchEvent(new CustomEvent("updateChecklist"));
    renderInitialSubTasks();
    saveToLocalStorage();
  });
};

// 삭제 버튼 이벤트
const deleteEvent = ({ div, backlogId, subTask, delBtn }) => {
  delBtn.addEventListener("click", () => {
    const backlog = todos.find((item) => item.id === backlogId);
    if (!backlog) return;

    backlog.list = backlog.list.filter((item) => item.id !== subTask.id);
    saveToLocalStorage();
    div.remove();
  });
};

// 입력 확인 이벤트
const inputConfirmEvent = ({ div, backlogId, subTask, checkbox, delBtn, input }) => {
  let isConfirmed = false;

  const confirm = () => {
    if (isConfirmed) return;
    isConfirmed = true;
    const value = input.value.trim();

    if (!value) {
      const backlog = todos.find((item) => item.id === backlogId);
      if (backlog) {
        backlog.list = backlog.list.filter((item) => item.id !== subTask.id);
        saveToLocalStorage();
      }
      div.remove();
      return;
    }

    subTask.text = value;

    const span = document.createElement("span");
    span.className = "subtaskText";
    span.textContent = subTask.text;

    if (subTask.check) {
      span.style.textDecoration = "line-through";
      span.style.opacity = "0.6";
    }

    input.replaceWith(span);
    initSubTaskEvents({ div, backlogId, subTask, textEl: span, checkbox, delBtn, input: null });
    saveToLocalStorage();
  };

  input.addEventListener("keydown", (e) => e.key === "Enter" && confirm());
  input.addEventListener("blur", confirm);
};

//완료 태스크 이벤트 (체크리스트로 복귀)
const completedTaskrestore = ({ restoreEl, backlogId }) => {
  restoreEl.addEventListener("click", () => {
    const backlog = todos.find((b) => b.id === backlogId);
    if (!backlog) return;

    backlog.list.forEach((sub) => (sub.check = false));
    backlog.complete = false;

    saveToLocalStorage();
    window.dispatchEvent(new CustomEvent("updateChecklist"));
    window.dispatchEvent(new CustomEvent("updateBackLog"));
    renderInitialSubTasks();
  });
};

// 완료된 태스크 이벤트
const initCompletedTaskEvents = ({ item, delBtn }) => {
  delBtn.addEventListener("click", (e) => {
    todoDelete(item);
    renderCompletedTasks(todos);
  });
  window.dispatchEvent(new CustomEvent("updateBackLog"));
};

window.addEventListener("updateChecklist", () => {
  checkListBody();
  renderCompletedTasks(todos);
});

window.addEventListener("updateBackLog", () => {
  sortTodos();
});

export { initSubTaskEvents, completedTaskrestore, initCompletedTaskEvents };
export { initBackLogEvents, highlightUrgentTasks, initBackLogButtons };
