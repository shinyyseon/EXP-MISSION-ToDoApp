import { todos, saveToLocalStorage } from './backLog.js';

//하위 태스크 스크립트
//초기 데이터 렌더링
export const renderInitialSubTasks = () => {
  document.querySelectorAll('.currentTaskWrapper').forEach(wrapper => {
    const container = wrapper.querySelector('.subtaskContainer');
    const backlogId = wrapper.dataset.id
    const backlog = todos.find(b => b.id === backlogId);
    
    if (!backlog) return;

    backlog.list.forEach(sub => {
      const taskElement = createSubTaskElement(backlogId, sub);
      const btn = container.querySelector('.addSubtaskBtn');
      container.insertBefore(taskElement, btn);

      console.log(`[초기 렌더링] 하위 태스크 ID: ${sub.id} / 제목: ${backlog.title} / 내용: ${sub.text}`);
    });
  });
}

//체크박스 처리
const createCheckbox = (subTask, textEl) => {
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'subtaskCheck';
  checkbox.checked = !!subTask.check;

  checkbox.addEventListener('change', (e) => {
    e.stopPropagation();
    subTask.check = checkbox.checked;

    console.log(`${subTask.text} 태스크 ${checkbox.checked ? '완료' : '미완료'}`);

    if (textEl) {
      textEl.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
      textEl.style.opacity = checkbox.checked ? '0.6' : '1';
      saveToLocalStorage();
    }
  });
  return checkbox;
}

//삭제 버튼 처리
const createDeleteButton = (backlogId, container, subTask) => {
  const delBtn = document.createElement('button');
  delBtn.className = 'subtaskDelete';
  delBtn.textContent = '🗑︎';

  delBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const backlog = todos.find(item => item.id === backlogId);
    backlog.list = backlog.list.filter(item => item.id !== subTask.id);
    container.remove();
    saveToLocalStorage();

    console.log(`${subTask.text} 태스크 삭제`);
  });
  return delBtn;
}

//기존 텍스트 요소 생성
const createTextSpan = (subTask) => {
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
const createSubTaskElement = (backlogId, subTask) => {
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
const createEditableSubTaskElement = (backlogId, subTask) => {
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
    
    if (!value) {
      const backlog = todos.find(b => b.id === backlogId);
      if (backlog) {
        backlog.list = backlog.list.filter(s => s.id !== subTask.id);
        saveToLocalStorage();
      }
      div.remove();
      return;
    }

    subTask.text = value;
    saveToLocalStorage();

    const span = createTextSpan(subTask);
    input.replaceWith(span);
    const newCheckbox = createCheckbox(subTask, span);

    div.replaceChild(newCheckbox, checkbox);
    console.log(`[추가] 하위 태스크 ID: ${subTask.id} / 내용: ${subTask.text}`);
  };

  input.addEventListener('keydown', e => { if (e.key === 'Enter') confirm(); });
  input.addEventListener('blur', confirm);

  const delBtn = createDeleteButton(backlogId, div, subTask);

  div.append(checkbox, input, delBtn);
  return div;
}

//버튼 이벤트 연결
export const initSubtaskAddButtons = () => {
  console.log("현재 todos", todos);

  document.querySelectorAll('.currentTaskWrapper').forEach(wrapper => {
    const btn = wrapper.querySelector('.addSubtaskBtn');
    const container = wrapper.querySelector('.subtaskContainer');
    const backlogId = wrapper.dataset.id;

    btn.addEventListener('click', () => {
      const backlog = todos.find(b => b.id === backlogId);
      if (!backlog) return;

      const newId = Date.now();
      const newTask = { id: newId, text: '', check: false };
      backlog.list.push(newTask);
      saveToLocalStorage();

      const div = createEditableSubTaskElement(backlogId, newTask);
      container.insertBefore(div, btn);
      const input = div.querySelector('input[type="text"]');
      if (input) input.focus();
    });
  });
}