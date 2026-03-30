import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:3000/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error('Erro ao buscar tarefas:', error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const addTask = async () => {
        if (!title || !description) return;

        try {
            await axios.post('http://localhost:3000/tasks', { title, description });
            setTitle('');
            setDescription('');
            fetchTasks(); // Atualiza a lista
        } catch (error) {
            console.error('Erro ao adicionar tarefa:', error);
        }
    };

    return (
        <div>
            <h1>Lista de Tarefas</h1>

            <div>
                <input
                    placeholder="Título"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    placeholder="Descrição"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button onClick={addTask}>Adicionar</button>
            </div>

            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        <strong>{task.title}</strong>: {task.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;
