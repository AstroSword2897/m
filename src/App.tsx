import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import the actual page and navigation components
import Navigation from '../m/src/components/Navigation';
import Dashboard from '../m/src/pages/Dashboard';
import Flashcards from '../m/src/pages/Flashcards';
import Practice from '../m/src/pages/Practice';
import Progress from '../m/src/pages/Progress';
import Schedule from '../m/src/pages/Schedule';
import Collaborate from '../m/src/pages/Collaborate';
import Settings from '../m/src/pages/Settings';
import Subjects from '../m/src/pages/Subjects';
import StudyMaterials from '../m/src/pages/StudyMaterials';
import UserProfile from '../m/src/pages/UserProfile';
import Analytics from '../m/src/pages/Analytics';
import StudyFlowSetup from '../m/src/pages/StudyFlowSetup';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Router>
      <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
        <Navigation isDarkMode={isDarkMode} onThemeToggle={toggleTheme} />
        <main className="main-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/study-materials" element={<StudyMaterials />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/collaborate" element={<Collaborate />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/study-flow-setup" element={<StudyFlowSetup />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 