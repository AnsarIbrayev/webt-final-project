/* Enhanced frontend script: fetch, render, sort/filter, theme + i18n hooks */
const API_URL = '/api/tasks';

const taskForm = document.getElementById('task-form');
const taskIdInput = document.getElementById('task-id');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const statusInput = document.getElementById('status');
const priorityInput = document.getElementById('priority');
const dueDateInput = document.getElementById('dueDate');
const categoryInput = document.getElementById('category');
const tagsInput = document.getElementById('tags');
const cancelEditBtn = document.getElementById('cancel-edit');
const tableBody = document.getElementById('tasks-table-body');

const sortSelect = document.getElementById('sort-select');
const filterStatus = document.getElementById('filter-status');
const filterPriority = document.getElementById('filter-priority');
const filterCategory = document.getElementById('filter-category');
const filterTags = document.getElementById('filter-tags');
const resetFiltersBtn = document.getElementById('reset-filters-btn');

let tasksCache = [];

function priorityBadgeClass(p) {
    if (p === 'high') return 'badge-priority-high';
    if (p === 'medium') return 'badge-priority-medium';
    return 'badge-priority-low';
}

function statusBadgeClass(s) {
    if (s === 'in-progress') return 'badge-status-in-progress';
    if (s === 'done') return 'badge-status-done';
    return 'badge-status-pending';
}

function renderTasks(list) {
    tableBody.innerHTML = '';
    if (!list || list.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7">No tasks yet.</td></tr>';
        return;
    }

    list.forEach(task => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${escapeHtml(task.title)}</td>
            <td><span class="${statusBadgeClass(task.status)}">${capitalize(task.status)}</span></td>
            <td><span class="${priorityBadgeClass(task.priority)}">${capitalize(task.priority)}</span></td>
            <td>${task.dueDate || '-'}</td>
            <td>${escapeHtml(task.category || '')}</td>
            <td>${escapeHtml((task.tags || []).join(', '))}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-secondary edit-btn" data-id="${task._id}">Edit</button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${task._id}">Delete</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function escapeHtml(s){ if(!s) return ''; return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function capitalize(s){ if(!s) return ''; return s.charAt(0).toUpperCase()+s.slice(1); }

async function loadTasks(){
    tableBody.innerHTML = '<tr><td colspan="7">Loading...</td></tr>';
    try{
        const res = await fetch(API_URL);
        const data = await res.json();
        tasksCache = Array.isArray(data) ? data : [];
        applyFiltersAndSort();
    }catch(e){ console.error(e); tableBody.innerHTML = '<tr><td colspan="7">Error loading tasks.</td></tr>' }
}

function applyFiltersAndSort(){
    let list = tasksCache.slice();
    const st = filterStatus?.value || '';
    const pr = filterPriority?.value || '';
    const cat = (filterCategory?.value || '').trim().toLowerCase();
    const tags = (filterTags?.value || '').trim().toLowerCase();

    if (st) list = list.filter(t => t.status === st);
    if (pr) list = list.filter(t => t.priority === pr);
    if (cat) list = list.filter(t => (t.category||'').toLowerCase().includes(cat));
    if (tags) list = list.filter(t => (t.tags||[]).join(' ').toLowerCase().includes(tags));

    const sortVal = sortSelect?.value || 'date-desc';
    if (sortVal === 'title-asc') list.sort((a,b)=> a.title.localeCompare(b.title, undefined, {numeric:true}));
    else if (sortVal === 'title-desc') list.sort((a,b)=> b.title.localeCompare(a.title, undefined, {numeric:true}));
    else if (sortVal === 'priority') {
        const order = { high: 0, medium: 1, low: 2 };
        list.sort((a,b)=> order[a.priority||'medium'] - order[b.priority||'medium']);
    }
    else if (sortVal === 'date-asc') list.sort((a,b)=> (a.dueDate||'').localeCompare(b.dueDate||''));
    else list.sort((a,b)=> (b.createdAt||'').localeCompare(a.createdAt||''));

    renderTasks(list);
}

taskForm?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const id = taskIdInput.value;
    const payload = {
        title: titleInput.value.trim(),
        description: descriptionInput.value.trim(),
        status: statusInput.value,
        priority: priorityInput.value,
        dueDate: dueDateInput.value || null,
        category: categoryInput.value.trim() || 'general',
        tags: (tagsInput.value||'').split(',').map(s=>s.trim()).filter(Boolean)
    };
    if(!payload.title){ alert('Title required'); return }
    try{
        if(id) await fetch(`${API_URL}/${id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
        else await fetch(API_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
        resetForm(); await loadTasks();
    }catch(e){ console.error(e); alert('Save failed') }
});

tableBody?.addEventListener('click', async (e)=>{
    const edit = e.target.closest('.edit-btn');
    const del = e.target.closest('.delete-btn');
    if(edit){ startEdit(edit.dataset.id); }
    if(del){ if(confirm('Delete?')){ try{ await fetch(`${API_URL}/${del.dataset.id}`,{method:'DELETE'}); await loadTasks(); }catch(e){console.error(e); alert('Delete failed')}} }
});

async function startEdit(id){ try{ const res = await fetch(`${API_URL}/${id}`); const t = await res.json(); taskIdInput.value = t._id; titleInput.value = t.title||''; descriptionInput.value = t.description||''; statusInput.value = t.status||'pending'; priorityInput.value = t.priority||'medium'; dueDateInput.value = t.dueDate||''; categoryInput.value = t.category||'general'; tagsInput.value = (t.tags||[]).join(', '); cancelEditBtn.style.display='inline-block'; }catch(e){console.error(e)} }

function resetForm(){ taskIdInput.value=''; titleInput.value=''; descriptionInput.value=''; statusInput.value='pending'; priorityInput.value='medium'; dueDateInput.value=''; categoryInput.value='general'; tagsInput.value=''; cancelEditBtn.style.display='none'; }
cancelEditBtn?.addEventListener('click', resetForm);

// filters
[sortSelect, filterStatus, filterPriority, filterCategory, filterTags].forEach(el=>{ if(!el) return; el.addEventListener('change', applyFiltersAndSort); el.addEventListener('input', applyFiltersAndSort); });
resetFiltersBtn?.addEventListener('click', ()=>{ sortSelect.value='date-desc'; filterStatus.value=''; filterPriority.value=''; filterCategory.value=''; filterTags.value=''; applyFiltersAndSort(); });

// THEME + I18N helpers
function initTheme(){ const t = localStorage.getItem('theme') || 'dark'; setTheme(t); }
function setTheme(name){ if(name==='dark') document.body.classList.add('theme-dark'); else document.body.classList.remove('theme-dark'); localStorage.setItem('theme', name); updateThemeIcon(); }
function toggleTheme(){ setTheme(document.body.classList.contains('theme-dark') ? 'light':'dark'); }
function updateThemeIcon(){ const el = document.querySelector('#theme-switcher i'); if(!el) return; if(document.body.classList.contains('theme-dark')){ el.className='bi bi-sun'; } else { el.className='bi bi-moon-stars'; } }

document.addEventListener('DOMContentLoaded', ()=>{ initTheme(); loadTasks(); document.getElementById('theme-switcher')?.addEventListener('click', toggleTheme); document.getElementById('lang-switcher')?.addEventListener('click', ()=>{ const next = (localStorage.getItem('lang')||'en')==='en'?'ru':'en'; setLanguage(next); }); });

