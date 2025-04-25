# EXP-MISSION-ToDoApp

## EXP 미션 소개 및 진행 상황
1. ToDo List EXP 미션
   - 기존 ToDo 앱을 확장성을 가지고 개발 진행
   - 새롭게 추가한 내용
     1) 백로그, 체크리스트 본문, 완료된 태스크 총 3가지 항목으로 분리
     2) 다크모드 기능
     3) 검색, 필터링 기능
---
2. 진행 과정
   1) draw.io 기능 계획
      - ![스크린샷 2025-04-25 오후 3 40 48](https://github.com/user-attachments/assets/d7b838d5-3345-4af3-b09a-b55287844f4a)
   2) figma 와이어 프레임
      - 기본 프레임
         - ![스크린샷 2025-04-25 오후 3 45 19](https://github.com/user-attachments/assets/6be56e41-bb3e-470c-8906-3e4d26ba3687)

      - 다크모드 프레임
         - ![스크린샷 2025-04-25 오후 3 44 10](https://github.com/user-attachments/assets/3fadfb7f-8c18-4088-8f1a-f068be1ccae8)

   3) 기능별 역할 분담
      |팀원|역할 분담|
      |------|---|
      |김우진|백로그 리스트(보여주기/추가/수정/삭제), 중요도에 따른 보여주기 변화|
      |이나영|html 및 css 디자인(다크모드 이벤트), 종료일 마감 임박시 이벤트|
      |정지연|리스트 옮기는 이벤트, 완료된건 데이터 아래에서 보여주기 & 완료된건 하이픈 처리|
      |고유림|체크리스트 본문(리스트 보여주기/수정), 검색(필터링)|
      |신용선|하위태스크(보여주기/추가/삭제), 하위테스크 체크 이벤트|
---
3. 기능 요약
    - 패키지 모듈화 작업 (최적화 및 유지 보수성을 지키기 위해 파일 분리 후 모듈화 실시)
         1. index.html : 기본적인 웹 페이지 구조
         2. css : html css 파일 패키지
            - style.css : html 스타일 css 파일
            - darkMode.css : 다크모드 기능을 위한 css 파일
         3. scripts : Javascript 파일 패키지
            - backlogTask.js : 백로그 데이터 셋 생성, 리스트 정렬, 검색, CRUD 기능을 포함한 기능의 js 파일
               - ```sortTodos()``` : 백로그 리스트 정렬 함수
               - ```createTask()``` : 새로운 태스크 데이터 생성 함수
               - ```addBackLogElement()``` : 백로그 요소 생성 함수

            - completedTask.js : 완료된 태스크 처리 js 파일
               - ```renderCompletedTasks()``` : 완료된 태스크 처리 함수

            - currentTask.js : 백로그를 통해 넘어온 데이터 기반 체크리스트 본문 CRUD 및 정렬 기능 js 파일
               - ```checkListBody()``` : 체크리스트 본문 랜더링 및 정렬 기능 함수
               - ```addCheckListBodyElement()``` : 체크리스트 요소 생성 함수
               - ```finishEdit()``` : 체크리스트 본문 수정 처리 함수
                  
            - script.js : 로컬스토리지 활용, 데이터 삭제 함수 등 데이터 및 최소 실행 작업에 대한 js 파일
               - ```saveToLocalStorage()``` : 로컬 스토리지 저장 함수
               - ```loadLocalStorage()``` : 로컬 스토리지 load 함수
               - ```displayTodoList()``` : 초기 실행 시 로컬 스토리지 데이터 기반 UI 송출
               - ```todoDelete()``` : 데이터 삭제 함수
                  
            - subTask.js : 체크리스트 본문의 각 데이터의 하위 태스크 CRUD 기능 js 파일
               - ```renderInitialSubTasks()``` : 전체 하위 태스크 초기 랜더링 함수
               - ```renderSubTaskWrapper()``` : html wrapper에 대한 하위 태스크 랜더링 함수
               - ```clearSubTaskEl()``` : 하위 태스크 요소 전체 삭제 함수
               - ```findBacklogId()``` : 백로그 ID 찾기 함수
               - ```insertSubTaskAddButton()``` : 하위 태스크 요소 삽입 함수
               - ```createSubTaskElement()``` : 하위 태스크 요소 생성 함수
               - ```initSubtaskAddButtons()``` : 하위 태스크 버튼 이벤트 연결 함수
               - ```toggleSubtask()``` : 체크리스트 본문 토글 버튼 연결

            - element.js : html element 생성 js 파일
            - initEventListeners.js : 각 파일의 이벤트 관리 js 파일 
               - 백로그 
                  - ```initBackLogEvents()``` : 전체 백로그 초기화 이벤트
                  - ```editBtnEvent()``` : 수정 버튼 이벤트
                  - ```deleteBtnEvent()``` : 삭제 버튼 이벤트
                  - ```selectedEvent()``` : 중요도 변경 이벤트
                  - ```arrowEvent()``` : 백로그 <-> 체크리스트 이동 화살표 버튼 이벤트
                  - ```searchBtnEvent()``` : 검색 기능 이벤트
                  - ```initBackLogButtons()``` : 새로운 백로그 생성 이벤트 (데이터 생성)
                  - ```highlightUrgentTasks()``` : 종료일 마감 임박 이벤트
                    
               - 체크리스트
                  - ```modBtnEvent()``` ; 수정 버튼 이벤트
                  - ```taskBtnEvent()``` : 하위 태스크 토글 버튼 이벤트
                  - ```addBtnEvent()``` : 하위 태스크 추가 버튼 이벤트
                  - ```saveEvent()``` : 수정 후 저장 이벤트

              - 하위 태스크
                 - ```initSubTaskEvents()``` : 전체 하위 태스크 이벤트 초기화
                 - ```checkboxEvent()``` : 체크박스 이벤트
                 - ```deleteEvent()``` : 삭제 버튼 이벤트
                 - ```inputConfirmEvent()``` : 하위 태스크 입력 확인 이벤트
             
              - 완료된 태스크
                 - ```completedTaskrestore()``` : 완료된 태스크 -> 체크리스트 복귀 이벤트
                 - ```initCompletedTaskEvents()``` : 완료된 태스크 삭제 이벤트

---
   - 주요 기능 코드
   <details>
   <summary>로컬 스토리지 사용</summary>
      
   ```javascript
   // localStorage에 List 저장
   const saveToLocalStorage = () => {
     localStorage.setItem("todoList", JSON.stringify(todos));
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
     sortTodos();
     highlightUrgentTasks();
   };
   ```
   </details>
   <br>

   
   <details>
   <summary>백로그 정렬 및 CRUD</summary>
      
   ```javascript
   const sortTodos = (keyword = "") => {
     const filtered = todos.filter((todo) => !todo.complete && (keyword ? todo.title.includes(keyword) : true));
     filtered.sort((a, b) => {
       // 날짜가 없는지 여부 확인 (빈 문자열 혹은 falsy 값인 경우)
       const noDateA = !a.date || a.date === "";
       const noDateB = !b.date || b.date === "";
   
       // 한쪽만 날짜가 없으면, 날짜가 없는 항목이 앞에 오도록 함
       if (noDateA && !noDateB) {
         return -1; // a가 b보다 앞에 오도록 함
       } else if (!noDateA && noDateB) {
         return 1; // b가 a보다 앞에 오도록 함
       } else {
         // 둘 다 날짜가 있는 경우: 날짜를 비교하여 정렬
         const dateA = new Date(a.date);
         const dateB = new Date(b.date);
   
         if (dateA.getTime() === dateB.getTime()) {
           // 날짜가 같으면 importance 값을 비교
           return a.importance - b.importance;
         } else {
           // 날짜를 기준으로 정렬
           return dateA - dateB;
         }
       }
     });
   
     backLogList.innerHTML = "";
     filtered.forEach((todo) => {
       const { backLogContainer } = addBackLogElement(todo);
       backLogList.appendChild(backLogContainer);
     });
     saveToLocalStorage();
     highlightUrgentTasks();
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

   // 백로그 이벤트 - edit 버튼 이벤트
   const editBtnEvent = ({ state, finishDateContent, backLogTaskContent, editBtn, items }) => {
     editBtn.addEventListener("click", () => {
       backLogTaskContent.removeAttribute("disabled");
       finishDateContent.removeAttribute("disabled");
       backLogTaskContent.focus();
       if (backLogTaskContent.value !== "" && finishDateContent.value !== "") state.editing = true;
     });
   
     // 날짜를 변경 했을 시
     finishDateContent.addEventListener("change", (e) => {
       items.date = e.target.value;
       state.date = true;
     });
   
     // 제목을 입력 시
     backLogTaskContent.addEventListener("input", (e) => {
       items.title = e.target.value;
     });
     //제목 엔티 눌렀을 떄
     backLogTaskContent.addEventListener("keydown", (e) => {
       if (e.key == "Enter") {
         if (state.editing) {
           finishDateContent.disabled = true;
           state.editing = false;
           sortTodos();
         }
         e.target.disabled = true;
         state.title = true;
         saveToLocalStorage();
       }
     });
   
     backLogTaskContent.addEventListener("blur", () => {
       if (!state.editing) {
         backLogTaskContent.disabled = items.title === "" ? false : true;
         state.title = true;
       }
       saveToLocalStorage();
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
   ```
   </details>

   <br>
   
   <details>
   <summary>체크리스트 본문 정렬 및 CRUD</summary>
      
   ```javascript
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
     window.dispatchEvent(new CustomEvent("updateBackLog"));
     saveToLocalStorage();
   };
   
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
   
   //하위 태스크 이벤트
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
   ```
   </details>

   <br>

   <details>
   <summary>완료 태스크 CRUD</summary>
      
   ```javascript
   // 완료된 태스크 아래로 옮기는 함수
   export const renderCompletedTasks = (todos) => {
       // .completedTaskContainer라는 클래스를 가진 요소를 찾아서 container 변수에 저장
       const container = document.querySelector(".completedTaskContainer");
       // 중복 생성 방지를 위해 화면 초기화
       container.innerHTML = "";
   
       // complete: true인 항목을 completed 베열에 넣기
       const completed = todos.filter(item => item.complete);
   
       // 배열을 하나씩 순회하면서 item이라는 이름으로 꺼내옴
       completed.forEach(item => {
           // div, className 만든다
           const taskItem = addEl("div", "completedTaskItem");
           const infoDiv = addEl("div", "completedTaskInfo");
           const titleDiv = addEl("div", "completedTaskTitle");
           const deleteAndButton = addEl("div", "deleteAndbutton");
           const restoreEl = addEl("button", "restore", "↩︎");
           const delBtn = addEl("button", "delete", "🗑︎", "", "");
           completedTaskrestore({ restoreEl, backlogId: item.id });
   
           // 완료된 항목에 하이픈 처리
           titleDiv.innerHTML = `<del>${item.title || "(제목 없음)"}</del>`;
   
           const dateDiv = addEl("div", "completedTaskDate", item.date);
           infoDiv.appendChild(titleDiv);
           infoDiv.appendChild(dateDiv);
   
           deleteAndButton.append(delBtn);
           deleteAndButton.append(restoreEl);
   
           taskItem.appendChild(infoDiv);
           taskItem.appendChild(deleteAndButton);
           
   
           container.appendChild(taskItem);
   
           initCompletedTaskEvents({ item, delBtn });
       });
   };
   ```
   </details>
     
     



      
   



