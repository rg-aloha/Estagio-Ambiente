import './TaskList.css';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import checkedIcon from '../assets/icons/checked.png';
import uncheckedIcon from '../assets/icons/download.png';
import deleteIcon from '../assets/icons/delete.png';

const TaskList = ({ showInputs = true, showTable = true }) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const editTask = (task) => {
  setEditingId(task.id);
  setEditTitle(task.title);
  setEditDescription(task.description);
};

  // Estados para edição inline
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const toggleTaskCompleted = async (task) => {
  const updated = { ...task, completed: !task.completed };

  setTasks(prev =>
    prev.map(t => (t.id === task.id ? updated : t))
  );

  try {
    await axios.put(`http://localhost:3000/tasks/${task.id}`, updated);
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
  }
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

  // Criar e atualizar tarefa (Versão Otimizada)
  const saveTask = async () => {
    try {
      // Impede salvar se os campos estiverem vazios ou apenas com espaços
      const currentTitle = editingId ? editTitle : title;
      const currentDesc = editingId ? editDescription : description;

      if (!currentTitle.trim() || !currentDesc.trim()) {
        console.warn("Título e descrição são obrigatórios.");
        return;
      }

      if (editingId) {
        // 1. Edita tarefa existente
        const response = await axios.put(`http://localhost:3000/tasks/${editingId}`, {
          title: editTitle,
          description: editDescription
        });

        
        setTasks(prev => 
          prev.map(t => (t.id === editingId ? response.data : t))
        );

        // Limpa estados de edição
        setEditingId(null);
        setEditTitle('');
        setEditDescription('');

      } else {
        // 2. Cria nova tarefa
        const response = await axios.post('http://localhost:3000/tasks', {
          title: title,
          description: description,
          completed: false
        });

       
        if (response.data && response.data.id) {
          setTasks(prevTasks => [...prevTasks, response.data]);
        } else {
          
          fetchTasks();
        }


        setTitle('');
        setDescription('');
      }
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
    }
  };

  //Apagar tarefa
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${id}`);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  };

const tableRef = useRef(null); 

useEffect(() => {
  const handleClickOutside = (event) => {
    if (editingId && tableRef.current && !tableRef.current.contains(event.target)) {
      
      setEditingId(null); 
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [editingId]); 

  return (
    <div className="tasklist-container" ref={tableRef}>

      {/* Inputs */}
      {showInputs && (
        <div className="input-inline">
          <input
            placeholder="Título"
            value={editingId ? editTitle : title}
            onChange={(e) =>
              editingId
                ? setEditTitle(e.target.value)
                : setTitle(e.target.value)
            }
          />

          <input
            placeholder="Descrição"
            value={editingId ? editDescription : description}
            onChange={(e) =>
              editingId
                ? setEditDescription(e.target.value)
                : setDescription(e.target.value)
            }
          />

          <button onClick={saveTask}>
            {editingId ? 'Salvar' : 'Adicionar'}
          </button>
          <span></span>
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
  {tasks.map(task => {
    const isEditing = editingId === task.id;

    return (
      <tr key={task.id} className={task.completed ? 'checked' : ''}>
        
        {/* Coluna do Título */}
        <td
          style={{ position: 'relative', paddingLeft: '40px', cursor: 'pointer' }}
          onClick={() => !isEditing && editTask(task)} 
        >
          {/* Ícone de Checkbox */}
          <span
            onClick={(e) => {
              e.stopPropagation();
              toggleTaskCompleted(task);
            }}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              backgroundImage: `url(${task.completed ? checkedIcon : uncheckedIcon})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              cursor: 'pointer',
            }}
          ></span>

          {isEditing ? (
            <input
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onClick={(e) => e.stopPropagation()} // Impede o clique de fechar o input
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveTask();
                if (e.key === 'Escape') setEditingId(null);
              }}
              style={{ width: '90%' }}
            />
          ) : (
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.title}
            </span>
          )}
        </td>

        {/* Coluna da Descrição */}
        <td 
          onClick={() => !isEditing && editTask(task)}
          style={{ cursor: 'pointer' }}
        >
          {isEditing ? (
            <input
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveTask();
                if (e.key === 'Escape') setEditingId(null);
              }}
              style={{ width: '90%' }}
            />
          ) : (
            task.description
          )}
        </td>

        {/* Coluna do Delete */}
        <td style={{ width: '40px', textAlign: 'center' }}>
          <span
            className="deleteIcon"
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(task.id);
            }}
            style={{ cursor: 'pointer' }}
          >
          </span>
        </td>

      </tr>
    );
  })}
</tbody>
        </table>
      )}

    </div>
  );
};

export default TaskList;