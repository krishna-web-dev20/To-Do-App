const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const counter = document.getElementById("counter");
const emptyMsg = document.getElementById("emptyMsg");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// SAVE
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ADD TASK (with ID 🔥)
function addTask() {
  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(), // unique id
    text: text,
    completed: false
  });

  input.value = "";
  saveTasks();
  renderTasks();
}

// DELETE
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// TOGGLE
function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

// FILTER
function setFilter(filter) {
  currentFilter = filter;
  renderTasks();
}

// DARK MODE
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

// RENDER
function renderTasks() {
  list.innerHTML = "";

  const search = searchInput ? searchInput.value.toLowerCase() : "";

  let filtered = tasks.filter(task => {
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "pending") return !task.completed;
    return true;
  });

  filtered = filtered.filter(task =>
    task.text.toLowerCase().includes(search)
  );

  filtered.forEach(task => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.innerText = task.text;

    if (task.completed) {
      span.style.textDecoration = "line-through";
      span.style.color = "gray";
    }

    span.onclick = () => toggleTask(task.id);

    const delBtn = document.createElement("button");
    delBtn.innerText = "Delete";

    delBtn.onclick = (e) => {
      e.stopPropagation();
      deleteTask(task.id);
    };

    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });

  // COUNTER
  if (counter) {
    counter.innerText = `Total Tasks: ${tasks.length}`;
  }

  // EMPTY MESSAGE
  if (emptyMsg) {
    emptyMsg.style.display = filtered.length === 0 ? "block" : "none";
  }
}

// EVENTS
addBtn.addEventListener("click", addTask);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

if (searchInput) {
  searchInput.addEventListener("input", renderTasks);
}

// LOAD
renderTasks();