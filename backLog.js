export let todos = [];

//로컬 스토리지 save, load
export const saveToLocalStorage = () => {
  localStorage.setItem("todoList", JSON.stringify(todos));
};

// 전체 backlog 리스트를 담을 div DOM
const backLogList = document.querySelector(".backlogScrollArea");
// todo List 생성 버튼
const addTask = document.querySelector(".addTask");

// 기본 데이터 셋에 날짜를 현재 날짜로 만들기 위함
const year = new Date().getFullYear();
const month = ("0" + (new Date().getMonth() + 1)).slice(-2);
const day = ("0" + new Date().getDate()).slice(-2);
const today = `${year}-${month}-${day}`;

const searchBtn = document.querySelector(".searchButton");

const choiceImportance = () => {
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
const moveCheckEvent = (backLogContainer, items) => {
  backLogContainer.addEventListener("mouseenter", () => {
    // 이미 .move-btn이 있는 경우 중복 생성을 막기 위해 함수 종료
    if (backLogContainer.querySelector(".move-btn")) return;

    // 우선 "이동" 버튼으로 생성
    const moveBtn = document.createElement("button");
    moveBtn.classList.add("move-btn");
    moveBtn.innerText = ">>>";

    moveBtn.addEventListener("click", () => {
      // 버튼 클릭 시 moveCheck = true로 변경
      items.moveCheck = true;
      console.log("moveCheck:", items);
      addLocalStorage();

      window.dispatchEvent(new CustomEvent("updateChecklist"));
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

// 새로운 Task 생성
const createTask = () => {
  // items(todo) 의 기본 데이터 구조
  const items = {
    // 일단 id를 고유한 new Date()로 나둠
    id: new Date().toISOString(),
    title: "",
    moveCheck: false,
    complet: false,
    // 기본적으로 (하)를 부여 ( 1 = 상, 2 = 중, 3 = 하)
    importance: 3,
    date: "",
    list: [],
  };
  todos.unshift(items);
  const { backLogContainer } = newElement(items);
  backLogList.prepend(backLogContainer);
};

// backLog 중요도 ( 상 중 하 ) 컨테이너 생성 함수
const addImportanceContainer = (items) => {
  const importanceContainer = document.createElement("div");
  importanceContainer.classList.add("importanceDropdown");

  const selected = document.createElement("div");
  selected.classList.add("selected");

  const selectedCircle = document.createElement("span");
  selectedCircle.classList.add("circle");

  const label = document.createElement("span");
  label.classList.add("label");
  // 처음 생성 시 중요도는 (하) 고정
  items.importance === 1
    ? ((label.innerText = "상"), selectedCircle.classList.add("high"))
    : items.importance === 2
    ? ((label.innerText = "중"), selectedCircle.classList.add("medium"))
    : ((label.innerText = "하"), selectedCircle.classList.add("low"));

  const dropdownOptions = document.createElement("ul");
  dropdownOptions.classList.add("dropdownOptions");
  dropdownOptions.classList.add("hidden");

  const liOne = document.createElement("li");
  liOne.dataset.value = 1;
  liOne.innerHTML = `<span class="circle high"></span> 상`;

  const liTwo = document.createElement("li");
  liTwo.dataset.value = 2;
  liTwo.innerHTML = `<span class="circle medium"></span> 중`;

  const liThree = document.createElement("li");
  liThree.dataset.value = 3;
  liThree.innerHTML = `<span class="circle low"></span> 하`;

  dropdownOptions.appendChild(liOne);
  dropdownOptions.appendChild(liTwo);
  dropdownOptions.appendChild(liThree);

  selected.appendChild(selectedCircle);
  selected.appendChild(label);

  importanceContainer.appendChild(selected);
  importanceContainer.appendChild(dropdownOptions);

  return {
    importanceContainer,
    selected,
    dropdownOptions,
    label,
    selectedCircle,
  };
};

// 달력 컨테이너 생성 함수
const addDateContainer = (items) => {
  const finishDateContainer = document.createElement("div");
  finishDateContainer.classList.add("finishDateContainer");

  const finishDateContent = document.createElement("input");
  finishDateContent.type = "date";
  finishDateContent.classList.add("finishDateContent");
  // todo list 특성 (오늘기준) 이전 날짜를 허용 안하기 위함
  finishDateContent.min = today;
  finishDateContent.value = items.date;

  // 정렬 시 date값이 있으면 선택 못하고 변경을 눌렀을 시 변경할 수 있게 disabled 속성을 추가
  items.date == "" ? null : finishDateContent.setAttribute("disabled", "");

  finishDateContainer.appendChild(finishDateContent);

  return { finishDateContainer, finishDateContent };
};

// BackLogContainer, BackLogMainContainer 를 만드는 함수
export const addBackLogContainer = () => {
  // 하나의 backLog 를 담을 컨테이너
  const backLogContainer = document.createElement("div");
  backLogContainer.classList.add("taskContainer");
  // backLog의 컨텐츠들을 담을 main 컨테이너
  const backLogMainContainer = document.createElement("div");
  backLogMainContainer.classList.add("maintaskContainer");

  return { backLogContainer, backLogMainContainer };
};
// backLog에 들어갈 input Task 생성 함수
const addBackLogTask = (items) => {
  // backLog taskContent를 적을 input
  const backLogTaskContent = document.createElement("input");
  backLogTaskContent.classList.add("taskContent");
  backLogTaskContent.placeholder = "오늘 할 일을 적어주세요";
  backLogTaskContent.type = "text";
  backLogTaskContent.value = items.title;

  // 정렬 시 새롭게 엘리먼트를 만드는데 만약 title 값이 있다면 변경할 수 없게 만듬
  items.title == "" ? null : backLogTaskContent.setAttribute("disabled", "");
  return { backLogTaskContent };
};

// 버튼을 만드는 함수
const addButtons = () => {
  // 수정 버튼 생성
  const editBtn = document.createElement("button");
  editBtn.classList.add("edit");
  editBtn.innerText = "✎";
  // 삭제 버튼 생성
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete");
  deleteBtn.innerText = "🗑︎";

  return { editBtn, deleteBtn };
};

// 새로운 Task Element 생성 함수
const newElement = (items) => {
  const {
    importanceContainer,
    selected,
    dropdownOptions,
    label,
    selectedCircle,
  } = addImportanceContainer(items);
  const { finishDateContainer, finishDateContent } = addDateContainer(items);
  const { backLogContainer, backLogMainContainer } = addBackLogContainer(items);
  const { backLogTaskContent } = addBackLogTask(items);
  const { editBtn, deleteBtn } = addButtons();

  eventListener.changeDate(finishDateContent, items);
  eventListener.createTitle(backLogTaskContent, items);
  eventListener.blurContent(backLogTaskContent);
  eventListener.clickEdit(editBtn, backLogTaskContent, finishDateContent);
  eventListener.clickDelete(deleteBtn, backLogContainer, items);
  eventListener.changeImportant(dropdownOptions, label, selectedCircle, items);

  moveCheckEvent(backLogContainer, items);

  backLogMainContainer.appendChild(backLogTaskContent);
  backLogMainContainer.appendChild(importanceContainer);
  backLogMainContainer.appendChild(editBtn);
  backLogMainContainer.appendChild(deleteBtn);
  backLogMainContainer.appendChild(finishDateContainer);

  backLogContainer.appendChild(backLogMainContainer);

  return { backLogContainer };
};

// 이벤트리스너를 모아둔 객체
const eventListener = {
  // 날짜를 변경 했을 시
  changeDate: (dateInputElement, items) => {
    dateInputElement.addEventListener("change", (e) => {
      items.date = e.target.value;
      sortTodos();
      addLocalStorage();
      window.dispatchEvent(new CustomEvent("updateChecklist"));
    });
  },
  // 제목을 입력 시
  createTitle: (taskInputElement, items) => {
    taskInputElement.addEventListener("input", (e) => {
      items.title = e.target.value;
      addLocalStorage();
      window.dispatchEvent(new CustomEvent("updateChecklist"));
    });
  },
  // input Element에서 blur 가 발생했을 떄
  blurContent: (taskInputElement) => {
    taskInputElement.addEventListener("blur", (e) => {
      taskInputElement.setAttribute("disabled", "");
    });
  },
  // edit 버튼 클릭 시
  clickEdit: (editBtn, taskInputElement, dateInputElement) => {
    editBtn.addEventListener("click", () => {
      taskInputElement.removeAttribute("disabled");
      dateInputElement.removeAttribute("disabled");
      taskInputElement.focus();
      choiceImportance();
      window.dispatchEvent(new CustomEvent("updateChecklist"));
    });
  },
  // delete 버튼 클릭 시
  clickDelete: (deleteBtn, backLogContainer, items) => {
    deleteBtn.addEventListener("click", (e) => {
      backLogList.removeChild(backLogContainer);
      todos = todos.filter((item) => item.id !== items.id);
      addLocalStorage();
      window.dispatchEvent(new CustomEvent("updateChecklist"));
      
    });
  },
  // 중요도 변경 시
  changeImportant: (dropDownElement, label, selectedCircle, items) => {
    // dropDownElement ( ul ) 안에 있는 li 를 가져온다
    const importanceList = dropDownElement.querySelectorAll("li");
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
  },
  // addTask 버튼을 누를 시 이벤트 발생
  clickAddTask: (addTaskBtn) => {
    addTaskBtn.addEventListener("click", () => {
      createTask();
      choiceImportance();
      addLocalStorage();
    });
  },
};

// 정렬 코드
const sortTodos = () => {
  // 날짜를 기준으로 정렬, 날짜가 같으면 importance 값을 비교하여 정렬
  todos.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    console.log(dateA);
    console.log(dateB);

    if (dateA.getTime() === dateB.getTime()) {
      // 날짜가 같으면 importance 값을 비교
      return a.importance - b.importance;
    } else {
      // 날짜를 기준으로 정렬
      return dateA - dateB;
    }
  });
  // 정렬된 todos 배열을 화면에 다시 렌더링하는 코드 추가
  backLogList.innerHTML = "";
  todos.forEach((item) => {
    const { backLogContainer } = newElement(item);
    backLogList.appendChild(backLogContainer);
  });
  highlightUrgentTasks();
};

// LocalStorage 생성
const addLocalStorage = () => {
  const data = JSON.stringify(todos);
  localStorage.setItem("todoList", data);
  highlightUrgentTasks();
};

// 리로드 했을 시 localStorage에 todoList 가 있다면 불러와서 JSON 형태로 만든 후 todos 에 초기화
export const loadLocalStorage = () => {
  const data = localStorage.getItem("todoList");
  if (data) {
    todos = JSON.parse(data);
  }
};

// 처음 로드 되었을 때 localStorage 를 확인 후 있다면 todoList를 생성
export const displayTodoList = (options = { fromLocal: true }) => {
  if (options.fromLocal) {
    loadLocalStorage();
  }

  backLogList.innerHTML = "";

  todos.forEach((item) => {
    const { backLogContainer } = newElement(item);
    backLogList.appendChild(backLogContainer);
  });

  highlightUrgentTasks();
};


// 백로그 렌더링에 배치
const backBody = (keyword) => {
  let filtered;
  if (keyword) {
    filtered = todos.filter((todo) => todo.title.includes(keyword));
    console.log(filtered);
    backLogList.innerHTML = "";
    filtered.forEach((todo) => {
      const { backLogContainer } = newElement(todo);
      backLogList.prepend(backLogContainer);
    });
  } else {
    sortTodos();
  }

  highlightUrgentTasks();
};

// 이벤트 함수
const addEventListeners = () => {
  // 검색 버튼 클릭시
  searchBtn.addEventListener("click", () => {
    const keyword = document.querySelector(".searchBar").value.trim();
    backBody(keyword);
  });
};

// js load 할 때 로컬 스토리지에 있는지 확인

// 로드 시 addTask 이벤트를 활성화
eventListener.clickAddTask(addTask);
choiceImportance();
addEventListeners();

// 페이지 로드 및 변경 시 실행
window.addEventListener("DOMContentLoaded", highlightUrgentTasks);