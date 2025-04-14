# EXP-MISSION-ToDoApp / backLog
---
### 함수 목록
1. createTask() : 새로운 Task(Todo item) 을 생성 
2. addImportanceContainer() : 중요도 관련 컨테이너 생성
3. addDateContainer() : backLog에 들어가는 달력 컨테이너 생성
4. addBackLogContainer() : backLogContainer 컨테이너 생성
5. addBackLogTask() : backLog 에 들어간 input 생성
6. addButtons() : 버튼 (edit, delete) 생성
7. newElement() : 새로운 엘리먼트 생성 
8. sortTodos() : todos 를 날짜 순 (같다면 중요도 순)으로 정렬 함수 
9. addLocalStorage() : localStorage 생성
10. loadLocalStorage() : localStorage 를 읽는 함수 (localStorage에 item이 존재한다면 todos에 저장)
11. displayTodoList() : 웹 페이지 리로드 시 loadLocalStorage 함수를 호출 후 존재한다면 새롭게 backLogContainer 에 그려 생성

### 객체
1. eventListener : 모든 이벤트 함수를 담아둔 객체
---
### Data 기본 구조
```ruby
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
```
---
### 새로운 element 생성
모든 그리는 함수 (createElement)를 전부 함수화 시키고 newElement() 함수에서 전부 호출 시킴
이벤트 또한 그리는 함수(add*)에 존재하는 것이 아닌 하나의 함수에서 관리

```ruby
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
  eventListener.clickImportant(selected, dropdownOptions);
  eventListener.changeImportant(dropdownOptions, label, selectedCircle, items);

  backLogMainContainer.appendChild(backLogTaskContent);
  backLogMainContainer.appendChild(importanceContainer);
  backLogMainContainer.appendChild(editBtn);
  backLogMainContainer.appendChild(deleteBtn);
  backLogMainContainer.appendChild(finishDateContainer);

  backLogContainer.appendChild(backLogMainContainer);

  return { backLogContainer };
};
```
---
### eventListener
이벤트를 하나하나 생성하는 것이 아닌 객체로 만들어서 사용성을 증가시킴
사용시 `eventListener.원하는 이벤트()` 로 사용 가능
```ruby
// 이벤트리스너를 모아둔 객체
const eventListener = {
  // 날짜를 변경 했을 시
  changeDate: (dateInputElement, items) => {
    dateInputElement.addEventListener("change", (e) => {
      items.date = e.target.value;
      sortTodos();
      addLocalStorage();
    });
  },
  // 제목을 입력 시
  createTitle: (taskInputElement, items) => {
    taskInputElement.addEventListener("input", (e) => {
      items.title = e.target.value;
      addLocalStorage();
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
    });
  },
  // delete 버튼 클릭 시
  clickDelete: (deleteBtn, backLogContainer, items) => {
    deleteBtn.addEventListener("click", (e) => {
      backLogList.removeChild(backLogContainer);
      todos = todos.filter((item) => item.id !== items.id);
      addLocalStorage();
    });
  },
  // 중요도 클릭 시
  clickImportant: (selectedElement, dropDownElement) => {
    selectedElement.addEventListener("click", () => {
      // display에 따른 3항 연산자
      dropDownElement.style.display =
        dropDownElement.style.display === "none" ? "block" : "none";
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
        dropDownElement.style.display = "none"; // 클릭 시 드롭다운 메뉴 닫기
        selectedCircle.classList.remove("low");
        selectedCircle.classList.remove("medium");
        selectedCircle.classList.remove("high");
        // 중요도 1, 2, 3 에 대해 그때에 해당하는 스타일을 보여주는 삼항 연산자
        items.importance === 1
          ? ((label.innerText = "상"), selectedCircle.classList.add("high"))
          : items.importance === 2
          ? ((label.innerText = "중"), selectedCircle.classList.add("medium"))
          : ((label.innerText = "하"), selectedCircle.classList.add("low"));
        sortTodos();
        addLocalStorage();
      });
    });
  },
  // addTask 버튼을 누를 시 이벤트 발생
  clickAddTask: (addTaskBtn) => {
    addTaskBtn.addEventListener("click", () => {
      createTask();
      addLocalStorage();
    });
  },
}
```