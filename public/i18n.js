const translations = {
  en: {
    app_title: 'Task Manager',
    app_subtitle: 'Status • Priority • Due date • Category • Tags',
    btn_login: 'Login',
    btn_logout: 'Logout',
    btn_save: 'Save',
    btn_cancel: 'Cancel',
    form_title: 'Create / Update Task',
    label_title: 'Title',
    label_description: 'Description',
    label_status: 'Status',
    label_priority: 'Priority',
    label_due_date: 'Due date',
    label_category: 'Category',
    label_tags: 'Tags (comma separated)'
    ,
    sort_by_label: 'Sort by (field & order)',
    filter_status_label: 'Status',
    filter_priority_label: 'Priority',
    filter_category_label: 'Category',
    filter_tags_label: 'Tags',
    reset_filters: 'Reset filters',
    tasks_title: 'Tasks',
    empty_state_text: 'No tasks yet. Create your first task.',
    modal_login_title: 'Login',
    modal_email_label: 'Email',
    modal_password_label: 'Password',
    demo_credentials_text: 'Demo credentials: admin@example.com / admin123',
    status_done: 'Done',
    status_in_progress: 'In Progress',
    status_pending: 'Pending',
    all_statuses: 'All statuses',
    priority_high: 'High',
    priority_medium: 'Medium',
    priority_low: 'Low',
    all_priorities: 'All priorities',
    action_edit: 'Edit',
    action_delete: 'Delete',
    delete_confirm: 'Delete this task?',
    hint_login_required: 'Create/Update/Delete require login.'
    ,
    invalid_credentials: 'Invalid credentials',
    title_required: 'Title is required',
    save_failed: 'Save failed',
    delete_failed: 'Delete failed'
  },
  ru: {
    app_title: 'Менеджер задач',
    app_subtitle: 'Статус • Приоритет • Срок • Категория • Теги',
    btn_login: 'Вход',
    btn_logout: 'Выход',
    btn_save: 'Сохранить',
    btn_cancel: 'Отмена',
    form_title: 'Создать / Обновить задание',
    label_title: 'Название',
    label_description: 'Описание',
    label_status: 'Статус',
    label_priority: 'Приоритет',
    label_due_date: 'Срок',
    label_category: 'Категория',
    label_tags: 'Теги (через запятую)'
    ,
    sort_by_label: 'Сортировать по (поле и порядок)',
    filter_status_label: 'Статус',
    filter_priority_label: 'Приоритет',
    filter_category_label: 'Категория',
    filter_tags_label: 'Теги',
    reset_filters: 'Сбросить фильтры',
    tasks_title: 'Задачи',
    empty_state_text: 'Пока нет задач. Создайте первую.',
    modal_login_title: 'Вход',
    modal_email_label: 'Email',
    modal_password_label: 'Пароль',
    demo_credentials_text: 'Демо: admin@example.com / admin123',
    status_done: 'Выполнено',
    status_in_progress: 'В процессе',
    status_pending: 'Ожидает',
    all_statuses: 'Все статусы',
    priority_high: 'Высокий',
    priority_medium: 'Средний',
    priority_low: 'Низкий',
    all_priorities: 'Все приоритеты',
    action_edit: 'Ред.',
    action_delete: 'Удал.',
    delete_confirm: 'Удалить задачу?',
    hint_login_required: 'Создание/изменение/удаление требуют входа.'
    ,
    invalid_credentials: 'Неверные данные',
    title_required: 'Требуется название',
    save_failed: 'Сохранение не удалось',
    delete_failed: 'Не удалось удалить'
  }
};

let currentLang = localStorage.getItem('lang') || 'en';

function t(key) {
  return translations[currentLang] && translations[currentLang][key] ? translations[currentLang][key] : key;
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  applyTranslations();
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = t(key);
  });
  // placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) el.placeholder = t(key);
  });
  // titles
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (key) el.title = t(key);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
});
