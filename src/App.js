import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = "http://localhost:5000/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("General");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => { fetchTodos(); }, []);

  const fetchTodos = async () => {
    const res = await axios.get(API_URL);
    setTodos(res.data);
  };

  const addTask = async () => {
    if (!task.trim()) return;
    await axios.post(API_URL, { task, priority, category });
    setTask("");
    fetchTodos();
  };

  const toggleComplete = async (todo) => {
    await axios.put(`${API_URL}/${todo._id}`, { completed: !todo.completed });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTodos();
  };

  // Feature: Advanced Filtering & Searching
  const filteredTodos = todos.filter(t => {
    const matchesSearch = t.task.toLowerCase().includes(search.toLowerCase());
    const matchesTab = filter === "All" ? true : filter === "Active" ? !t.completed : t.completed;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="app-container">
      <div className="glass-card">
        <div className="header">
          <h1 className="title">Crystal Studio</h1>
          <input 
            className="search-bar" 
            placeholder="Search tasks..." 
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="tabs">
          {["All", "Active", "Completed"].map(tab => (
            <button 
              key={tab} 
              className={filter === tab ? "active-tab" : ""} 
              onClick={() => setFilter(tab)}
            >{tab}</button>
          ))}
        </div>
        
        <div className="input-panel">
          <input value={task} onChange={(e) => setTask(e.target.value)} placeholder="New Project..." />
          <div className="row">
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option>High</option><option>Medium</option><option>Low</option>
            </select>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>General</option><option>College</option><option>Work</option>
            </select>
            <button className="add-btn" onClick={addTask}>Create</button>
          </div>
        </div>

        <div className="todo-list">
          {filteredTodos.map(todo => (
            <div key={todo._id} className={`item priority-${todo.priority} ${todo.completed ? 'done' : ''}`}>
              <div className="content" onClick={() => toggleComplete(todo)}>
                <div className="dot"></div>
                <div>
                  <div className="t-text">{todo.task}</div>
                  <div className="t-meta">{todo.category} • {todo.priority}</div>
                </div>
              </div>
              <button className="del" onClick={() => deleteTodo(todo._id)}>✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;