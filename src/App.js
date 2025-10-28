import { useState, useEffect } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import FeedPage from './pages/FeedPage';
import CreatePostPage from './pages/CreatePostPage';
import JournalPage from './pages/JournalPage';
import MoodTrackerPage from './pages/MoodTrackerPage';
import ResourcesPage from './pages/ResourcesPage';
import CalmToolsPage from './pages/CalmToolsPage';
import { Toaster } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export { API };

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const sessionToken = localStorage.getItem('session_token');
      if (!sessionToken) {
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${sessionToken}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('session_token');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (sessionToken, userData) => {
    localStorage.setItem('session_token', sessionToken);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('session_token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <Toaster position="top-center" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/feed" element={user ? <FeedPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/create" element={user ? <CreatePostPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/journal" element={user ? <JournalPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/mood" element={user ? <MoodTrackerPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/resources" element={user ? <ResourcesPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/calm" element={user ? <CalmToolsPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;