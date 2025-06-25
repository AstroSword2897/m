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
import PrivateRoute from './components/PrivateRoute'
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
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/subjects" element={<PrivateRoute><Subjects /></PrivateRoute>} />
            <Route path="/study-materials" element={<PrivateRoute><StudyMaterials /></PrivateRoute>} />
            <Route path="/studysessions" element={<PrivateRoute><StudySessions /></PrivateRoute>} />
            <Route path="/practice" element={<PrivateRoute><Practice /></PrivateRoute>} />
            <Route path="/flashcards" element={<PrivateRoute><Flashcards /></PrivateRoute>} />
            <Route path="/schedule" element={<PrivateRoute><Schedule /></PrivateRoute>} />
            <Route path="/progress" element={<PrivateRoute><Progress /></PrivateRoute>} />
            <Route path="/collaborate" element={<PrivateRoute><Collaborate /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
            <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App 