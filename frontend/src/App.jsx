import { useEffect, useMemo, useState } from 'react';

const API_BASE = 'http://localhost:5000/api/v1';

async function apiRequest(path, method = 'GET', token, body) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [taskForm, setTaskForm] = useState({ title: '', description: '', status: 'pending' });
  const isLoggedIn = useMemo(() => Boolean(token), [token]);

  const resetAlerts = () => {
    setError('');
    setMessage('');
  };

  const persistAuth = (authToken, authUser) => {
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(authUser));
  };

  const logout = () => {
    setToken('');
    setUser(null);
    setTasks([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setMessage('Logged out successfully');
  };

  const handleUnauthorized = (errMessage) => {
    if (errMessage && errMessage.toLowerCase().includes('unauthorized')) {
      setToken('');
      setUser(null);
      setTasks([]);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setError('Session expired. Please login again.');
      return true;
    }
    return false;
  };

  const register = async () => {
    resetAlerts();
    try {
      const data = await apiRequest('/auth/register', 'POST', null, authForm);
      persistAuth(data.token, data.user);
      setMessage('Registration successful');
      setAuthForm({ name: '', email: '', password: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const login = async () => {
    resetAlerts();
    try {
      const data = await apiRequest('/auth/login', 'POST', null, {
        email: authForm.email,
        password: authForm.password
      });
      persistAuth(data.token, data.user);
      setMessage('Login successful');
    } catch (err) {
      setError(err.message);
    }
  };

  const loadTasks = async () => {
    resetAlerts();
    try {
      const data = await apiRequest('/tasks', 'GET', token);
      setTasks(data.tasks || []);
    } catch (err) {
      if (handleUnauthorized(err.message)) return;
      setError(err.message);
    }
  };

  const createTask = async () => {
    resetAlerts();
    try {
      await apiRequest('/tasks', 'POST', token, taskForm);
      setMessage('Task created');
      setTaskForm({ title: '', description: '', status: 'pending' });
      await loadTasks();
    } catch (err) {
      if (handleUnauthorized(err.message)) return;
      setError(err.message);
    }
  };

  const updateTaskStatus = async (id, status) => {
    resetAlerts();
    try {
      await apiRequest(`/tasks/${id}`, 'PUT', token, { status });
      setMessage('Task updated');
      await loadTasks();
    } catch (err) {
      if (handleUnauthorized(err.message)) return;
      setError(err.message);
    }
  };

  const deleteTask = async (id) => {
    resetAlerts();
    try {
      await apiRequest(`/tasks/${id}`, 'DELETE', token);
      setMessage('Task deleted');
      await loadTasks();
    } catch (err) {
      if (handleUnauthorized(err.message)) return;
      setError(err.message);
    }
  };

  useEffect(() => {
    if (token) loadTasks();
  }, [token]);

  return (
    <div className="page">
      <div className="card">
        <h1>Primetrade Assignment</h1>
        <p className="subtitle">MERN Auth + RBAC + Task CRUD</p>

        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}

        {!isLoggedIn ? (
          <div className="section">
            <h2>Register / Login</h2>
            <input placeholder="Name" value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} />
            <input placeholder="Email" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} />
            <input type="password" placeholder="Password" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} />
            <div className="row">
              <button onClick={register}>Register</button>
              <button className="secondary" onClick={login}>Login</button>
            </div>
          </div>
        ) : (
          <>
            <div className="section">
              <h2>Dashboard</h2>
              <p><strong>User:</strong> {user?.name || 'User'} ({user?.role || 'user'})</p>
              <div className="row">
                <button onClick={loadTasks}>Refresh Tasks</button>
                <button className="secondary" onClick={logout}>Logout</button>
              </div>
            </div>

            <div className="section">
              <h2>Create Task</h2>
              <input placeholder="Title" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} />
              <input placeholder="Description" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} />
              <select value={taskForm.status} onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <button onClick={createTask}>Create</button>
            </div>

            <div className="section">
              <h2>Tasks</h2>
              {tasks.length === 0 ? (
                <p>No tasks found</p>
              ) : (
                <ul className="taskList">
                  {tasks.map((task) => (
                    <li key={task._id}>
                      <div>
                        <strong>{task.title}</strong>
                        <p>{task.description || 'No description'}</p>
                        <small>Status: {task.status}</small>
                      </div>
                      <div className="row">
                        <button className="small" onClick={() => updateTaskStatus(task._id, 'completed')}>Mark Done</button>
                        <button className="small secondary" onClick={() => deleteTask(task._id)}>Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
