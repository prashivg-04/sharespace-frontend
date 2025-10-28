import { useState } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

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
