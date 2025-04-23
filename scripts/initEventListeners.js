import { addLocalStorage, todoDelete, saveToLocalStorage, todos } from "./script.js";
import { addEl } from "./element.js";
import { createTask, sortTodos, backLogList, today } from "./backlogTask.js";
import { finishEdit, checkListBody } from './currentTask.js';
import { toggleSubtask, initSubtaskAddButtons, renderInitialSubTasks } from './subTask.js';
import { renderCompletedTasks } from './completedTask.js';

// 다크모드
document.addEventListener("DOMContentLoaded", () => {
  const toggleCheckbox = document.getElementById("toggle");

  toggleCheckbox.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode", toggleCheckbox.checked);
    highlightUrgentTasks();
  });
});

// 초기 이벤트
const initBackLogEvents = ({ finishDateContent, backLogTaskContent, backLogContainer, editBtn, deleteBtn, dropdownOptions, selected, label, items }) => {
  // 날짜를 변경 했을 시
  finishDateContent.addEventListener("change", (e) => {
    items.date = e.target.value;
    sortTodos();
    window.dispatchEvent(new CustomEvent("updateChecklist"));
    addLocalStorage();
  });
  // 제목을 입력 시
  backLogTaskContent.addEventListener("input", (e) => {
    items.title = e.target.value;
    window.dispatchEvent(new CustomEvent("updateChecklist"));
    addLocalStorage();
  });
  // input Element에서 blur 가 발생했을 떄
  backLogTaskContent.addEventListener("blur", (e) => {
    backLogTaskContent.setAttribute("disabled", "");
  });
  // edit 버튼 클릭 시
  editBtn.addEventListener("click", () => {
    backLogTaskContent.removeAttribute("disabled");
    finishDateContent.removeAttribute("disabled");
    backLogTaskContent.focus();
  });
  // delete 버튼 클릭 시
  deleteBtn.addEventListener("click", (e) => {
    backLogList.removeChild(backLogContainer);
    todoDelete(items);
    window.dispatchEvent(new CustomEvent("updateChecklist"));
  });
  // 중요도 변경 시
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
      highlightUrgentTasks();
      addLocalStorage();
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

  backLogContainer.addEventListener("mouseenter", () => {
    // 이미 .move-btn이 있는 경우 중복 생성을 막기 위해 함수 종료
    if (backLogContainer.querySelector(".move-btn")) return;

    // 우선 "이동" 버튼으로 생성
    const moveBtn = addEl("button", "move-btn", ">>>");

    moveBtn.addEventListener("click", () => {
      // 버튼 클릭 시 moveCheck = true로 변경
      items.moveCheck = true;
      console.log("moveCheck:", items);
      window.dispatchEvent(new CustomEvent("updateChecklist"));
      addLocalStorage();
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
// todo List 생성 버튼
// addTask 버튼을 누를 시 이벤트 발생
const initBackLogButtons = () => {
  const addTaskBtn = document.querySelector(".addTask");
  const searchBtn = document.querySelector(".searchButton");

  addTaskBtn.addEventListener("click", () => {
    createTask();
    addLocalStorage();
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
      if (diffDays <= 1 && diffDays >= 0) {
        task.style.backgroundColor = isDarkMode ? "#663344" : "#ffe0e9"; // 당일~1일
      } else if (diffDays === 2 || diffDays === 3) {
        task.style.backgroundColor = isDarkMode ? "#665c33" : "#fff7cc"; // 2~3일
      } else {
        task.style.backgroundColor = ""; // 기본값
      }
    }
  });
};


// backLogContainer에 마우스 hover 이벤트 설정

// 체크리스트 본문 이벤트
const initCurrentTaskEvents = ({ titleSpan, titleInput, dateSpan, dateInput, modBtnEl, taskBtnEl, addBtnEl, todo, wrapper }) => {
  let isEditing = false;

  // 수정 버튼
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
  });

  // toggle 버튼
  taskBtnEl.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleSubtask(taskBtnEl);
  });

  // + 버튼
  addBtnEl.addEventListener("click", (e) => {
    const container = wrapper.querySelector('.subtaskContainer');
    initSubtaskAddButtons(todo.id, container, addBtnEl);
  });

  // 외부 클릭 시 저장
  document.addEventListener("click", (e) => {
    if (isEditing && ![titleInput, dateInput, modBtnEl].includes(e.target)) {
      finishEdit({ isEditing, titleSpan, titleInput, dateSpan, dateInput, todo });
      isEditing = false;
    }
  });

  // 엔터 키 입력 시 저장
  titleInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      finishEdit({ isEditing, titleSpan, titleInput, dateSpan, dateInput, todo });
      isEditing = false;
    }
  });

  dateInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      finishEdit({ isEditing, titleSpan, titleInput, dateSpan, dateInput, todo });
      isEditing = false;
    }
  });
};


