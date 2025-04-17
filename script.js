import { highlightUrgentTasks, initBackLogButtons } from "./initEventListeners.js";
import { addBackLogElement, backLogList } from "./backlogTask.js";

let todos = [];

// LocalStorage 생성
const addLocalStorage = () => {
  const data = JSON.stringify(todos);
  localStorage.setItem("todoList", data);
};

// 리로드 했을 시 localStorage에 todoList 가 있다면 불러와서 JSON 형태로 만든 후 todos 에 초기화
const loadLocalStorage = () => {
  const data = localStorage.getItem("todoList");
  console.log(JSON.parse(data));
  if (data) {
    todos = JSON.parse(data);
  }
};

// 처음 로드 되었을 때 localStorage 를 확인 후 있다면 todoList를 생성
const displayTodoList = () => {
  loadLocalStorage();
  for (let i = 0; i < todos.length; i++) {
    const item = todos[i];
    const { backLogContainer } = addBackLogElement(item);
    backLogList.appendChild(backLogContainer);
  }
  highlightUrgentTasks();
};
// initEventListener 에서 import 한 todo는 상수 취급을 하기에 todo 삭제 불가능
// 해당 scripte
const todoDelete = (items) => {
  todos = todos.filter((item) => item.id !== items.id);
  addLocalStorage();
};

document.addEventListener("DOMContentLoaded", () => {
  // 초기 렌더링 시 localStorage 에 있는 데이터를 렌더링
  displayTodoList();
  initBackLogButtons();
  // 초기 렌더링 시 종료일 마감에 대한 이벤트
});

export { addLocalStorage, todoDelete, todos };
