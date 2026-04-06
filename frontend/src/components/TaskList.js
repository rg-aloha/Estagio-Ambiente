import './TaskList.css';
import React from 'react';
import checkedIcon from '../assets/icons/checked.png';
import uncheckedIcon from '../assets/icons/download.png';

const TaskList = ({ 
  showInputs = true, 
  showTable = true,
  // Receção de todas as funções e estados via Props vindos do App.js
  tasks, title, setTitle, description, setDescription,
  editingId, setEditingId, editTitle, setEditTitle,
  editDescription, setEditDescription, saveTask, deleteTask,
  toggleTaskCompleted, editTask, tableRef
}) => {

  return (
    <div className="tasklist-container" ref={tableRef}>

      {/* 1. Área de Inputs (Criação ou Edição) */}
      {showInputs && (
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
          <span></span>
        </div>
      )}

      {/* 2. Área da Tabela */}
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
                        onClick={(e) => e.stopPropagation()}
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