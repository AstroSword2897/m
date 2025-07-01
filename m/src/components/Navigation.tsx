import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';
import { 
  Dashboard, 
  Book, 
  Style, 
  Edit, 
  Event, 
  TrendingUp, 
  Group, 
  Person, 
  BarChart, 
  Settings, 
  WbSunny, 
  Brightness2,
  PlaylistAdd
} from '@mui/icons-material';

interface NavigationProps {
  onThemeToggle: () => void;
  isDarkMode: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ onThemeToggle, isDarkMode }) => {
  return (
    <>
      <nav className="sidebar">
        <div className="logo">
          <NavLink to="/">StudyFlow</NavLink>
        </div>
        <ul className="nav-links">
          <li><NavLink to="/study-plan"><PlaylistAdd className="icon" />Study Plan</NavLink></li>
          <li><NavLink to="/dashboard"><Dashboard className="icon" />Dashboard</NavLink></li>
          <li><NavLink to="/studysessions"><Book className="icon" />Study Sessions</NavLink></li>
          <li><NavLink to="/analytics"><BarChart className="icon" />Analytics</NavLink></li>
          <li><NavLink to="/profile"><Person className="icon" />Profile</NavLink></li>
          <li><NavLink to="/settings"><Settings className="icon" />Settings</NavLink></li>
        </ul>
        <div className="theme-toggle">
          <button onClick={onThemeToggle}>
            {isDarkMode ? <WbSunny /> : <Brightness2 />}
            <span style={{ marginLeft: '10px' }}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </nav>
      <div className="auth-buttons">
        <NavLink to="/signin" className="auth-btn">Sign In</NavLink>
        <NavLink to="/signup" className="auth-btn register">Register</NavLink>
      </div>
    </>
  );
};

export default Navigation; 