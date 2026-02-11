let authMode = "login"; // login | register

const API_URL = "/api/tasks";

const el = (id) => document.getElementById(id);

const taskForm = el("task-form");
const taskIdInput = el("task-id");
const titleInput = el("title");
const descriptionInput = el("description");
const statusInput = el("status");
const priorityInput = el("priority");
const dueDateInput = el("dueDate");
const categoryInput = el("category");
const tagsInput = el("tags");

const cancelEditBtn = el("cancel-edit");
const tableBody = el("tasks-table-body");
const emptyState = el("empty-state");

// Filters
const filterSort = el("filter-sort");
const filterStatus = el("filter-status");
const filterPriority = el("filter-priority");
const filterCategory = el("filter-category");
const filterTags = el("filter-tags");
const resetFiltersBtn = el("reset-filters");

// Auth UI
const loginBtn = el("login-btn");
const logoutBtn = el("logout-btn");
const doLoginBtn = el("do-login");
const loginEmail = el("login-email");
const loginPassword = el("login-password");

const themeToggle = el("theme-toggle");
const langToggle = el("lang-toggle");

let loginModal = null;
if (window.bootstrap) loginModal = new bootstrap.Modal(document.getElementById("loginModal"));

let allTasks = [];
let isLoggedIn = false;

// initialize theme from localStorage (default light). Force light on load to ensure white background.
localStorage.setItem('theme', 'light');
document.body.classList.remove('theme-dark');
// ensure icon reflects state
updateThemeIcon();

function updateThemeIcon() {
  if (!themeToggle) return;
  const icon = themeToggle.querySelector('.icon');
  if (!icon) return;
  const isDark = document.body.classList.contains('theme-dark');
  icon.textContent = isDark ? '🌙' : '☀️';
  themeToggle.title = isDark ? 'Switch to light' : 'Switch to dark';
}

// set initial icon
updateThemeIcon();

// ---------- helpers ----------
function setAuthUI(logged) {
  isLoggedIn = logged;
  if (logged) {
    loginBtn.classList.add("d-none");
    logoutBtn.classList.remove("d-none");
  } else {
    loginBtn.classList.remove("d-none");
    logoutBtn.classList.add("d-none");
  }
}

function showLoginModal() {
  if (loginModal) loginModal.show();
  else alert("Go to /login (modal not available)");
}

function formatDate(d) {
  if (!d) return "-";
  try {
    return new Date(d).toISOString().slice(0, 10);
  } catch {
    return "-";
  }
}

function pillStatus(s) {
  if (typeof t === 'function') {
    if (s === "done") return `<span class="pill green">${t('status_done')}</span>`;
    if (s === "in-progress") return `<span class="pill yellow">${t('status_in_progress')}</span>`;
    return `<span class="pill gray">${t('status_pending')}</span>`;
  }
  if (s === "done") return `<span class="pill green">Done</span>`;
  if (s === "in-progress") return `<span class="pill yellow">In Progress</span>`;
  return `<span class="pill gray">Pending</span>`;
}

function pillPriority(p) {
  if (typeof t === 'function') {
    if (p === "high") return `<span class="pill red">${t('priority_high')}</span>`;
    if (p === "medium") return `<span class="pill blue">${t('priority_medium')}</span>`;
    return `<span class="pill gray">${t('priority_low')}</span>`;
  }
  if (p === "high") return `<span class="pill red">High</span>`;
  if (p === "medium") return `<span class="pill blue">Medium</span>`;
  return `<span class="pill gray">Low</span>`;
}

function normalizeStr(x) {
  return String(x || "").trim().toLowerCase();
}

function parseTags(t) {
  if (Array.isArray(t)) return t.map(String);
  if (!t) return [];
  return String(t)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

async function safeJson(res) {
  try { return await res.json(); } catch { return null; }
}

// ---------- auth ----------
async function checkMe() {
  // optional endpoint: /me
  const res = await fetch("/me").catch(() => null);
  if (!res || !res.ok) {
    setAuthUI(false);
    return;
  }
  const data = await safeJson(res);
  setAuthUI(!!data);
}

loginBtn.addEventListener("click", showLoginModal);

doLoginBtn.addEventListener("click", async () => {
  const email = loginEmail.value;
  const password = loginPassword.value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
  });

  if (res.ok) {
    if (loginModal) loginModal.hide();
    setAuthUI(true);
    await loadTasks();
  } else {
    alert(typeof t === 'function' ? t('invalid_credentials') : "Invalid credentials");
  }
});

logoutBtn.addEventListener("click", async () => {
  await fetch("/logout", { method: "POST" }).catch(() => null);
  setAuthUI(false);
});

// ---------- tasks ----------
async function loadTasks() {
  const res = await fetch(API_URL).catch(() => null);
  if (!res) { allTasks = []; render(); return; }

  if (res.status === 401) {
    setAuthUI(false);
    allTasks = [];
    render();
    return;
  }

  const data = await safeJson(res);

  // поддержка старого/нового формата
  if (Array.isArray(data)) allTasks = data;
  else allTasks = Array.isArray(data?.items) ? data.items : [];

  render();
}

