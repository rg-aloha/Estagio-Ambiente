// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const mariadb = require('mariadb');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'estagio26hmp',
    database: 'task_manager',
    connectionLimit: 5
});

// Criar uma nova tarefa
app.post('/tasks', async (req, res) => {
    const { title, description } = req.body;
    try {
        const conn = await pool.getConnection();
        const result = await conn.query('INSERT INTO tasks (title, description) VALUES (?, ?)', [title, description]);
        res.status(201).send({ id: result.insertId, title, description });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Obter todas as tarefas
app.get('/tasks', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM tasks');
        res.status(200).send(rows);
    } catch (err) {
        res.status(500).send(err);
    }
})

app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT}`);
});
