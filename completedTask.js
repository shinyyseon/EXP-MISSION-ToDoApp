import { addEl } from "./element.js";

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
        const titleDiv = addEl("div", "completedTaskTitle");
        // 완료된 항목에 하이픈 처리
        titleDiv.innerHTML = `<del>${item.title || "(제목 없음)"}</del>`;

        const dateDiv = addEl("div", "completedTaskDate", item.date);

        taskItem.appendChild(titleDiv);
        taskItem.appendChild(dateDiv);
        container.appendChild(taskItem);
    });
};