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
   

   

   - 백로그 CRUD 함수
   - 체크리스트 본문
     
   - 완료 태스크
     



      
   



