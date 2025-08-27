import React, { useEffect, useState, useRef } from 'react';
import { loadTodos } from './api/todos';
import { Todo } from './types/Todo';

const Notification: React.FC<{ message: string | null; onClose: () => void }> = ({ message, onClose }) => (
  <div className={`notification${message ? '' : ' hidden'}`}>
    {message && (
      <>
        <span>{message}</span>
        <button onClick={onClose}>Close</button>
      </>
    )}
  </div>
);

const TodoFilter: React.FC<{ selectedFilter: string; onFilterChange: (filter: string) => void }> = ({
  selectedFilter,
  onFilterChange,
}) => (
  <div className="todo-filter">
    {['All', 'Active', 'Completed'].map(filter => (
      <button
        key={filter}
        className={selectedFilter === filter ? 'selected' : ''}
        onClick={() => onFilterChange(filter)}
      >
        {filter}
      </button>
    ))}
  </div>
);

const TodoList: React.FC<{ todos: Todo[] }> = ({ todos }) => (
  <ul className="todo-list">
    {todos.map(todo => (
      <li key={todo.id}>{todo.title}</li>
    ))}
  </ul>
);

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setError(null);

    const fetchTodos = async () => {
      setLoading(true);
      try {
        const loadedTodos = await loadTodos(3442); 
        setTodos(loadedTodos);
      } catch (err) {
        setError('Failed to load todos');
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  useEffect(() => {
    if (error) {
      errorTimeoutRef.current = setTimeout(() => {
        setError(null);
      }, 3000);
    }
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [error]);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'Active') return !todo.completed;
    if (filter === 'Completed') return todo.completed;
    return true;
  });

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  const handleCloseNotification = () => {
    setError(null);
  };

  return (
    <div className="app">
      <Notification message={error} onClose={handleCloseNotification} />
      <TodoFilter selectedFilter={filter} onFilterChange={handleFilterChange} />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {todos.length > 0 && (
            <TodoList todos={filteredTodos} />
          )}
        </>
      )}
    </div>
  );
};

export default App;