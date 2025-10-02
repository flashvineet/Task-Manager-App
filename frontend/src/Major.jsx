import React, { useState, useEffect, createContext, useContext } from 'react';
import './Styles.css';
import Dashboard from './Dashboard';

const API_BASE_URL = 'http://localhost:5000/api';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

//Login
const Login = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        login(data.data.token, data.data.user);
      } else {
        setApiError(data.message || 'Login failed');
      }
    } catch (error) {
      setApiError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="login-card w-full max-w-md">
        <h2 style={{fontSize: "22px",fontWeight: "bold"}}>Sign in with email</h2>
        <p>Welcome back,
          Please Login to your account !
        </p>

        {apiError && <div className="alert alert-error">{apiError}</div>}

        <div className="space-y-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`input ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Email"
          />
          {errors.email && <p className="error-message">{errors.email}</p>}

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`input ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Password"
          />
          {errors.password && <p className="error-message">{errors.password}</p>}

          <a href="#" className="forgot">Forgot password?</a>

          <button onClick={handleSubmit} disabled={loading} className="btn">
            {loading ? 'Logging in...' : 'Get Started'}
          </button>
        </div>

        <div className="or">Or sign in with</div>
        <div className="socials">
          <button className="social-btn">G</button>
          <button className="social-btn">f</button>
          <button className="social-btn"></button>
        </div>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Don&apos;t have an account?{' '}
            <button onClick={onSwitchToRegister} className="text-blue-600 font-medium">
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

//Register
const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!formData.email) newErrors.email = 'Email is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => onSwitchToLogin(), 2000);
      } else {
        setApiError(data.message || 'Registration failed');
      }
    } catch (err) {
      setApiError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="login-card w-full max-w-md">
        <h2>Create an account</h2>
        <p>Start your journey by creating a new account. It’s free!</p>

        {apiError && <div className="alert alert-error">{apiError}</div>}
        {success && <div className="alert alert-success">Registration successful! Redirecting...</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="input" />
          {errors.name && <p className="error-message">{errors.name}</p>}

          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="input" />
          {errors.email && <p className="error-message">{errors.email}</p>}

          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="input" />
          {errors.password && <p className="error-message">{errors.password}</p>}

          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="input" />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}

          <button type="submit" disabled={loading || success} className="btn">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="or">Or sign up with</div>
        <div className="socials">
          <button className="social-btn">G</button>
          <button className="social-btn">f</button>
          <button className="social-btn"></button>
        </div>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className="text-blue-600 font-medium">Login here</button>
          </p>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [authMode, setAuthMode] = useState('login');
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="spinner"></div></div>;

  if (!user) {
    return authMode === 'login'
      ? <Login onSwitchToRegister={() => setAuthMode('register')} />
      : <Register onSwitchToLogin={() => setAuthMode('login')} />;
  }

  return <Dashboard />;
};

export default function Major() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
