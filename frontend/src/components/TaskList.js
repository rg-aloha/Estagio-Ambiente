import './TaskList.css';
import React, { useRef } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import checkedIcon from '../assets/icons/checked.png';
import uncheckedIcon from '../assets/icons/download.png';

const TaskList = ({ 
  showInputs = true, 
  showTable = true,
  tasks, title, setTitle, description, setDescription,
  editingId, setEditingId, editTitle, setEditTitle,
  editDescription, setEditDescription, saveTask, deleteTask,
  toggleTaskCompleted, editTask, tableRef,
  progressPercentage, onDragEnd 
}) => {

  const titleInputRef = useRef(null);
  const descInputRef = useRef(null);

  const handleEditClick = (task, field) => {
    editTask(task);
    setTimeout(() => {
      if (field === 'title') titleInputRef.current?.focus();
      else if (field === 'desc') descInputRef.current?.focus();
    }, 50);
  };

  return (
    <div className="tasklist-container" ref={tableRef}>
      {showInputs && (
        <>
          <div className="progress-container">
            <div className="progress-bar-wrapper">
              <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <span className="progress-text">{Math.round(progressPercentage)}% concluído</span>
          </div>

          <div className="input-inline">
            <input 
              placeholder="Título" 
              value={editingId ? editTitle : title} 
              onChange={(e) => editingId ? setEditTitle(e.target.value) : setTitle(e.target.value)} 
            />
            <input 
              placeholder="Descrição" 
              value={editingId ? editDescription : description} 
              onChange={(e) => editingId ? setEditDescription(e.target.value) : setDescription(e.target.value)} 
            />
            <button onClick={saveTask}>{editingId ? 'Salvar' : 'Adicionar'}</button>
          </div>
        </>
      )}

      {showTable && (
        <table className="task-table">
          <thead>
            <tr>
              <th style={{ width: '30px' }}></th>
              <th>Título</th>
              <th>Descrição</th>
              <th style={{ width: '40px' }}></th>
            </tr>
          </thead>
          <Droppable droppableId="table-body">
            {(provided) => (
              <tbody ref={provided.innerRef} {...provided.droppableProps}>
                {tasks.map((task, index) => {
                  const isEditing = editingId === task.id;
                  return (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided, snapshot) => (
                        <tr 
                          ref={provided.innerRef} 
                          {...provided.draggableProps}
                          className={`${task.completed ? 'checked' : ''} ${snapshot.isDragging ? 'is-dragging' : ''}`}
                          style={{ 
                            ...provided.draggableProps.style,
                            display: snapshot.isDragging ? 'table' : 'table-row' 
                          }}
                        >
                          {/* Handle para arrastar */}
                          <td {...provided.dragHandleProps} className="drag-handle">
                            ⠿
                          </td>

                          <td className="td-title" onClick={() => !isEditing && handleEditClick(task, 'title')}>
                            <span
                              className="check-icon"
                              onClick={(e) => { e.stopPropagation(); toggleTaskCompleted(task); }}
                              style={{ backgroundImage: `url(${task.completed ? checkedIcon : uncheckedIcon})` }}
                            ></span>
                            {isEditing ? (
                              <input 
                                ref={titleInputRef} value={editTitle} 
                                onChange={(e) => setEditTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && saveTask()}
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <span className="task-text">{task.title}</span>
                            )}
                          </td>

                          <td className="td-desc" onClick={() => !isEditing && handleEditClick(task, 'desc')}>
                            {isEditing ? (
                              <input 
                                ref={descInputRef} value={editDescription} 
                                onChange={(e) => setEditDescription(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && saveTask()}
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              task.description
                            )}
                          </td>

                          <td className="td-delete">
                            <span className="deleteIcon" onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}></span>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </tbody>
            )}
          </Droppable>
        </table>
      )}
    </div>
  );
};

export default TaskList;