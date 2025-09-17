// Initialize the task list from localStorage when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    ToggleEmptyState();
});

const taskList = document.getElementById('taskList');
// Function to add a new task
const emptyimage = document.querySelector('.empty-image');
const ToggleEmptyState = () => {
    if (taskList.children.length === 0) {
        emptyimage.style.display = 'block';     
    } else {
        emptyimage.style.display = 'none';
    }
};
    function addTask(evt) {
    if (evt && evt.preventDefault) {
        evt.preventDefault();
    }
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();


    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    createTaskElement(taskText);
    taskInput.value = '';
    taskInput.focus();
    saveTasks();
    ToggleEmptyState();
};

// Function to create a task element
function createTaskElement(taskText, isCompleted = false) {
    const taskList = document.getElementById('taskList');
    
    const li = document.createElement('li');
    if (isCompleted) {
        li.classList.add('task-completed');
    }

    // Create checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-checkbox');
    checkbox.checked = isCompleted;
    checkbox.addEventListener('change', toggleTaskComplete);
    
    // Create task text span
    const taskSpan = document.createElement('span');
    taskSpan.classList.add('task-text');
    taskSpan.textContent = taskText;
    taskSpan.addEventListener('dblclick', startEditing);
    
    // Create edit button
    const editBtn = document.createElement('button');
    editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    editBtn.classList.add('edit-btn');
    editBtn.addEventListener('click', startEditing);
    
    // Create delete button
    const deleteBtn = document.createElement('button');
      deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', deleteTask);
    
    // Create button container
    const buttonContainer = document.createElement('div'); 
    buttonContainer.classList.add('task-buttons');
    buttonContainer.appendChild(editBtn);
    buttonContainer.appendChild(deleteBtn);
    
    // Append all elements to the list item
    li.appendChild(checkbox);
    li.appendChild(taskSpan);
    li.appendChild(buttonContainer);
    
    // Append the list item to the list
    taskList.appendChild(li);
}

// Function to toggle task completion
function toggleTaskComplete(event) {
    const li = event.target.parentElement;
    li.classList.toggle('task-completed');
    saveTasks();
}

// Function to start editing a task
function startEditing(event) {
    const li = event.target.closest('li');
    const taskSpan = li.querySelector('.task-text');
    const currentText = taskSpan.textContent;
    
    // Create input field
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.classList.add('task-edit-input');
    editInput.value = currentText;
    
    // Create save button
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.classList.add('save-btn');
    saveBtn.addEventListener('click', function() {
        finishEditing(li, editInput.value);
    });
    
    // Replace span with input field and add save button
    li.replaceChild(editInput, taskSpan);
    
    const buttonContainer = li.querySelector('.task-buttons');
    buttonContainer.innerHTML = ''; // Clear existing buttons
    buttonContainer.appendChild(saveBtn);
    
    // Focus on the input field
    editInput.focus();
}

// Function to finish editing a task
function finishEditing(li, newText) {
    if (newText.trim() === '') {
        alert('Task cannot be empty!');
        return;
    }
    
    // Create new span with updated text
    const newSpan = document.createElement('span');
    newSpan.classList.add('task-text');
    newSpan.textContent = newText.trim();
    newSpan.addEventListener('dblclick', startEditing);
    
    // Create edit button
    const editBtn = document.createElement('button');
    editBtn.innerHTML='<i class="fa-solid fa-pen"></i>';
        editBtn.classList.add('edit-btn');
    editBtn.addEventListener('click', startEditing);
    
    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', deleteTask);
    
    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('task-buttons');
    buttonContainer.appendChild(editBtn);
    buttonContainer.appendChild(deleteBtn);
    
    // Replace input field with new span and restore buttons
    const inputField = li.querySelector('.task-edit-input');
    li.replaceChild(newSpan, inputField);
    li.querySelector('.task-buttons').replaceWith(buttonContainer);
    
    saveTasks();
}

// Function to delete a task
function deleteTask(event) {
    const li = event.target.closest('li');
    li.remove();
    saveTasks();
    ToggleEmptyState();
}

// Function to save tasks to localStorage
function saveTasks() {
    const tasks = [];
    const taskElements = document.querySelectorAll('#taskList li');
    
    taskElements.forEach(taskElement => {
        const text = taskElement.querySelector('.task-text').textContent;
        const isCompleted = taskElement.classList.contains('task-completed');
        tasks.push({ text, completed: isCompleted });
    });
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    savedTasks.forEach(task => {
        createTaskElement(task.text, task.completed);
    });
    ToggleEmptyState();
}

// Add task when Enter key is pressed
document.getElementById('taskInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask(event);
    }
});
document.getElementById('taskForm').addEventListener('submit', addTask);