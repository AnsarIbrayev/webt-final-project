const API_URL = '/api/tasks';

const taskForm = document.getElementById('task-form');
const taskIdInput = document.getElementById('task-id');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const statusInput = document.getElementById('status');
const cancelEditBtn = document.getElementById('cancel-edit');
const tableBody = document.getElementById('tasks-table-body');

// --- READ: загрузка всех задач ---
async function loadTasks() {
    tableBody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';

    try {
        const res = await fetch(API_URL);
        const tasks = await res.json();

        if (!Array.isArray(tasks) || tasks.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4">No tasks yet.</td></tr>';
            return;
        }

        tableBody.innerHTML = '';

        tasks.forEach(task => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${task.title}</td>
                <td>${task.description || ''}</td>
                <td>${task.status}</td>
                <td>
                    <button data-id="${task._id}" class="edit-btn">Edit</button>
                    <button data-id="${task._id}" class="delete-btn">Delete</button>
                </td>
            `;

            tableBody.appendChild(tr);
        });

    } catch (err) {
        console.error(err);
        tableBody.innerHTML = '<tr><td colspan="4">Error loading tasks.</td></tr>';
    }
}

// --- CREATE / UPDATE ---
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = taskIdInput.value;
    const payload = {
        title: titleInput.value.trim(),
        description: descriptionInput.value.trim(),
        status: statusInput.value
    };

    if (!payload.title) {
        alert('Title is required');
        return;
    }

    try {
        if (id) {
            // UPDATE
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            // CREATE
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        resetForm();
        await loadTasks();

    } catch (err) {
        console.error(err);
        alert('Error saving task');
    }
});

// --- DELETE & EDIT кнопки (делегирование) ---
tableBody.addEventListener('click', async (e) => {
    const editBtn = e.target.closest('.edit-btn');
    const deleteBtn = e.target.closest('.delete-btn');

    if (editBtn) {
        const id = editBtn.dataset.id;
        startEdit(id);
    }

    if (deleteBtn) {
        const id = deleteBtn.dataset.id;
        if (confirm('Delete this task?')) {
            try {
                await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                await loadTasks();
            } catch (err) {
                console.error(err);
                alert('Error deleting task');
            }
        }
    }
});

// --- Начать редактирование ---
async function startEdit(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        const task = await res.json();

        taskIdInput.value = task._id;
        titleInput.value = task.title || '';
        descriptionInput.value = task.description || '';
        statusInput.value = task.status || 'pending';

        cancelEditBtn.style.display = 'inline-block';
    } catch (err) {
        console.error(err);
        alert('Error loading task for edit');
    }
}

// --- Сброс формы ---
function resetForm() {
    taskIdInput.value = '';
    titleInput.value = '';
    descriptionInput.value = '';
    statusInput.value = 'pending';
    cancelEditBtn.style.display = 'none';
}

cancelEditBtn.addEventListener('click', resetForm);

// загрузить список при открытии страницы
loadTasks();
