import React, { useState, useEffect, useRef } from 'react';
import './SortFilter.css';

const sortOptions = [
  { id: 'manual', name: 'Ordem Manual' },
  { id: 'alpha', name: 'Alfabética (A-Z)' },
  { id: 'z-alpha', name: 'Alfabética (Z-A)' },
  { id: 'completed', name: 'Concluídas Primeiro' },
  { id: 'pending', name: 'Por Fazer Primeiro' },
  { id: 'date', name: 'Mais Recentes' },
  { id: 'date-old', name: 'Mais Antigas' },
];

const SortFilter = ({ currentFilter, setFilter }) => {
  // Por padrão, começa como false (fechado)
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeOption = sortOptions.find(opt => opt.id === currentFilter);

  // Fecha o dropdown automaticamente se clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="filter-dropdown-container" ref={dropdownRef}>
      {/* Botão de Disparo (Trigger) */}
      <button 
        className={`dropdown-button ${currentFilter !== 'manual' ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sort-icon">≡</span>
        <span>{currentFilter === 'manual' ? 'Ordenar' : activeOption?.name}</span>
        <span className={`arrow-icon ${isOpen ? 'open' : ''}`}>▾</span>
      </button>

      {/* Menu que expande */}
      {isOpen && (
        <div className="dropdown-menu-float">
          <div className="menu-header">Opções de ordenação</div>
          {sortOptions.map((option) => (
            <div 
              key={option.id} 
              className={`menu-item ${currentFilter === option.id ? 'selected' : ''}`}
              onClick={() => {
                setFilter(option.id);
                setIsOpen(false); // Fecha após escolher
              }}
            >
              <div className="check-box">
                {currentFilter === option.id && "✓"}
              </div>
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortFilter;