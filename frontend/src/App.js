import React from 'react';
import './App.css';
import TaskList from './components/TaskList';

function App() {
  return (
    <div className="App">

      {/* 🔹 Inputs fora do cartão */}
      <div className="top-bar">
        <h1>Lista de Tarefas</h1>
        <div className='divider'></div>
        <TaskList showTable={false} />
      </div>

      {/* 🔹 Cartão com tabela */}
      <header className="App-header">
        <TaskList showInputs={false} />
      </header>

    </div>
  );
}

export default App;