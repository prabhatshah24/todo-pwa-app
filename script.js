const taskcontainer = document.querySelector("#taskContainer");
const taskForm = document.querySelector("#addTaskForm");
const titleInput = document.querySelector("#taskTitle");
const deadlineInput = document.querySelector("#taskDeadline");
const priorityInput = document.querySelector("#taskPriority");

// Load tasks from localStorage or initialize empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function Task(title, deadline, priority, done = false) {
  this.title = title;
  this.deadline = deadline;
  this.priority = priority;
  this.done = done; // track if task is done
}

// Create task in DOM
function createTask({ title, deadline, priority, done }) {
  taskcontainer.insertAdjacentHTML(
    "beforeend",
    `
    <div class="card task mb-3 ${done ? "done" : ""}">
      <div class="card-body d-flex justify-content-between align-items-start">

        <div>
          <h5 class="task-title mb-1"></h5>
          <small class="text-secondary"></small>
          <div class="mt-1">
            <span class="badge priority"></span>
          </div>
        </div>

        <div class="task-actions">
          <button class="btn btn-success btn-sm me-1 done-btn">
            <i class="bi bi-check-lg"></i>
          </button>
          <button class="btn btn-danger btn-sm cancel-btn">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

      </div>
    </div>
    `
  );

  const task = taskcontainer.lastElementChild;
  task.querySelector(".task-title").textContent = title;
  task.querySelector("small").textContent = ` Deadline: ${deadline || "No deadline"}`;
  const badge = task.querySelector(".badge");
  badge.textContent = priority;
  badge.classList.add(priority.toLowerCase());
}

// Render all tasks from array
function renderTasks() {
  taskcontainer.innerHTML = "";
  tasks.forEach((task) => createTask(task));
}

// Listen for form submit
taskForm.addEventListener("submit", (e) => {
  e.preventDefault(); // prevent reload

  const title = titleInput.value.trim();
  const deadline = deadlineInput.value;
  const priority = priorityInput.value;

  if (!title) return; // simple validation

  const newTask = new Task(title, deadline, priority);
  tasks.push(newTask);
  saveTasks(); // save after adding
  createTask(newTask);

  taskForm.reset(); // clear inputs

  // Hide modal
  const modal = bootstrap.Modal.getInstance(document.getElementById("addTaskModal"));
  modal.hide();
});

// Event delegation for done/delete buttons
taskcontainer.addEventListener("click", (e) => {
  const taskElem = e.target.closest(".task");
  const index = Array.from(taskcontainer.children).indexOf(taskElem);

  if (e.target.closest(".done-btn")) {
    taskElem.classList.toggle("done");
    tasks[index].done = !tasks[index].done;
    saveTasks();
  }

  if (e.target.closest(".cancel-btn")) {
    taskElem.remove();
    tasks.splice(index, 1);
    saveTasks();
  }
});

// Render tasks on page load
window.addEventListener("DOMContentLoaded", renderTasks);
