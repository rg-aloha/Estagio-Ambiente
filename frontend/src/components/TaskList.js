import './TaskList.css';
import React, { useRef } from 'react';
import checkedIcon from '../assets/icons/checked.png';
import uncheckedIcon from '../assets/icons/download.png';

//Props
const TaskList = ({ 
  showInputs = true, 
  showTable = true,
  tasks, title, setTitle, description, setDescription,
  editingId, setEditingId, editTitle, setEditTitle,
  editDescription, setEditDescription, saveTask, deleteTask,
  toggleTaskCompleted, editTask, tableRef,
  progressPercentage // Recebido do App.js
}) => {

  // Refs para controlar o foco ao editar
  const titleInputRef = useRef(null);
  const descInputRef = useRef(null);

  // Função para entrar em modo de edição e focar o campo correto
  const handleEditClick = (task, field) => {
    editTask(task);
    
    // Pequeno delay para o React renderizar o input antes de tentarmos o foco
    setTimeout(() => {
      if (field === 'title' && titleInputRef.current) {
        titleInputRef.current.focus();
      } else if (field === 'desc' && descInputRef.current) {
        descInputRef.current.focus();
      }
    }, 50);
  };

  return (
    <div className="tasklist-container" ref={tableRef}>

      {/* 1. Área de Progresso e Inputs */}
      {showInputs && (
        <>
          {/* Barra de Progresso */}
          <div className="progress-container">
            <div className="progress-bar-wrapper">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className="progress-text">
              {Math.round(progressPercentage)}% concluído
            </span>
          </div>

          <div className="input-inline">
            <input
              placeholder="Título"
              value={editingId ? editTitle : title}
              onChange={(e) =>
                editingId ? setEditTitle(e.target.value) : setTitle(e.target.value)
              }
            />

            <input
              placeholder="Descrição"
              value={editingId ? editDescription : description}
              onChange={(e) =>
                editingId ? setEditDescription(e.target.value) : setDescription(e.target.value)
              }
            />

            <button onClick={saveTask}>
              {editingId ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </>
      )}

      {/* 2. Área da Tabela */}
      {showTable && (
        <table className="task-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Descrição</th>
              <th style={{ width: '40px' }}></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => {
              const isEditing = editingId === task.id;

              return (
                <tr key={task.id} className={task.completed ? 'checked' : ''}>
                  
                  {/* Coluna do Título */}
                  <td
                    className="td-title"
                    onClick={() => !isEditing && handleEditClick(task, 'title')}
                  >
                    <span
                      className="check-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTaskCompleted(task);
                      }}
                      style={{
                        backgroundImage: `url(${task.completed ? checkedIcon : uncheckedIcon})`,
                      }}
                    ></span>

                    {isEditing ? (
                      <input
                        ref={titleInputRef}
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveTask();
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                      />
                    ) : (
                      <span className="task-text">
                        {task.title}
                      </span>
                    )}
                  </td>

                  {/* Coluna da Descrição */}
                  <td 
                    className="td-desc"
                    onClick={() => !isEditing && handleEditClick(task, 'desc')}
                  >
                    {isEditing ? (
                      <input
                        ref={descInputRef}
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveTask();
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                      />
                    ) : (
                      task.description
                    )}
                  </td>

                  {/* Coluna do Delete */}
                  <td className="td-delete">
                    <span
                      className="deleteIcon"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task.id);
                      }}
                    ></span>
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