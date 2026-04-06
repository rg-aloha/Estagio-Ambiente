import './TaskList.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import checkedIcon from '../assets/icons/checked.png';
import uncheckedIcon from '../assets/icons/download.png';
import deleteIcon from '../assets/icons/delete.png';

const TaskList = ({ showInputs = true, showTable = true }) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Estados para edição inline
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const toggleTaskCompleted = (id) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

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

  const saveTask = async () => {
    try {
      if (editingId) {
        // Editar tarefa existente
        await axios.put(`http://localhost:3000/tasks/${editingId}`, {
          title: editTitle,
          description: editDescription
        });
        setEditingId(null);
        setEditTitle('');
        setEditDescription('');
      } else {
        // Criar nova tarefa
        if (!title || !description) return;
        await axios.post('http://localhost:3000/tasks', {
          title,
          description
        });
        setTitle('');
        setDescription('');
      }
      fetchTasks();
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

  const editTask = (task) => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditingId(task.id);
  };

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

                {/* Célula título */}
                <td
                  onClick={() => editTask(task)}
                  style={{ position: 'relative', paddingLeft: '40px', cursor: 'pointer' }}
                >
                  {editingId === task.id ? (
                    <input
                      autoFocus
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onClick={(e) => e.stopPropagation()} // evita conflito
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveTask();
                      }}
                    />
                  ) : (
                    task.title
                  )}

                  <span
                    onClick={(e) => {
                      e.stopPropagation(); // evita entrar em edição
                      toggleTaskCompleted(task.id);
                    }}
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

                {/* Célula descrição */}
                <td
                  onClick={() => editTask(task)}
                  style={{ cursor: 'pointer' }}
                >
                  {editingId === task.id ? (
                    <input
                      autoFocus
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveTask();
                      }}
                    />
                  ) : (
                    task.description
                  )}
                </td>

                {/* Ações (delete) */}
                <td style={{ width: '40px', textAlign: 'left', paddingleft:'30px' }}>
                  <span
                    className="deleteIcon"
                    onClick={() => deleteTask(task.id)}
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