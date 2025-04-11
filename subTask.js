  //테스트를 위한 더미 데이터
  const data = [
    {
      id: 1,
      title: "첫 번째 항목",
      importance: 1,
      moveCheck: true,
      complet: false,
      date: "2025-04-07",
      list: [
        { id: 101, text: "할 일 1", check: false },
        { id: 102, text: "할 일 2", check: true }
      ]
    },

    {
      id: 2,
      title: "두 번째 항목",
      importance: 2,
      moveCheck: true,
      complet: false,
      date: "2025-04-07",
      list: [
        { id: 101, text: "할 일 3", check: false },
        { id: 102, text: "할 일 4", check: true }
      ]
    }
  ];

// 하위태스크 접기/펼치기 토글
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtns = document.querySelectorAll(".toggleSubtask");

  toggleBtns.forEach((toggleBtn) => {
    toggleBtn.addEventListener("click", () => {
      const wrapper = toggleBtn.closest(".currentTaskWrapper");
      const subtaskContainer = wrapper.querySelector(".subtaskContainer");

      subtaskContainer.classList.toggle("hidden");

      toggleBtn.textContent = subtaskContainer.classList.contains("hidden")
        ? "▼"
        : "▲";

      // 펼쳐질 경우 자동 스크롤
      if (!subtaskContainer.classList.contains("hidden")) {
        subtaskContainer.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      }
    });
  });
});

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

// 다크모드
document.addEventListener("DOMContentLoaded", () => {
  const toggleCheckbox = document.getElementById("toggle");

  toggleCheckbox.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode", toggleCheckbox.checked);
  });
});

//하위 태스크 코드

//기존 데이터 기반으로 하위 태스크 렌더링
function renderInitialSubTasks() {
  document.querySelectorAll('.currentTaskWrapper').forEach(wrapper => {
    const container = wrapper.querySelector('.subtaskContainer');
    const backlogId = parseInt(wrapper.dataset.id, 10);
    const backlog = data.find(b => b.id === backlogId);
    if (!backlog) return;

    backlog.list.forEach(sub => {
      const div = createSubTaskElement(backlog.id, sub);
      const btn = container.querySelector('.addSubtaskBtn');
      container.insertBefore(div, btn);

      console.log(`[초기 렌더링] 하위 태스크 ID: ${sub.id} / 내용: ${sub.text} / 체크: ${sub.check}`);
    });
  });
}

//새로운 하위 태스크 추가
function addSubTaskToUI(backlogId, subTaskText, container) {
  const backlogData = data.find(item => item.id === backlogId);
  if (!container || !backlogData) return;

  const newSubTaskId = Date.now();
  const newSubTask = { id: newSubTaskId, text: subTaskText, check: false };
  backlogData.list.push(newSubTask);

  const div = createSubTaskElement(backlogId, newSubTask);
  const btn = container.querySelector('.addSubtaskBtn');
  container.insertBefore(div, btn);

  console.log("[추가] 하위 태스크 ID: " + newSubTaskId + " / 하위 태스크 내용: " + subTaskText + " / 체크박스 여부: false");
}

//하위 태스크 요소 생성
function createSubTaskElement(backlogId, subTask) {
  const div = document.createElement('div');
  div.className = 'subtaskItem';
  div.setAttribute('data-sub-id', subTask.id);

  const checkboxEl = document.createElement('input');
  checkboxEl.type = 'checkbox';
  checkboxEl.className = 'subtaskCheck';
  checkboxEl.checked = subTask.check;

  const textSpan = document.createElement('span');
  textSpan.className = 'subtaskText';
  textSpan.textContent = subTask.text;
  if (subTask.check) {
    textSpan.style.textDecoration = 'line-through';
    textSpan.style.opacity = '0.6';
  }

  subTaskCheckbox(subTask, checkboxEl, textSpan);

  const delBtn = document.createElement('button');
  delBtn.className = 'subtaskDelete';
  delBtn.textContent = '🗑︎';

  delBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const backlog = data.find(item => item.id === backlogId);
    backlog.list = backlog.list.filter(item => item.id !== subTask.id);
    div.remove();
    console.log(subTask.text + " 태스크 삭제");
  });

  div.appendChild(checkboxEl);
  div.appendChild(textSpan);
  div.appendChild(delBtn);

  return div;
}

//체크박스 처리
function subTaskCheckbox(subTask, checkboxEl, textEl) {
  checkboxEl.addEventListener('change', (e) => {
    e.stopPropagation();
    subTask.check = checkboxEl.checked;

    if(!subTask.check)  console.log(subTask.text + " 태스크 미완료");
    else                console.log(subTask.text +" 태스크 완료");

    if (checkboxEl.checked) {
      textEl.style.textDecoration = 'line-through';
      textEl.style.opacity = '0.6';
    } else {
      textEl.style.textDecoration = 'none';
      textEl.style.opacity = '1';
    }
  });
}

//현재 태스크 내의 모든 + 버튼에 이벤트 연결
document.querySelectorAll('.currentTaskWrapper').forEach(wrapper => {
  const btn = wrapper.querySelector('.addSubtaskBtn');
  const container = wrapper.querySelector('.subtaskContainer');
  const backlogId = 1;

  btn.addEventListener('click', () => {
    const newText = prompt('하위 태스크 내용을 입력하세요');
    if (newText) addSubTaskToUI(backlogId, newText, container);
  });
});

//초기 렌더링
renderInitialSubTasks();
