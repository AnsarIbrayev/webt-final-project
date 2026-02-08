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
}

document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
});
