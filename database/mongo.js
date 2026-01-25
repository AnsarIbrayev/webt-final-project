const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017'; // локальный MongoDB
const dbName = 'webt_ass3';
let db;

async function connectDB() {
    const client = new MongoClient(url); // useUnifiedTopology не нужен
    await client.connect();
    console.log('MongoDB connected');
    db = client.db(dbName);
}

function getDB() {
    if (!db) throw new Error('Database not connected');
    return db;
}

module.exports = { connectDB, getDB, ObjectId };
