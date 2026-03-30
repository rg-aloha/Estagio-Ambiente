import React from 'react';
import './App.css';
import TaskList from './components/TaskList'; // Importar o componente

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>?</h1>
        <TaskList /> {/* Mostrar a lista de tarefas */}
      </header>
    </div>
  );
}

export default App;
