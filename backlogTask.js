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

const choiceImportance = () => {
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
};
// backLog 중요도 ( 상 중 하 ) 컨테이너 생성 함수
const addImportanceContainer = (items) => {
  const importanceContainer = document.createElement("div");
  importanceContainer.classList.add("importanceDropdown");

  const selected = document.createElement("div");
  selected.classList.add("selected");

  const selectedCircle = document.createElement("span");
  selectedCircle.classList.add("circle");

  const label = document.createElement("span");
  label.classList.add("label");
  // 처음 생성 시 중요도는 (하) 고정
  items.importance === 1
    ? ((label.innerText = "상"), selectedCircle.classList.add("high"))
    : items.importance === 2
    ? ((label.innerText = "중"), selectedCircle.classList.add("medium"))
    : ((label.innerText = "하"), selectedCircle.classList.add("low"));

  const dropdownOptions = document.createElement("ul");
  dropdownOptions.classList.add("dropdownOptions");
  dropdownOptions.classList.add("hidden");

  const liOne = document.createElement("li");
  liOne.dataset.value = 1;
  liOne.innerHTML = `<span class="circle high"></span> 상`;

  const liTwo = document.createElement("li");
  liTwo.dataset.value = 2;
  liTwo.innerHTML = `<span class="circle medium"></span> 중`;

  const liThree = document.createElement("li");
  liThree.dataset.value = 3;
  liThree.innerHTML = `<span class="circle low"></span> 하`;

  dropdownOptions.appendChild(liOne);
  dropdownOptions.appendChild(liTwo);
  dropdownOptions.appendChild(liThree);

  selected.appendChild(selectedCircle);
  selected.appendChild(label);

  importanceContainer.appendChild(selected);
  importanceContainer.appendChild(dropdownOptions);

  return {
    importanceContainer,
    selected,
    dropdownOptions,
    label,
    selectedCircle,
  };
};

// 달력 컨테이너 생성 함수
const addDateContainer = (items) => {
  const finishDateContainer = document.createElement("div");
  finishDateContainer.classList.add("finishDateContainer");

  const finishDateContent = document.createElement("input");
  finishDateContent.type = "date";
  finishDateContent.classList.add("finishDateContent");
  // todo list 특성 (오늘기준) 이전 날짜를 허용 안하기 위함
  finishDateContent.min = today;
  finishDateContent.value = items.date;

  // 정렬 시 date값이 있으면 선택 못하고 변경을 눌렀을 시 변경할 수 있게 disabled 속성을 추가
  items.date == "" ? null : finishDateContent.setAttribute("disabled", "");

  finishDateContainer.appendChild(finishDateContent);

  return { finishDateContainer, finishDateContent };
};

// BackLogContainer, BackLogMainContainer 를 만드는 함수
const addBackLogContainer = () => {
  // 하나의 backLog 를 담을 컨테이너
  const backLogContainer = document.createElement("div");
  backLogContainer.classList.add("taskContainer");
  // backLog의 컨텐츠들을 담을 main 컨테이너
  const backLogMainContainer = document.createElement("div");
  backLogMainContainer.classList.add("maintaskContainer");

  return { backLogContainer, backLogMainContainer };
};
// backLog에 들어갈 input Task 생성 함수
const addBackLogTask = (items) => {
  // backLog taskContent를 적을 input
  const backLogTaskContent = document.createElement("input");
  backLogTaskContent.classList.add("taskContent");
  backLogTaskContent.placeholder = "오늘 할 일을 적어주세요";
  backLogTaskContent.type = "text";
  backLogTaskContent.value = items.title;

  // 정렬 시 새롭게 엘리먼트를 만드는데 만약 title 값이 있다면 변경할 수 없게 만듬
  items.title == "" ? null : backLogTaskContent.setAttribute("disabled", "");
  return { backLogTaskContent };
};

// 버튼을 만드는 함수
const addButtons = () => {
  // 수정 버튼 생성
  const editBtn = document.createElement("button");
  editBtn.classList.add("edit");
  editBtn.innerText = "✎";
  // 삭제 버튼 생성
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete");
  deleteBtn.innerText = "🗑︎";

  return { editBtn, deleteBtn };
};

// 새로운 Task Element 생성 함수
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
  eventListener.changeImportant(dropdownOptions, label, selectedCircle, items);

  moveCheckEvent(backLogContainer, items);

  backLogMainContainer.appendChild(backLogTaskContent);
  backLogMainContainer.appendChild(importanceContainer);
  backLogMainContainer.appendChild(editBtn);
  backLogMainContainer.appendChild(deleteBtn);
  backLogMainContainer.appendChild(finishDateContainer);

  backLogContainer.appendChild(backLogMainContainer);

  return { backLogContainer };
};

export { createTask, choiceImportance, newElement };
