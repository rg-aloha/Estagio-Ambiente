import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import TaskList from './components/TaskList';
import { DragDropContext } from '@hello-pangea/dnd';
import SortFilter from './components/SortFilter';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [filter, setFilter] = useState('manual');

  const tableRef = useRef(null);

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

  // Lógica de Ordenação
  const getSortedTasks = () => {
    const sorted = [...tasks];
    switch (filter) {
      case 'alpha':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'z-alpha':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'completed':
        return sorted.sort((a, b) => Number(b.completed) - Number(a.completed));
      case 'pending': 
        // Pendentes (false = 0) primeiro: a - b -> (0 - 1 = -1)
        return sorted.sort((a, b) => Number(a.completed) - Number(b.completed));
      case 'date':
        return sorted.sort((a, b) => b.id - a.id);
      case 'date-old': 
        return sorted.sort((a, b) => a.id - b.id);
      default:
        return tasks; 
    }
  };

  const sortedTasks = getSortedTasks();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

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

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${id}`);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  };

  const toggleTaskCompleted = async (task) => {
    const updated = { ...task, completed: !task.completed };
    setTasks(prev => prev.map(t => (t.id === task.id ? updated : t)));
    try {
      await axios.put(`http://localhost:3000/tasks/${task.id}`, updated);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const editTask = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const onDragEnd = (result) => {
    if (!result.destination || filter !== 'manual') return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTasks(items);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editingId && tableRef.current && !tableRef.current.contains(event.target)) {
        setEditingId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editingId]);

  const sharedProps = {
    tasks: sortedTasks,
    title, setTitle, description, setDescription,
    editingId, setEditingId, editTitle, setEditTitle,
    editDescription, setEditDescription, saveTask, deleteTask,
    toggleTaskCompleted, editTask, tableRef, progressPercentage,
    onDragEnd, filter, setFilter
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App">
        <div className="top-bar">
          <h1>Lista de Tarefas</h1>
          <div className='divider'></div>
          <TaskList showTable={false} {...sharedProps} />
        </div>

        <header className="App-header">
          <SortFilter currentFilter={filter} setFilter={setFilter} />
          <TaskList showInputs={false} {...sharedProps} />
        </header>
      </div>
    </DragDropContext>
  );
}

export default App;