function applyFilters(tasks) {
  let out = [...tasks];

  // status
  const st = filterStatus.value;
  if (st) out = out.filter(t => t.status === st);

  // priority
  const pr = filterPriority.value;
  if (pr) out = out.filter(t => (t.priority || "medium") === pr);

  // category contains
  const cat = normalizeStr(filterCategory.value);
  if (cat) out = out.filter(t => normalizeStr(t.category).includes(cat));

  // tags contains
  const tagQ = normalizeStr(filterTags.value);
  if (tagQ) {
    out = out.filter(t => {
      const tags = parseTags(t.tags).map(normalizeStr);
      return tags.some(x => x.includes(tagQ));
    });
  }

  // sorting
  const sort = filterSort.value;
  if (sort) {
    const prRank = (p) => (p === "high" ? 3 : p === "medium" ? 2 : 1);
    const stRank = (s) => (s === "done" ? 3 : s === "in-progress" ? 2 : 1);

    if (sort === "newest") out.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sort === "oldest") out.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sort === "title_asc") out.sort((a,b) => normalizeStr(a.title).localeCompare(normalizeStr(b.title), undefined, { numeric: true, sensitivity: 'base' }));
    else if (sort === "title_desc") out.sort((a,b) => normalizeStr(b.title).localeCompare(normalizeStr(a.title), undefined, { numeric: true, sensitivity: 'base' }));
    else if (sort === "priority_asc") out.sort((a,b) => prRank(a.priority || "medium") - prRank(b.priority || "medium"));
    else if (sort === "priority_desc") out.sort((a,b) => prRank(b.priority || "medium") - prRank(a.priority || "medium"));
    else if (sort === "status_asc") out.sort((a,b) => stRank(a.status || "pending") - stRank(b.status || "pending"));
    else if (sort === "status_desc") out.sort((a,b) => stRank(b.status || "pending") - stRank(a.status || "pending"));
    else if (sort === "due_asc") out.sort((a,b) => (a.dueDate ? new Date(a.dueDate) : Infinity) - (b.dueDate ? new Date(b.dueDate) : Infinity));
    else if (sort === "due_desc") out.sort((a,b) => (b.dueDate ? new Date(b.dueDate) : -Infinity) - (a.dueDate ? new Date(a.dueDate) : -Infinity));
    else if (sort === "category_asc") out.sort((a,b) => normalizeStr(a.category).localeCompare(normalizeStr(b.category)));
    else if (sort === "category_desc") out.sort((a,b) => normalizeStr(b.category).localeCompare(normalizeStr(a.category)));
    else if (sort === "tags_count_desc") out.sort((a,b) => parseTags(b.tags).length - parseTags(a.tags).length);
  }

  return out;
}

