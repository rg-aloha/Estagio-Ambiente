import './TaskList.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TaskList.css'; // CSS específico da TaskList

const TaskList = ({ showInputs = true, showTable = true }) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchTasks = async () => {
  try {
    const response = await axios.get('http://localhost:3000/tasks');
    console.log("DADOS DO BACKEND:", response.data); // 👈 AQUI
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

  console.log("TASKS NO ESTADO:", tasks); // 👈 AQUI

  return (
  <div className="tasklist-container">

    {/* Inputs */}
    {showInputs && (
      <div className="input-inline">
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
    )}

    {/* Tabela */}
    {showTable && (
      <table className="task-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Descrição</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}

  </div>
);
};

export default TaskList;