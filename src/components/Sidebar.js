import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Heart, Home, MessageCircle, BookOpen, TrendingUp, Library, Wind, LogOut } from 'lucide-react';
import axios from 'axios';
import { API } from '../App';
import { toast } from 'sonner';

const Sidebar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('session_token')}` }
      });
      onLogout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      onLogout();
      navigate('/login');
    }
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: MessageCircle, label: 'Feed', path: '/feed' },
    { icon: BookOpen, label: 'Journal', path: '/journal' },
    { icon: TrendingUp, label: 'Mood Tracker', path: '/mood' },
    { icon: Library, label: 'Resources', path: '/resources' },
    { icon: Wind, label: 'Calm Tools', path: '/calm' },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white/70 backdrop-blur-sm border-r border-gray-200 shadow-lg">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center space-x-2 mb-8">
          <Heart className="text-green-600" size={32} fill="currentColor" />
          <h1 className="text-2xl font-bold text-gray-800">ShareSpace</h1>
        </div>

        {/* User Info */}
        <div className="mb-8 p-4 bg-green-50 rounded-2xl">
          <p className="text-sm text-gray-600 mb-1">Logged in as</p>
          <p className="font-semibold text-gray-800">{user.name}</p>
          <p className="text-xs text-gray-500 mt-1">Anonymous ID: {user.anonymous_id}</p>
        </div>

        {/* Menu Items */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = window.location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-6 right-6">
          <Button
            data-testid="logout-btn"
            onClick={handleLogout}
            variant="outline"
            className="w-full rounded-xl border-red-200 text-red-600 hover:bg-red-50"
          >
            <LogOut size={20} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;