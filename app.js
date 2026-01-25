require('dotenv').config();

const express = require('express');
const path = require('path');
const { connectDB } = require('./database/mongo');

const app = express();

const tasksRouter = require('./routes/tasks');

// Парсинг тела запросов
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статика (CSS, JS, картинки)
app.use(express.static(path.join(__dirname, 'public')));

// HTML-страницы
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'views', 'home.html'))
);

app.get('/about', (req, res) =>
  res.sendFile(path.join(__dirname, 'views', 'about.html'))
);

app.get('/contact', (req, res) =>
  res.sendFile(path.join(__dirname, 'views', 'contact.html'))
);

// API-маршруты
app.use('/api/tasks', tasksRouter);

// Глобальный 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// Порт (для локали и Render)
const PORT = process.env.PORT || 3000;

// Подключение к БД и запуск сервера
connectDB()
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // чтобы не висеть в полумёртвом состоянии
  });
