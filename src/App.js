import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

// 🌍 YOUR LIVE RENDER BACKEND URL
const API_URL = "https://crystal-todo-backend.onrender.com/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("General");
  const [filter, setFilter] = useState("All");

  // 1. Fetch all tasks when the app loads
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  // 2. ✨ THE FIX: Create a new task using POST
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!taskInput.trim()) return;

    try {
      const res = await axios.post(API_URL, {
        task: taskInput,
        priority: priority,
        category: category
      });
      
      // Add the new task to the top of the list and clear input
      setTodos([res.data, ...todos]);
      setTaskInput("");
    } catch (err) {
      console.error("Error creating task. Check CORS in backend:", err);
    }
  };

  // 3. Toggle Completion (Update)
  const toggleComplete = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`);
      setTodos(todos.map(todo => todo._id === id ? res.data : todo));
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  // 4. Delete Task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className="app-container">
      <div className="crystal-card">
        <header>
          <h1>Crystal Studio</h1>
          <div className="search-bar">
            <input type="text" placeholder="Search tasks..." disabled />
          </div>
        </header>
        
        <div className="filter-tabs">
          <button className={filter === "All" ? "active" : ""} onClick={() => setFilter("All")}>All</button>
          <button className={filter === "Active" ? "active" : ""} onClick={() => setFilter("Active")}>Active</button>
          <button className={filter === "Completed" ? "active" : ""} onClick={() => setFilter("Completed")}>Completed</button>
        </div>

        <form onSubmit={handleCreate} className="input-group">
          <div className="main-input">
            <input 
              type="text" 
              placeholder="New Project..." 
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
            />
          </div>
          <div className="selectors">
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="General">General</option>
              <option value="College">College</option>
              <option value="Work">Work</option>
            </select>
            <button type="submit" className="create-btn">Create</button>
          </div>
        </form>

        <div className="todo-list">
          {todos.length === 0 ? (
            <p className="empty-msg">No tasks found. Create one above!</p>
          ) : (
            todos.map(todo => (
              <div key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <div className="todo-info" onClick={() => toggleComplete(todo._id)}>
                  <div className={`status-dot ${todo.priority.toLowerCase()}`}></div>
                  <div className="text-content">
                    <p>{todo.task}</p>
                    <small>{todo.category} • {todo.priority}</small>
                  </div>
                </div>
                <button className="delete-btn" onClick={() => deleteTask(todo._id)}>×</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;