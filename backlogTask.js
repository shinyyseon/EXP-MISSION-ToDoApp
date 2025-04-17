import { todos, addLocalStorage } from "./script.js";
import { addEl } from "./element.js";
import {
  highlightUrgentTasks,
  initBackLogEvents,
} from "./initEventListeners.js";

// 전체 backlog 리스트를 담을 div DOM
const backLogList = document.querySelector(".backlogScrollArea");

// 기본 데이터 셋에 날짜를 현재 날짜로 만들기 위함
const year = new Date().getFullYear();
const month = ("0" + (new Date().getMonth() + 1)).slice(-2);
const day = ("0" + new Date().getDate()).slice(-2);
const today = `${year}-${month}-${day}`;

// 정렬 부분을 검색 부분과 합침 ( 렌더링 부분 )
const sortRender = (items) => {
  items.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    if (dateA.getTime() === dateB.getTime()) {
      // 날짜가 같으면 importance 값을 비교
      return a.importance - b.importance;
    } else {
      // 날짜를 기준으로 정렬
      return dateA - dateB;
    }
  });

  backLogList.innerHTML = "";
  items.forEach((todo) => {
    const { backLogContainer } = newElement(todo);
    backLogList.appendChild(backLogContainer);
  });
};

// 정렬 코드
const sortTodos = (keyword = "") => {
  const filtered = keyword
    ? todos.filter((todo) => todo.title.includes(keyword))
    : todos;
  sortRender(filtered);
  addLocalStorage();
  highlightUrgentTasks();
};

// 새로운 Task 생성
const createTask = () => {
  // items(todo) 의 기본 데이터 구조
  const items = {
    // 일단 id를 고유한 new Date()로 나둠
    id: new Date(),
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

const addBackLogElement = (items) => {
  // backLog 중요도 ( 상 중 하 ) 컨테이너 생성 함수
  const importanceContainer = addEl("div", "importanceDropdown");
  const selected = addEl("div", "selected");
  const selectedCircle = addEl("span", "circle");

  const label = addEl("span", "label");
  // 처음 생성 시 중요도는 (하) 고정
  items.importance === 1
    ? ((label.innerText = "상"), selectedCircle.classList.add("high"))
    : items.importance === 2
    ? ((label.innerText = "중"), selectedCircle.classList.add("medium"))
    : ((label.innerText = "하"), selectedCircle.classList.add("low"));

  const dropdownOptions = addEl("ul", "dropdownOptions hidden");

  const liOne = addEl("li", "");
  liOne.dataset.value = 1;
  liOne.innerHTML = `<span class="circle high"></span> 상`;

  const liTwo = addEl("li", "");
  liTwo.dataset.value = 2;
  liTwo.innerHTML = `<span class="circle medium"></span> 중`;

  const liThree = addEl("li", "");
  liThree.dataset.value = 3;
  liThree.innerHTML = `<span class="circle low"></span> 하`;

  dropdownOptions.append(liOne, liTwo, liThree);
  selected.append(selectedCircle, label);
  importanceContainer.append(selected, dropdownOptions);

  // 달력 컨테이너 생성 함수
  const finishDateContainer = addEl("div", "finishDateContainer");
  const finishDateContent = addEl(
    "input",
    "finishDateContent",
    "",
    items.date,
    "date"
  );
  // todo list 특성 (오늘기준) 이전 날짜를 허용 안하기 위함
  finishDateContent.min = today;
  // 정렬 시 date값이 있으면 선택 못하고 변경을 눌렀을 시 변경할 수 있게 disabled 속성을 추가
  items.date == "" ? null : finishDateContent.setAttribute("disabled", "");
  finishDateContainer.appendChild(finishDateContent);

  // BackLogContainer, BackLogMainContainer
  // 하나의 backLog 를 담을 컨테이너
  const backLogContainer = addEl("div", "taskContainer");
  // backLog의 컨텐츠들을 담을 main 컨테이너
  const backLogMainContainer = addEl("div", "maintaskContainer");

  // backLog에 들어갈 input Task 생성
  // backLog taskContent를 적을 input
  const backLogTaskContent = addEl(
    "input",
    "taskContent",
    "",
    items.title,
    "text"
  );
  backLogTaskContent.placeholder = "오늘 할 일을 적어주세요";
  // 정렬 시 새롭게 엘리먼트를 만드는데 만약 title 값이 있다면 변경할 수 없게 만듬
  items.title == "" ? null : backLogTaskContent.setAttribute("disabled", "");

  // 버튼을 만드는
  // 수정 버튼 생성
  const editBtn = addEl("button", "edit", "✎");
  // 삭제 버튼 생성
  const deleteBtn = addEl("button", "delete", "🗑︎");

  return {
    importanceContainer,
    dropdownOptions,
    label,
    selected,
    finishDateContainer,
    finishDateContent,
    backLogContainer,
    backLogMainContainer,
    backLogTaskContent,
    editBtn,
    deleteBtn,
  };
};

// 새로운 Task Element 생성 함수
const newElement = (items) => {
  const {
    importanceContainer,
    dropdownOptions,
    label,
    selected,
    finishDateContainer,
    finishDateContent,
    backLogContainer,
    backLogMainContainer,
    backLogTaskContent,
    editBtn,
    deleteBtn,
  } = addBackLogElement(items);

  initBackLogEvents({
    finishDateContent,
    backLogTaskContent,
    backLogContainer,
    editBtn,
    deleteBtn,
    dropdownOptions,
    selected,
    label,
    items,
  });

  backLogMainContainer.append(
    backLogTaskContent,
    importanceContainer,
    editBtn,
    deleteBtn,
    finishDateContainer
  );

  backLogContainer.appendChild(backLogMainContainer);

  return { backLogContainer };
};

export { createTask, newElement, sortTodos, today, backLogList };
