import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

interface NavigationProps {
  onThemeToggle: () => void;
  isDarkMode: boolean;
}

const Navigation = ({ onThemeToggle, isDarkMode }: NavigationProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/subjects', label: 'AP Subjects', icon: '📚' },
    { path: '/study-materials', label: 'Study Materials', icon: '📝' },
    { path: '/practice', label: 'Practice', icon: '✍️' },
    { path: '/flashcards', label: 'Flashcards', icon: '🎴' },
    { path: '/schedule', label: 'Schedule', icon: '📅' },
    { path: '/progress', label: 'Progress', icon: '📈' },
    { path: '/collaborate', label: 'Collaborate', icon: '👥' },
  ];

  return (
    <div className={`navigation ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Top Bar */}
      <div className="top-bar">
        <button 
          className="menu-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? '◀' : '▶'}
        </button>
        <div className="top-bar-content">
          <h1>StudyFlow</h1>
          <div className="top-bar-actions">
            <button className="theme-toggle" onClick={onThemeToggle}>
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <div className="user-profile">
              <img src="/default-avatar.png" alt="Profile" />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <nav>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {isSidebarOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Navigation; 