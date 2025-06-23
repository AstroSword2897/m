import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Dashboard from './pages/Dashboard'
import Subjects from './pages/Subjects'
import StudyMaterials from './pages/StudyMaterials'
import Practice from './pages/Practice'
import Flashcards from './pages/Flashcards'
import Schedule from './pages/Schedule'
import Progress from './pages/Progress'
import Collaborate from './pages/Collaborate'
import UserProfile from './pages/UserProfile'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import StudySessions from './pages/StudySessions'
import StudyFlowSetup from './pages/StudyFlowSetup'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import './App.css'

function App() {

  return (
    <Router>
      <div className="app">
        <Navigation onThemeToggle={() => {}} isDarkMode={true} /> {/* Placeholder for theme toggle, assuming dark by default */}
        <main className="main-content">
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<StudyFlowSetup />} />
            <Route path="/study-plan" element={<StudyFlowSetup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/study-materials" element={<StudyMaterials />} />
            <Route path="/studysessions" element={<StudySessions />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/collaborate" element={<Collaborate />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App 