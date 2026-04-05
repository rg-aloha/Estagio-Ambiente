import './TaskList.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TaskList.css';
import checkedIcon from '../assets/icons/checked.png';
import uncheckedIcon from '../assets/icons/download.png';
import editIcon from '../assets/icons/edit.png';
import deleteIcon from '../assets/icons/delete.png';

const TaskList = ({ showInputs = true, showTable = true }) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

const toggleTaskCompleted = (id) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed } // inverte completed
          : task
      )
    );
  };
  
  const toggleTask = (id) => {
  setTasks(prevTasks =>
    prevTasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    )
  );
};

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

  const saveTask = async () => {
  if (!title || !description) return;

  try {
    if (editingId) {
      // atualização
      await axios.put(`http://localhost:3000/tasks/${editingId}`, { title, description });
      setEditingId(null); // volta ao modo adicionar
    } else {
      // criação
      await axios.post('http://localhost:3000/tasks', { title, description });
    }
    setTitle('');
    setDescription('');
    fetchTasks(); // atualiza lista
  } catch (error) {
    console.error('Erro ao salvar tarefa:', error);
  }
};

  const deleteTask = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/tasks/${id}`);
    setTasks(prev => prev.filter(task => task.id !== id));
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
  }
};


const editTask = (id) => {
  const taskToEdit = tasks.find(task => task.id === id);
  if (taskToEdit) {
    setTitle(taskToEdit.title);
    setDescription(taskToEdit.description);
    setEditingId(id); 
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
        <button onClick={saveTask}>
  {editingId ? 'Salvar' : 'Adicionar'}
</button>
      </div>
    )}

    {/* Tabela */}
    {showTable && (
      <table className="task-table">
  <thead>
    <tr>
      <th>Título</th>
      <th>Descrição</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {tasks.map(task => (
      <tr key={task.id} className={task.completed ? 'checked' : ''}>
        <td style={{ position: 'relative', paddingLeft: '40px' }}>
          {task.title}
          <span
            className="task-icon"
            onClick={() => toggleTaskCompleted(task.id)}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              backgroundImage: task.completed
                ? `url(${checkedIcon})`
                : `url(${uncheckedIcon})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              cursor: 'pointer',
            }}
          ></span>
        </td>
        <td>{task.description}</td>
        <td>
          {/* Ícone de edição */}
          <span
            onClick={() => editTask(task.id)}
            style={{
              display: 'inline-block',
              width: '20px',
              height: '20px',
              backgroundImage: `url(${editIcon})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              cursor: 'pointer',
              marginRight: '10px',
            }}
          ></span>

          {/* Ícone de delete */}
          <span
            onClick={() => deleteTask(task.id)}
            style={{
              display: 'inline-block',
              width: '20px',
              height: '20px',
              backgroundImage: `url(${deleteIcon})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              cursor: 'pointer',
            }}
          ></span>
        </td>
      </tr>
    ))}
  </tbody>
</table>
    )}

  </div>
);
};



export default TaskList;