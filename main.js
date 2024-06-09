const addButton = document.querySelector('.creador button');
const taskInput = document.querySelector('.creador input[type="text"]');
const prioritySelect = document.querySelector('.creador select');
const taskList = document.querySelector('.listaTarea');
const filterSelect = document.querySelector('.filtros select');
const searchInput = document.querySelector('.filtros input[type="text"]');
const errorMessage = document.getElementById('error');

// Cargar tareas desde localStorage al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromLocalStorage();
});

// Añadir nueva tarea
addButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;
    if (taskText === '' || priority === '') {
        errorMessage.style.display = 'block';
        return;
    }
    errorMessage.style.display = 'none'; // Oculta el mensaje de error

    const listItem = document.createElement('li');
    listItem.className = getClassByPriority(priority);
    listItem.innerHTML = `${taskText} <button>Borrar</button>`;
    taskList.appendChild(listItem);

    // Guardar tarea en localStorage
    saveTaskToLocalStorage(taskText, priority);

    // Limpiar los campos
    taskInput.value = '';
    prioritySelect.value = '';

    // Añadir evento de borrar al nuevo botón
    listItem.querySelector('button').addEventListener('click', () => {
        listItem.remove();
        removeTaskFromLocalStorage(taskText, priority);
    });
});

// Borrar tarea existente
document.querySelectorAll('.listaTarea button').forEach(button => {
    button.addEventListener('click', (event) => {
        const taskItem = event.target.parentElement;
        const taskText = taskItem.textContent.replace('Borrar', '').trim();
        const priority = getPriorityByClass(taskItem.className);
        taskItem.remove();
        removeTaskFromLocalStorage(taskText, priority);
    });
});

// Filtrar tareas por prioridad
filterSelect.addEventListener('change', () => {
    const filterValue = filterSelect.value;
    filterTasks(filterValue, searchInput.value.trim());
});

// Buscar tareas por texto
searchInput.addEventListener('input', () => {
    filterTasks(filterSelect.value, searchInput.value.trim());
});

function getClassByPriority(priority) {
    switch (priority) {
        case 'urgente':
            return 'red';
        case 'prioritario':
            return 'orange';
        case 'no-urgente':
            return 'green';
        default:
            return '';
    }
}

function getPriorityByClass(className) {
    switch (className) {
        case 'red':
            return 'urgente';
        case 'orange':
            return 'prioritario';
        case 'green':
            return 'no-urgente';
        default:
            return '';
    }
}

function filterTasks(priority, searchText) {
    const tasks = taskList.querySelectorAll('li');
    tasks.forEach(task => {
        const matchesPriority = priority === 'todos' || task.classList.contains(getClassByPriority(priority));
        const matchesText = searchText === '' || task.textContent.toLowerCase().includes(searchText.toLowerCase());
        if (matchesPriority && matchesText) {
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    });
}

function saveTaskToLocalStorage(taskText, priority) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ taskText, priority });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTaskFromLocalStorage(taskText, priority) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.taskText !== taskText || task.priority !== priority);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.className = getClassByPriority(task.priority);
        listItem.innerHTML = `${task.taskText} <button>Borrar</button>`;
        taskList.appendChild(listItem);

        // Añadir evento de borrar al nuevo botón
        listItem.querySelector('button').addEventListener('click', () => {
            listItem.remove();
            removeTaskFromLocalStorage(task.taskText, task.priority);
        });
    });
}
