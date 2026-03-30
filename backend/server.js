// backend/server.js
const express = require('express');
const mariadb = require('mariadb');
const app = express();
const PORT = 3000;

app.use(express.json()); // substitui body-parser

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

    // Validação simples
    if (!title || !description) {
        return res.status(400).send({ error: 'Title e description são obrigatórios' });
    }

    let conn;
    try {
        conn = await pool.getConnection();

        // Inserção na base de dados
        const result = await conn.query(
            'INSERT INTO tasks (title, description) VALUES (?, ?)',
            [title, description]
        );

        // Converte insertId (BigInt) para Number antes de enviar
        const insertedId = Number(result.insertId);

        // Retorna a nova tarefa criada
        res.status(201).send({ id: insertedId, title, description });

    } catch (err) {
        console.error("ERRO REAL:", err);
        res.status(500).send({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
});

// Deletar uma tarefa pelo ID
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;

    let conn;
    try {
        conn = await pool.getConnection();

        const result = await conn.query('DELETE FROM tasks WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).send({ error: `Tarefa ${id} não encontrada` });
        }

        res.status(200).send({ message: `Tarefa ${id} removida` });

    } catch (err) {
        console.error("ERRO REAL:", err);
        res.status(500).send({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
});

// Atualizar uma tarefa pelo ID
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    // Validação básica
    if (!title && !description && completed === undefined) {
        return res.status(400).send({ error: 'Deve fornecer pelo menos um campo para atualizar' });
    }

    let conn;
    try {
        conn = await pool.getConnection();

        // Pegar a tarefa existente
        const rows = await conn.query('SELECT * FROM tasks WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).send({ error: 'Tarefa não encontrada' });
        }

        const task = rows[0];

        // Atualiza somente os campos enviados
        const newTitle = title ?? task.title;
        const newDescription = description ?? task.description;
        const newCompleted = completed ?? task.completed;

        await conn.query(
            'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?',
            [newTitle, newDescription, newCompleted, id]
        );

        res.status(200).send({
            id: Number(task.id), // converte BigInt
            title: newTitle,
            description: newDescription,
            completed: newCompleted
        });

    } catch (err) {
        console.error("ERRO REAL:", err);
        res.status(500).send({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
});

// Obter todas as tarefas
app.get('/tasks', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();

        const rows = await conn.query('SELECT * FROM tasks');

        // Converte BigInt para Number antes de enviar
        const tasks = rows.map(task => ({
            id: Number(task.id),
            title: task.title,
            description: task.description,
            completed: task.completed
        }));

        res.status(200).send(tasks);

    } catch (err) {
        res.status(500).send({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
});

app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT}`);
});