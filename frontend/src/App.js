import React from 'react';
import './App.css';
import TaskList from './components/TaskList';

function App() {
  return (
    <div className="App">

      <div className="top-bar">
        <h1>Lista de Tarefas</h1>
        <div className='divider'></div>
      </div>

      <header className="App-header">
        {/* Renderizamos apenas UMA vez. O estado agora é partilhado! */}
        <TaskList showInputs={true} showTable={true} />
      </header>

    </div>
  );
}

export default App;