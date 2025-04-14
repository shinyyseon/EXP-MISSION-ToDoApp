//하위 태스크 스크립트

//초기 데이터 렌더링
function renderInitialSubTasks() {
  document.querySelectorAll('.taskCard').forEach(wrapper => {
    const container = wrapper.querySelector('.subtaskContainer');
    const backlogId = parseInt(wrapper.dataset.id, 10);
    const backlog = data.find(b => b.id === backlogId);
    if (!backlog) return;

    backlog.list.forEach(sub => {
      const taskElement = createSubTaskElement(backlogId, sub);
      const btn = container.querySelector('.addSubtaskBtn');
      container.insertBefore(taskElement, btn);

      console.log(`[초기 렌더링] 하위 태스크 ID: ${sub.id} / 내용: ${sub.text} / 체크: ${sub.check}`);
    });
  });
}

//체크박스 처리
function createCheckbox(subTask, textEl) {
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'subtaskCheck';
  checkbox.checked = subTask.check;

  checkbox.addEventListener('change', (e) => {
    e.stopPropagation();
    subTask.check = checkbox.checked;

    console.log(`${subTask.text} 태스크 ${checkbox.checked ? '완료' : '미완료'}`);

    if (textEl) {
      textEl.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
      textEl.style.opacity = checkbox.checked ? '0.6' : '1';
    }
  });

  return checkbox;
}

//삭제 버튼 처리
function createDeleteButton(backlogId, container, subTask) {
  const delBtn = document.createElement('button');
  delBtn.className = 'subtaskDelete';
  delBtn.textContent = '🗑︎';

  delBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const backlog = data.find(item => item.id === backlogId);
    backlog.list = backlog.list.filter(item => item.id !== subTask.id);
    container.remove();

    console.log(`${subTask.text} 태스크 삭제`);
  });

  return delBtn;
}

//기존 텍스트 요소 생성
function createTextSpan(subTask) {
  const textSpan = document.createElement('span');
  textSpan.className = 'subtaskText';
  textSpan.textContent = subTask.text;

  if (subTask.check) {
    textSpan.style.textDecoration = 'line-through';
    textSpan.style.opacity = '0.6';
  }

  return textSpan;
}

//기존 하위 태스크 요소 생성
function createSubTaskElement(backlogId, subTask) {
  const div = document.createElement('div');
  div.className = 'subtaskItem';
  div.setAttribute('data-sub-id', subTask.id);

  const textSpan = createTextSpan(subTask);
  const checkbox = createCheckbox(subTask, textSpan);
  const delBtn = createDeleteButton(backlogId, div, subTask);

  div.append(checkbox, textSpan, delBtn);
  return div;
}

//입력 가능한 새 태스크 요소 생성
function createEditableSubTaskElement(backlogId, subTask) {
  const div = document.createElement('div');
  div.className = 'subtaskItem';
  div.setAttribute('data-sub-id', subTask.id);

  const checkbox = createCheckbox(subTask);

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'subtaskText';
  input.style = 'width: 100%; text-align: center; border: none; outline: none; background: transparent;';

  let isConfirmed = false;
  const confirm = () => {
    if (isConfirmed) return;
    isConfirmed = true;

    const value = input.value.trim();
    if (!value) return;
    subTask.text = value;

    const span = createTextSpan(subTask);
    input.replaceWith(span);
    createCheckbox(subTask, span);

    console.log(`[추가] 하위 태스크 ID: ${subTask.id} / 내용: ${subTask.text}`);
  };

  input.addEventListener('keydown', e => { if (e.key === 'Enter') confirm(); });
  input.addEventListener('blur', confirm);

  const delBtn = createDeleteButton(backlogId, div, subTask);

  div.append(checkbox, input, delBtn);
  return div;
}

//버튼 이벤트 연결
function initSubtaskAddButtons() {
  document.querySelectorAll('.taskCard').forEach(wrapper => {
    const btn = wrapper.querySelector('.addSubtaskBtn');
    const container = wrapper.querySelector('.subtaskContainer');
    const backlogId = parseInt(wrapper.dataset.id, 10);

    btn.addEventListener('click', () => {
      const backlog = data.find(b => b.id === backlogId);
      if (!backlog) return;

      const newId = Date.now();
      const newTask = { id: newId, text: '', check: false };
      backlog.list.push(newTask);

      const div = createEditableSubTaskElement(backlogId, newTask);
      container.insertBefore(div, btn);
      const input = div.querySelector('input[type="text"]');
      if (input) input.focus();
    });
  });
}

//실행
window.addEventListener("DOMContentLoaded", () => {
  renderInitialSubTasks();
  initSubtaskAddButtons();
});
