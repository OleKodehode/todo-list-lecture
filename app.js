const listContainer = document.getElementById("list-container");
const inputForm = document.getElementById("task-form");
const taskInput = document.getElementById("description-input");

let tasks = [];

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

const buildPage = (tasks) => {
  listContainer.replaceChildren();
  tasks.forEach((task) => {
    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");

    const descriptionElement = document.createElement("p");
    descriptionElement.classList.add("description");
    descriptionElement.textContent = task.description;

    taskContainer.append(descriptionElement);

    listContainer.append(taskContainer);
  });
};

const renderPage = () => {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) tasks = JSON.parse(savedTasks);
  buildPage(tasks);
};

renderPage();
