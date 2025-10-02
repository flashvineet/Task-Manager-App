import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, LogOut, Check, X } from 'lucide-react';
import { useAuth } from './Major';
import './Dashboard.css';

const API_BASE_URL = 'http://localhost:5000/api';

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setTasks(data.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add task
  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTask }),
      });
      const data = await res.json();
      if (res.ok) {
        setTasks([data.data, ...tasks]);
        setNewTask('');
      }
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  //Delete task
  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setTasks(tasks.filter((t) => t._id !== id));
      }
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  //editing
  const startEdit = (task) => {
    setEditingTask(task._id);
    setEditText(task.title);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingTask(null);
    setEditText('');
  };

  //Save edit
  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: editText }),
      });

      const result = await res.json();
      if (res.ok) {
        const updatedTask = result.data;
        setTasks(tasks.map((t) => (t._id === id ? updatedTask : t)));
        setEditingTask(null);
        setEditText('');
      } else {
        console.error('Update failed:', result.message);
      }
    } catch (err) {
      console.error('Error editing task:', err);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-card">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h2>Welcome, {user?.name}</h2>
            <h3>Your tasks for today</h3>
          </div>
          <button onClick={logout} className="logout-btn flex items-center gap-1">
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Add Task */}
        <div className="task-input-container">
          <input
            type="text"
            placeholder="Enter new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="task-input"
          />
          <button onClick={addTask} className="add-btn flex items-center gap-1">
            <Plus size={16} /> Add
          </button>
        </div>

        {/* Task List */}
        {loading ? (
          <div className="spinner mx-auto mt-6"></div>
        ) : tasks.length === 0 ? (
          <p className="text-gray-600 text-center">No tasks yet. Add your first task!</p>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <div key={task._id} className="task-item">
                {editingTask === task._id ? (
                  <>
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="task-input mr-2"
                    />
                    <div className="task-actions">
                      <button onClick={() => saveEdit(task._id)} className="task-btn text-green-600">
                        <Check size={18} />
                      </button>
                      <button onClick={cancelEdit} className="task-btn text-gray-600">
                        <X size={18} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="task-text">{task.title}</span>
                    <div className="task-actions">
                      <button onClick={() => startEdit(task)} className="task-btn text-blue-600">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => deleteTask(task._id)} className="task-btn text-red-600">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
