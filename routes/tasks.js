const express = require('express');
const router = express.Router();
const { getDB, ObjectId } = require('../database/mongo');

const collectionName = 'tasks';

// GET /api/tasks — все задачи с фильтром и сортировкой
router.get('/', async (req, res) => {
    try {
        const db = getDB();
        let query = {};
        let sort = {};

        if (req.query.title) query.title = { $regex: req.query.title, $options: 'i' };
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':'); // пример: sortBy=title:asc
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }

        const tasks = await db.collection(collectionName).find(query).sort(sort).toArray();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/tasks/:id — получить задачу
router.get('/:id', async (req, res) => {
    try {
        const task = await getDB().collection(collectionName).findOne({ _id: ObjectId(req.params.id) });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.status(200).json(task);
    } catch {
        res.status(400).json({ error: 'Invalid ID' });
    }
});

// POST /api/tasks — создать задачу
router.post('/', async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) return res.status(400).json({ error: 'Missing fields' });
        const result = await getDB().collection(collectionName).insertOne({ title, description });
        res.status(201).json(result.ops[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/tasks/:id — обновить задачу
router.put('/:id', async (req, res) => {
    try {
        const { title, description } = req.body;
        const result = await getDB().collection(collectionName).findOneAndUpdate(
            { _id: ObjectId(req.params.id) },
            { $set: { title, description } },
            { returnDocument: 'after' }
        );
        if (!result.value) return res.status(404).json({ error: 'Task not found' });
        res.status(200).json(result.value);
    } catch {
        res.status(400).json({ error: 'Invalid ID' });
    }
});

// DELETE /api/tasks/:id — удалить задачу
router.delete('/:id', async (req, res) => {
    try {
        const result = await getDB().collection(collectionName).deleteOne({ _id: ObjectId(req.params.id) });
        if (result.deletedCount === 0) return res.status(404).json({ error: 'Task not found' });
        res.status(200).json({ message: 'Task deleted' });
    } catch {
        res.status(400).json({ error: 'Invalid ID' });
    }
});

module.exports = router;
