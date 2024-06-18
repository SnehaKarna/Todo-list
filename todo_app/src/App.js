import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import TodoForm from './TodoForm';
import pic1 from './todobackground.png';

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async (todo) => {
    try {
      const response = await axios.post('http://localhost:3000/todos', todo);
      setTodos([...todos, response.data]);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const removeTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error removing todo:', error);
    }
  };

  const toggleDone = async (id) => {
    try {
      const updatedTodo = todos.find(todo => todo._id === id);
      updatedTodo.done = !updatedTodo.done;
      await axios.put(`http://localhost:3000/todos/${id}`, updatedTodo);
      setTodos(todos.map(todo => (todo._id === id ? updatedTodo : todo)));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const editTodo = async (id, newText) => {
    try {
      const updatedTodo = todos.find(todo => todo._id === id);
      updatedTodo.text = newText;
      await axios.put(`http://localhost:3000/todos/${id}`, updatedTodo);
      setTodos(todos.map(todo => (todo._id === id ? updatedTodo : todo)));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const [editingId, setEditingId] = useState(null); // State to store the id of the todo being edited

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleEditChange = (id, newText) => {
    editTodo(id, newText);
    setEditingId(null); // Exit edit mode after editing
  };

  return (
    <div
      className="todo-container"
      style={{ backgroundImage: `url(${pic1})` }}
    >
      <h1>To-Do List</h1>
      <TodoForm addTodo={addTodo} />
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className={`todo-item ${todo.done ? 'done' : ''}`}>
            {editingId === todo._id ? (
              <input
                type="text"
                value={todo.text}
                onChange={(e) => editTodo(todo._id, e.target.value)}
                onBlur={() => setEditingId(null)} // Exit edit mode when input field loses focus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleEditChange(todo._id, e.target.value);
                  }
                }}
              />
            ) : (
              <span>{todo.text}</span>
            )}
            <span className="deadline">
              {new Date(todo.deadline).toLocaleString()}
            </span>
            <button onClick={() => toggleDone(todo._id)} className="done-btn">
              {todo.done ? 'Undo' : 'Done'}
            </button>
            <button onClick={() => handleEdit(todo._id)} className="edit-btn">Edit</button>
            <button onClick={() => removeTodo(todo._id)} className="remove-btn">Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;



