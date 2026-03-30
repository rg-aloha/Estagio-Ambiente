import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/tasks')
            .then(response => {
                setTasks(response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar tarefas:', error);
            });
    }, []);

    return (
        <div>
            <h1>Lista de Tarefas</h1>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>{task.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;
