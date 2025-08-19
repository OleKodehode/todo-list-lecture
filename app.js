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
      "Input field is empty - You can't add an empty task to the todo list"
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
    const taskIndex = tasks.indexOf(task);
    if (taskIndex > -1) {
      tasks.splice(taskIndex, 1);
      saveTasksToStorage();
      renderPage();
    }
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
    task.description = inputElement.value;
    saveTasksToStorage();
  });

  return editBtn;
};

const completeTaskInput = (task) => {
  const inputElement = document.createElement("input");
  inputElement.type = "checkbox";
  inputElement.checked = task.isCompleted;

  inputElement.addEventListener("change", (e) => {
    task.isCompleted = e.target.checked;
    saveTasksToStorage();
    renderPage();
  });

  return inputElement;
};

const filterTasks = (tasks) => {
  return tasks.filter((task) => filters.showCompleted || !task.isCompleted);
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
      deleteTaskButton(task),
      editTaskButton(task, descriptionElement)
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
