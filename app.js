const listContainer = document.getElementById("list-container");
const inputForm = document.getElementById("task-form");
const taskInput = document.getElementById("description-input");
const completedCheckbox = document.getElementById("complete-filter");

let tasks = [];
let filters = { showCompleted: false };

completedCheckbox.addEventListener("change", (e) => {
  filters.showCompleted = e.target.checked;
  renderPage();
});

const saveTasksToStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

inputForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(inputForm);
  const userInput = formData.get("task-input");
  taskInput.value = "";

  if (!userInput)
    return alert(
      `Input field is empty\nYou can't add an empty task to the TODO list`
    );

  tasks.push({
    time: new Date(),
    description: userInput,
    isCompleted: false,
  });
  saveTasksToStorage();
  renderPage();
});

const deleteTaskButton = (task) => {
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.textContent = "Delete";

  deleteBtn.addEventListener("click", () => {
    infoModal("Are you sure you want to delete this task?", task);
  });

  return deleteBtn;
};

const editTaskButton = (task, inputElement) => {
  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-btn");
  editBtn.textContent = "Edit";

  editBtn.addEventListener("click", () => {
    inputElement.readOnly = !inputElement.readOnly;
    editBtn.textContent = inputElement.readOnly ? "Edit" : "Save";
    editBtn.classList.toggle("editing");
    task.description = inputElement.value;
    saveTasksToStorage();
  });

  return editBtn;
};

const completeTaskInput = (task) => {
  const checkboxContainer = document.createElement("div");
  checkboxContainer.classList.add("complete-task-checkbox");
  const inputElement = document.createElement("input");
  const labelElement = document.createElement("label");
  inputElement.type = "checkbox";
  inputElement.checked = task.isCompleted;
  labelElement.textContent = "Complete Task";

  inputElement.addEventListener("change", (e) => {
    task.isCompleted = e.target.checked;
    saveTasksToStorage();
    renderPage();
  });

  checkboxContainer.append(labelElement, inputElement);

  return checkboxContainer;
};

const filterTasks = (tasks) => {
  return tasks.filter((task) => filters.showCompleted || !task.isCompleted);
};

const infoModal = (msg, task) => {
  const modal = document.createElement("dialog");
  modal.classList.add("modal");

  const modalHeader = document.createElement("div");
  modalHeader.classList.add("modal-header");

  const modalHeaderBtn = document.createElement("button");
  modalHeaderBtn.classList.add("modal-header-btn");
  modalHeaderBtn.textContent = "X";
  modalHeaderBtn.addEventListener("click", () => {
    modal.remove();
  });

  modalHeader.append(modalHeaderBtn);

  const modalText = document.createElement("p");
  modalText.textContent = msg;

  const btnsContainer = document.createElement("div");
  btnsContainer.classList.add("modal-btn-container");

  const confirmBtn = document.createElement("button");
  confirmBtn.classList.add("modal-btn", "confirm");
  confirmBtn.textContent = "YES";
  confirmBtn.addEventListener("click", () => {
    const taskIndex = tasks.indexOf(task);
    if (taskIndex > -1) {
      tasks.splice(taskIndex, 1);
      saveTasksToStorage();
      modal.remove();
      renderPage();
    }
  });

  const cancelBtn = document.createElement("button");
  cancelBtn.classList.add("modal-btn", "delete-btn");
  cancelBtn.textContent = "CANCEL";
  cancelBtn.addEventListener("click", () => {
    modal.remove();
  });

  btnsContainer.append(confirmBtn, cancelBtn);

  modal.append(modalHeader, modalText, btnsContainer);

  // event listener to check if you click outside of the modal's bounding box.
  modal.addEventListener("click", (e) => {
    const rect = modal.getBoundingClientRect();
    const isInModal =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;

    if (!isInModal) {
      modal.remove();
    }
  });

  document.body.append(modal);
  modal.showModal();
};

const buildPage = (tasks) => {
  listContainer.replaceChildren();
  tasks.forEach((task) => {
    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");

    const descriptionElement = document.createElement("input");
    descriptionElement.classList.add("description");
    descriptionElement.value = task.description;
    descriptionElement.readOnly = true;

    taskContainer.append(
      descriptionElement,
      completeTaskInput(task),
      editTaskButton(task, descriptionElement),
      deleteTaskButton(task)
    );

    listContainer.append(taskContainer);
  });
};

const renderPage = () => {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) tasks = JSON.parse(savedTasks);
  buildPage(filterTasks(tasks));
};

renderPage();
