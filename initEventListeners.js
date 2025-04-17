import {
  createTask,
  sortTodos,
  backLogList,
  choiceImportance,
  today,
} from "./backlogTask.js";
import { addLocalStorage, todoDelete } from "./script.js";
import { addEl } from "./element.js";

// 초기 이벤트
const initBackLogEvents = ({
  finishDateContent,
  backLogTaskContent,
  backLogContainer,
  editBtn,
  deleteBtn,
  dropdownOptions,
  selected,
  label,
  items,
}) => {
  // 날짜를 변경 했을 시
  finishDateContent.addEventListener("change", (e) => {
    items.date = e.target.value;
    sortTodos();
    addLocalStorage();
  });
  // 제목을 입력 시
  backLogTaskContent.addEventListener("input", (e) => {
    items.title = e.target.value;
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
    choiceImportance();
  });
  // delete 버튼 클릭 시
  deleteBtn.addEventListener("click", (e) => {
    backLogList.removeChild(backLogContainer);
    todoDelete(items);
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
      items.importance === 1
        ? (label.innerText = "상")
        : items.importance === 2
        ? (label.innerText = "중")
        : (label.innerText = "하");
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
      addLocalStorage();
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
    choiceImportance();
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
  tasks.forEach((task) => {
    const dateInput = task.querySelector(".finishDateContent");
    if (dateInput && dateInput.value) {
      const dueDate = new Date(dateInput.value);

      // 시/분/초 제거하여 날짜만 비교
      const todayOnly = new Date(today);
      const dueOnly = new Date(
        dueDate.getFullYear(),
        dueDate.getMonth(),
        dueDate.getDate()
      );

      const diffTime = dueOnly - todayOnly;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // 조건에 따라 색상 설정
      if (diffDays <= 1 && diffDays >= 0) {
        task.style.backgroundColor = "#ffe0e9"; // 연핑크: 당일 ~ 1일 전
      } else if (diffDays === 2 || diffDays === 3) {
        task.style.backgroundColor = "#fff7cc"; // 연노랑: 2~3일 전
      } else {
        task.style.backgroundColor = ""; // 기본값
      }
    }
  });
};

// backLogContainer에 마우스 hover 이벤트 설정

export { initBackLogEvents, highlightUrgentTasks, initBackLogButtons };