// 하위 태스크 이벤트
const initSubTaskEvents = ({ div, backlogId, subTask, textEl, checkbox, delBtn, input}) => {

  // 체크 박스
  checkbox.addEventListener('change', () => {
    subTask.check = checkbox.checked;
    const text = textEl || div.querySelector('.subtaskText');
    if (text) {
      text.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
      text.style.opacity = checkbox.checked ? '0.6' : '1';
    }
    const backlog = todos.find(b => b.id === backlogId);
    if (!backlog) return;

    const allChecked = backlog.list.every(sub => sub.check === true);
    backlog.complete = allChecked;
    if(allChecked)     window.dispatchEvent(new CustomEvent("updateChecklist"));
    renderInitialSubTasks();
    saveToLocalStorage();
  });

  // 삭제 버튼
  delBtn.addEventListener('click', () => {
    const backlog = todos.find(item => item.id === backlogId);
    if (!backlog) return;
    backlog.list = backlog.list.filter(item => item.id !== subTask.id);
    saveToLocalStorage();
    div.remove();
  });

  // 입력 완료 후 변환
  if (input) {
    let isConfirmed = false;
    const confirm = () => {
      if (isConfirmed) return;
      isConfirmed = true;

      const value = input.value.trim();
      console.log(value);
       if (!value) {
         const backlog = todos.find(item => item.id === backlogId);
         if (backlog) {
           backlog.list = backlog.list.filter(item => item.id !== subTask.id);
           saveToLocalStorage();
         }
         div.remove();
         return;
       }
      subTask.text = value;

      const span = document.createElement('span');
      span.className = 'subtaskText';
      span.textContent = subTask.text;

      if (subTask.check) {
        span.style.textDecoration = 'line-through';
        span.style.opacity = '0.6';
      }

      input.replaceWith(span);
      initSubTaskEvents({ div, backlogId, subTask, textEl: span, checkbox, delBtn, input: null });
      saveToLocalStorage();
    };

    input.addEventListener('keydown', e => e.key === 'Enter' && confirm());
    input.addEventListener('blur', confirm);
  }
};

//완료 태스크 이벤트 (체크리스트로 복귀)
const completedTaskrestore = ({ restoreEl, backlogId }) => {
  restoreEl.addEventListener('click', () => {
    const backlog = todos.find(b => b.id === backlogId);
    if (!backlog) return;

    backlog.list.forEach(sub => sub.check = false);
    backlog.complete = false;

    saveToLocalStorage();
    window.dispatchEvent(new CustomEvent("updateChecklist"));
    renderInitialSubTasks();
  });
};

// 완료된 태스크 이벤트
const initCompletedTaskEvents = ({ item, delBtn }) => {
  delBtn.addEventListener("click", (e) => {
      todoDelete(item);
      renderCompletedTasks(todos);
  });
};


window.addEventListener("updateChecklist", () => {  
  checkListBody();
  renderCompletedTasks(todos);
});

window.addEventListener("updateBackLog", () => {
  sortTodos();
});

export { initCurrentTaskEvents, initSubTaskEvents, completedTaskrestore, initCompletedTaskEvents };
export { initBackLogEvents, highlightUrgentTasks, initBackLogButtons };
