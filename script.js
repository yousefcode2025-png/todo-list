// ==== Part 1: Basic Todo Logic ====

// Select elements
const input = document.getElementById("todo-input");
const addBtn = document.getElementsByClassName("add-btn")[0];
const todoListDiv = document.querySelector(".todo-list");
const clearAllBtn = document.querySelector(".clear-btn");

// Our main list in memory
let todos = [];

// Add or Edit
addBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return alert("Please enter a valid task!");

  const editId = addBtn.dataset.id;

  if (editId) {
    // Update existing
    todos = todos.map((t) =>
      t.id == editId ? { ...t, title: text } : t
    );
    addBtn.value = "Add";
    addBtn.removeAttribute("data-id");
  } else {
    // Add new (include date)
    const now = new Date();
    const dateString = now.toLocaleString(); // Example: "10/29/2025, 9:42 PM"

    todos.push({
      id: Date.now(),
      title: text,
      done: false,
      date: dateString, // 🕒 new field
    });
  }

  input.value = "";
  renderTodos();
});

// ==== Part 2: Render ====

function renderTodos() {
  todoListDiv.innerHTML = "";

  todos.forEach((todo) => {
    const item = document.createElement("div");
    item.className = "todo-item";
    item.dataset.id = todo.id;

    item.innerHTML = `
      <input type="checkbox" ${todo.done ? "checked" : ""}>
      <div class="todo-content">
        <span class="todo-text">${todo.title}</span>
        <small class="todo-date" style="color: gray; display: block; font-size: 0.8em;">
          Added on: ${todo.date || "Unknown date"}
        </small>
      </div>
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    `;

    todoListDiv.appendChild(item);
  });

  saveTodos(); // auto-save
}

// ==== Part 3: Handle edit, delete, check ====

todoListDiv.addEventListener("click", (e) => {
  const parent = e.target.closest(".todo-item");
  if (!parent) return;
  const id = Number(parent.dataset.id);

  if (e.target.classList.contains("delete-btn")) {
    todos = todos.filter((t) => t.id !== id);
  } else if (e.target.classList.contains("edit-btn")) {
    const text = parent.querySelector(".todo-text").textContent;
    input.value = text;
    addBtn.value = "Update";
    addBtn.dataset.id = id;
  } else if (e.target.type === "checkbox") {
    todos = todos.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    );
  }
  renderTodos();
});

// ==== Part 4: Clear all ====

clearAllBtn.addEventListener("click", () => {
  todos = [];
  renderTodos();
});

// ==== Part 5: LocalStorage integration ====

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
  const saved = JSON.parse(localStorage.getItem("todos")) || [];
  todos = saved;
  renderTodos();
}

// Load saved data when page opens
loadTodos();
