
const API_URL = "http://localhost:3000/todos";

const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const categoryInput = document.getElementById("category");
const dueDateInput = document.getElementById("dueDate");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const form = document.querySelector(".task-form");
const addTaskBtn = document.getElementById("addTask");


let editTaskId = null; 
function displayTasks(tasks, query = "") {
    taskList.innerHTML = ""; 


const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
const regex = new RegExp(escapedQuery, "gi"); 
     // create task card
tasks.forEach(task => {
        const div = document.createElement("div");
const highlight = (text) => text.replace(regex, match => `<mark>${match}</mark>`);
        div.innerHTML = `
            <h3>${highlight(task.title)}</h3>
            <p>${highlight(task.description)}</p>
            <p>Category: ${highlight(task.category)}</p>
            <p>Due: ${task.dueDate}</p>

            <label>
                Completed
                <input type="checkbox" ${task.completed ? "checked" : ""}>
            </label>

            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
            <hr>
        `;
   // check completion
div.querySelector("input[type='checkbox']").addEventListener("change", async (e) => {
            try {
                await fetch(`${API_URL}/${task.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ completed: e.target.checked })
                });
            } catch (error) {
                console.error("❌ Cannot update task");
            }
        });
       //delete task
div.querySelector(".delete").addEventListener("click", async () => {
            try {
                await fetch(`${API_URL}/${task.id}`, { method: "DELETE" });
                loadTasks(searchInput.value); 
            } catch (error) {
                console.error("❌ Cannot delete task");
            }
        });

        //edit task
        div.querySelector(".edit").addEventListener("click", () => {
            titleInput.value = task.title;
            descriptionInput.value = task.description;
            categoryInput.value = task.category;
            dueDateInput.value = task.dueDate;

            addTaskBtn.textContent = "Save Task"; 
            editTaskId = task.id; 
        });

        taskList.appendChild(div);
    });
}
     //load task from Json server
async function loadTasks(query = "") {
    try {
        const response = await fetch(`${API_URL}?q=${query}`);
        if (!response.ok) throw new Error("Server not responding");
        const data = await response.json();
        displayTasks(data, query); 
    } catch (error) {
        console.error("❌ Failed to load tasks:", error);
    }
}

     // submit task
form.addEventListener("submit", async (e) => {
    e.preventDefault();
         //get task
    const taskData = {
        title: titleInput.value,
        description: descriptionInput.value,
        category: categoryInput.value,
        dueDate: dueDateInput.value,
        completed: false
    };

    try {
        if (editTaskId) {
            
            await fetch(`${API_URL}/${editTaskId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(taskData)
            });
            editTaskId = null; 
            addTaskBtn.textContent = "Add Task"; 
        } else {
            
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(taskData)
            });
        }

        form.reset(); 
        loadTasks(searchInput.value); 
    } catch (error) {
        console.error("❌ Failed to save task");
    }
});
   // search while typing
searchInput.addEventListener("input", () => {
    loadTasks(searchInput.value);
});

loadTasks();
