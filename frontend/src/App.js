import React from 'react';
import './App.css';
import TaskList from './components/TaskList'; // Importar o componente

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>Tarefas <img src = "/icons/images.png"></img></h2>
        <TaskList /> {/* Mostrar a lista de tarefas */}
      </header>
    </div>
  );
}

export default App;
