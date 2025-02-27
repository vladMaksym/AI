document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const addTaskButton = document.getElementById("addTaskButton");
    const taskList = document.getElementById("taskList");

    function fetchTasks() {
        fetch("http://localhost:5000/tasks")
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = "";
                tasks.forEach(task => {
                const li = document.createElement("li");

                const taskText = document.createElement("p");
                taskText.textContent = task.text;
                taskText.style.textDecoration = task.completed ? "line-through" : "none";

                li.appendChild(taskText);

                const completeButton = document.createElement("button");
                completeButton.textContent = "✔";
                completeButton.onclick = () => updateTask(task.id, !task.completed);

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "❌";
                deleteButton.onclick = () => deleteTask(task.id);

                li.appendChild(completeButton);
                li.appendChild(deleteButton);

                taskList.appendChild(li);
                });
            });
    }

    function addTask() {
        fetch("http://localhost:5000/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: taskInput.value })
        }).then(fetchTasks);
        taskInput.value = "";
    }

    function updateTask(id, completed) {
        fetch(`http://localhost:5000/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed })
        }).then(fetchTasks);
    }

    function deleteTask(id) {
        fetch(`http://localhost:5000/tasks/${id}`, { method: "DELETE" }).then(fetchTasks);
    }

    addTaskButton.addEventListener("click", addTask);
    fetchTasks();
});
