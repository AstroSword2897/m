import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

interface NavigationProps {
  onThemeToggle: () => void;
  isDarkMode: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ onThemeToggle, isDarkMode }) => {
  return (
    <nav className="navigation">
      <div className="logo">
        <Link to="/">StudyFlow</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/subjects">Subjects</Link></li>
        <li><Link to="/study-materials">Materials</Link></li>
        <li><Link to="/practice">Practice</Link></li>
        <li><Link to="/flashcards">Flashcards</Link></li>
        <li><Link to="/schedule">Schedule</Link></li>
        <li><Link to="/progress">Progress</Link></li>
        <li><Link to="/collaborate">Collaborate</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/analytics">Analytics</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
      <div className="theme-toggle">
        <button onClick={onThemeToggle}>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </nav>
  );
};

export default Navigation; 