function render() {
  const filtered = applyFilters(allTasks);

  tableBody.innerHTML = "";
  if (!filtered.length) {
    emptyState.classList.remove("d-none");
    return;
  }
  emptyState.classList.add("d-none");

  filtered.forEach(task => {
    const tr = document.createElement("tr");

    const tags = parseTags(task.tags).join(", ") || "-";
    const due = formatDate(task.dueDate);

    tr.innerHTML = `
      <td class="fw-bold">${task.title}</td>
      <td>${pillStatus(task.status)}</td>
      <td>${pillPriority(task.priority || "medium")}</td>
      <td>${due}</td>
      <td>${task.category || "general"}</td>
      <td>${tags}</td>
      <td class="text-end">
        <button class="action-btn edit-btn" data-id="${task._id}">${typeof t === 'function' ? t('action_edit') : 'Edit'}</button>
        <button class="action-btn danger delete-btn ms-2" data-id="${task._id}">${typeof t === 'function' ? t('action_delete') : 'Delete'}</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

// form submit
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
    status: statusInput.value,
    priority: priorityInput.value,
    dueDate: dueDateInput.value || null,
    category: categoryInput.value.trim() || "general",
    tags: tagsInput.value.trim()
  };

  if (!payload.title) return alert("Title is required");

  const id = taskIdInput.value;
  const url = id ? `${API_URL}/${id}` : API_URL;
  const method = id ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (res.status === 401) {
    showLoginModal();
    return;
  }
  if (!res.ok) {
    const err = await safeJson(res);
    alert(err?.error || (typeof t === 'function' ? t('save_failed') : "Save failed"));
    return;
  }

  resetForm();
  await loadTasks();
});

function resetForm() {
  taskIdInput.value = "";
  titleInput.value = "";
  descriptionInput.value = "";
  statusInput.value = "pending";
  priorityInput.value = "medium";
  dueDateInput.value = "";
  categoryInput.value = "general";
  tagsInput.value = "";
  cancelEditBtn.classList.add("d-none");
}

cancelEditBtn.addEventListener("click", resetForm);

// table actions
tableBody.addEventListener("click", async (e) => {
  const editBtn = e.target.closest(".edit-btn");
  const delBtn = e.target.closest(".delete-btn");

  if (editBtn) {
    const id = editBtn.dataset.id;
    const res = await fetch(`${API_URL}/${id}`);
    const task = await safeJson(res);
    if (!task) return;

    taskIdInput.value = task._id;
    titleInput.value = task.title || "";
    descriptionInput.value = task.description || "";
    statusInput.value = task.status || "pending";
    priorityInput.value = task.priority || "medium";
    dueDateInput.value = task.dueDate ? new Date(task.dueDate).toISOString().slice(0,10) : "";
    categoryInput.value = task.category || "general";
    tagsInput.value = parseTags(task.tags).join(", ");

    cancelEditBtn.classList.remove("d-none");
    return;
  }

  if (delBtn) {
    const id = delBtn.dataset.id;
    if (!confirm(typeof t === 'function' ? t('delete_confirm') : "Delete this task?")) return;

    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    if (res.status === 401) {
      showLoginModal();
      return;
    }
    if (!res.ok) {
      const err = await safeJson(res);
      alert(err?.error || (typeof t === 'function' ? t('delete_failed') : "Delete failed"));
      return;
    }

    await loadTasks();
  }
});

// filters events
[filterSort, filterStatus, filterPriority].forEach(x => x.addEventListener("change", render));
[filterCategory, filterTags].forEach(x => x.addEventListener("input", render));

resetFiltersBtn.addEventListener("click", () => {
  filterSort.value = "newest";
  filterStatus.value = "";
  filterPriority.value = "";
  filterCategory.value = "";
  filterTags.value = "";
  render();
});

// theme toggle (simple)
themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle('theme-dark');
  const newTheme = isDark ? 'dark' : 'light';
  localStorage.setItem('theme', newTheme);
  updateThemeIcon();
});

// language toggle
langToggle.addEventListener("click", () => {
  const cur = localStorage.getItem('lang') || 'en';
  const next = cur === 'en' ? 'ru' : 'en';
  if (typeof setLanguage === 'function') setLanguage(next);
  // re-render dynamic pieces
  render();
});

// init
(async () => {
  await checkMe();
  await loadTasks();
})();

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggleAuthMode");
  const submit = document.getElementById("authSubmitBtn");

  if (toggle) {
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      authMode = authMode === "login" ? "register" : "login";
      updateAuthUI();
    });
  }

  if (submit) {
    submit.addEventListener("click", submitAuth);
  }
});

// ===== Auth Mode (Login/Register) - HARD OVERRIDE =====
(() => {
 
  function updateAuthUI() {
    const title = document.getElementById("authTitle");
    const text = document.getElementById("authToggleText");
    const link = document.getElementById("toggleAuthMode");
    const btn = document.getElementById("do-login");

    if (!title || !text || !link || !btn) return;

    if (authMode === "login") {
      title.textContent = "Login";
      btn.textContent = "Login";
      text.textContent = "No account?";
      link.textContent = "Create account";
    } else {
      title.textContent = "Register";
      btn.textContent = "Register";
      text.textContent = "Already have an account?";
      link.textContent = "Login";
    }
  }

  async function submitAuth() {
    const emailEl = document.getElementById("login-email");
    const passEl = document.getElementById("login-password");
    if (!emailEl || !passEl) {
      alert("Auth inputs not found (check IDs: login-email, login-password)");
      return;
    }

    const email = emailEl.value.trim();
    const password = passEl.value.trim();
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    const endpoint = authMode === "login" ? "/login" : "/register";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    }).catch(() => null);

    if (!res) {
      alert("Server error");
      return;
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      alert(data.error || "Auth failed");
      return;
    }

    // Close modal (Bootstrap)
    const modalEl = document.getElementById("loginModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();

    if (typeof loadTasks === "function") loadTasks();
    if (typeof checkAuth === "function") checkAuth(); // если у тебя есть такая функция
  }

  document.addEventListener("DOMContentLoaded", () => {
    // 1) Toggle: клонируем ссылку, чтобы удалить старые обработчики (если были)
    const oldToggle = document.getElementById("toggleAuthMode");
    if (oldToggle) {
      const newToggle = oldToggle.cloneNode(true);
      oldToggle.parentNode.replaceChild(newToggle, oldToggle);

      newToggle.addEventListener("click", (e) => {
        e.preventDefault();
        authMode = authMode === "login" ? "register" : "login";
        updateAuthUI();
      });
    }

    // 2) Login/Register button: клонируем кнопку, чтобы удалить старые обработчики
    const oldBtn = document.getElementById("do-login");
    if (oldBtn) {
      const newBtn = oldBtn.cloneNode(true);
      oldBtn.parentNode.replaceChild(newBtn, oldBtn);

      newBtn.addEventListener("click", (e) => {
        e.preventDefault();
        submitAuth();
      });
    }

    updateAuthUI();
  });
})();