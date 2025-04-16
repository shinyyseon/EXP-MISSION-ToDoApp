import { highlightUrgentTasks } from "./initEventListeners.js";

let todos = [];

// LocalStorage 생성
const addLocalStorage = () => {
  const data = JSON.stringify(todos);
  localStorage.setItem("todoList", data);
  highlightUrgentTasks();
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
    const { backLogContainer } = newElement(item);
    backLogList.appendChild(backLogContainer);
  }
  highlightUrgentTasks();
};
