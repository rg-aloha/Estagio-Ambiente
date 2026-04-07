import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import TaskList from './components/TaskList';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const tableRef = useRef(null); 

  // 1. Funções de comunicação com o Backend
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

  // 2. Cálculo do progresso
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // 3. Criar e editar Tarefas
  const saveTask = async () => {
    try {
      if (editingId) {
        await axios.put(`http://localhost:3000/tasks/${editingId}`, {
          title: editTitle,
          description: editDescription
        });
        setEditingId(null);
        setEditTitle('');
        setEditDescription('');
      } else {
        if (!title.trim() || !description.trim()) return;

        await axios.post('http://localhost:3000/tasks', {
          title,
          description,
          completed: false
        });

        setTitle('');
        setDescription('');
      }

      fetchTasks(); 

    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
    }
  };

  // 4. Apagar Tarefas
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${id}`);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  };

  // 5. Tarefa Terminada
  const toggleTaskCompleted = async (task) => {
    const updated = { ...task, completed: !task.completed };
    setTasks(prev => prev.map(t => (t.id === task.id ? updated : t)));

    try {
      await axios.put(`http://localhost:3000/tasks/${task.id}`, updated);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const editTask = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  // 6. Click Outside para cancelar edição
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editingId && tableRef.current && !tableRef.current.contains(event.target)) {
        setEditingId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editingId]);

  // 7. Agrupamento num objeto para passar via Props
  const sharedProps = {
    tasks, title, setTitle, description, setDescription,
    editingId, setEditingId, editTitle, setEditTitle,
    editDescription, setEditDescription, saveTask, deleteTask,
    toggleTaskCompleted, editTask, tableRef, progressPercentage
  };

  return (
    <div className="App">

      {/* 🔹 Inputs fora do cartão (no topo) */}
      <div className="top-bar">
        <h1>Lista de Tarefas</h1>
        <div className='divider'></div>
        <TaskList showTable={false} {...sharedProps} />
      </div>

      {/* 🔹 Cartão branco do fundo (Apenas a Tabela) */}
      <header className="App-header">
        <TaskList showInputs={false} {...sharedProps} />
      </header>

    </div>
  );
}

export default App;