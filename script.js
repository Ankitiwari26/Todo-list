// scripts/script.js
document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const descriptionInput = document.getElementById('descriptionInput');
    const taskTable = document.getElementById('taskTable');
    const apiKey = 'eb9f7dbeabd143f9ae959a177c17f24c';

    // Function to fetch tasks from CRUDcrud
    function fetchTasks() {
        axios.get(`https://crudcrud.com/api/${apiKey}/tasks`)
            .then(response => {
                const tasks = response.data;
                displayTasks(tasks);
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
            });
    }

    // Function to display tasks in the table
    function displayTasks(tasks) {
        taskTable.innerHTML = ''; // Clear existing rows

        tasks.forEach(task => {
            const row = taskTable.insertRow();

            const taskCell = row.insertCell(0);
            taskCell.innerText = task.taskText;

            const descriptionCell = row.insertCell(1);
            descriptionCell.innerText = task.descriptionText;

            const doneCell = row.insertCell(2);
            const doneCheckbox = document.createElement('input');
            doneCheckbox.type = 'checkbox';
            doneCheckbox.checked = task.isDone; // Set checkbox state based on task data
            doneCheckbox.addEventListener('change', function () {
                updateTask(task._id, { isDone: doneCheckbox.checked });
            });
            doneCell.appendChild(doneCheckbox);

            const deleteCell = row.insertCell(3);
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.addEventListener('click', function () {
                deleteTask(task._id);
            });
            deleteCell.appendChild(deleteButton);
        });
    }

    // Function to add or update a task
    window.addTask = function () {
        const taskText = taskInput.value.trim();
        const descriptionText = descriptionInput.value.trim();

        if (taskText !== '' && descriptionText !== '') {
            // Check if the task already exists
            const existingTask = [...taskTable.getElementsByTagName('tr')]
                .find(row => row.cells[0].innerText === taskText);

            if (existingTask) {
                // If task exists, update the description
                const descriptionCell = existingTask.cells[1];
                descriptionCell.innerText = descriptionText;

                // You may want to update other properties as needed
            } else {
                // If task doesn't exist, add a new task
                axios.post(`https://crudcrud.com/api/${apiKey}/tasks`, {
                    taskText: taskText,
                    descriptionText: descriptionText,
                    isDone: false
                })
                    .then(response => {
                        // After adding the task, fetch and display all tasks
                        fetchTasks();
                    })
                    .catch(error => {
                        console.error('Error adding task:', error);
                    });
            }

            // Clear the input fields
            taskInput.value = '';
            descriptionInput.value = '';
        }
    };

    // Function to delete a task
    function deleteTask(taskId) {
        axios.delete(`https://crudcrud.com/api/${apiKey}/tasks/${taskId}`)
            .then(response => {
                // After deleting the task, fetch and display all tasks
                fetchTasks();
            })
            .catch(error => {
                console.error('Error deleting task:', error);
            });
    };

    // Function to update a task
    function updateTask(taskId, data) {
        axios.put(`https://crudcrud.com/api/${apiKey}/tasks/${taskId}`, data)
            .then(response => {
                // After updating the task, fetch and display all tasks
                fetchTasks();
            })
            .catch(error => {
                console.error('Error updating task:', error);
            });
    };

    // Fetch and display tasks when the page loads
    fetchTasks();
});
