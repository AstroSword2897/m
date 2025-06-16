import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

interface StudySession {
  id: number;
  subject: string;
  topic: string;
  duration: number;
  completed: boolean;
}

interface DailyProgress {
  subject: string;
  progress: number;
  target: number;
}

const Dashboard = () => {
  const [studySessions] = useState<StudySession[]>([
    { id: 1, subject: 'AP Biology', topic: 'Cell Structure', duration: 30, completed: false },
    { id: 2, subject: 'AP Calculus', topic: 'Derivatives', duration: 45, completed: false },
    { id: 3, subject: 'AP Chemistry', topic: 'Chemical Reactions', duration: 60, completed: false },
  ]);

  const [dailyProgress] = useState<DailyProgress[]>([
    { subject: 'AP Biology', progress: 75, target: 120 },
    { subject: 'AP Calculus', progress: 60, target: 90 },
    { subject: 'AP Chemistry', progress: 45, target: 90 },
  ]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, Student!</h1>
        <p>Here's your study overview for today</p>
      </div>

      <div className="dashboard-grid">
        {/* Today's Schedule */}
        <div className="card schedule-card">
          <h2>Today's Schedule</h2>
          <div className="schedule-list">
            {studySessions.map((session) => (
              <div key={session.id} className="schedule-item">
                <div className="schedule-info">
                  <h3>{session.subject}</h3>
                  <p>{session.topic}</p>
                  <span className="duration">{session.duration} minutes</span>
                </div>
                <button className={session.completed ? 'completed' : ''}>
                  {session.completed ? 'Completed' : 'Start'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="card progress-card">
          <h2>Study Progress</h2>
          <div className="progress-list">
            {dailyProgress.map((item) => (
              <div key={item.subject} className="progress-item">
                <div className="progress-info">
                  <h3>{item.subject}</h3>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${(item.progress / item.target) * 100}%` }}
                    />
                  </div>
                  <span className="progress-text">
                    {item.progress} / {item.target} minutes
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card quick-actions-card">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            <Link to="/flashcards" className="quick-action">
              <span className="icon">🎴</span>
              <span>Review Flashcards</span>
            </Link>
            <Link to="/practice" className="quick-action">
              <span className="icon">✍️</span>
              <span>Practice Questions</span>
            </Link>
            <Link to="/study-materials" className="quick-action">
              <span className="icon">📝</span>
              <span>Study Materials</span>
            </Link>
            <Link to="/schedule" className="quick-action">
              <span className="icon">📅</span>
              <span>Schedule</span>
            </Link>
          </div>
        </div>

        {/* Upcoming Exams */}
        <div className="card exams-card">
          <h2>Upcoming Exams</h2>
          <div className="exams-list">
            <div className="exam-item">
              <div className="exam-info">
                <h3>AP Biology</h3>
                <p>Unit 3: Cellular Energetics</p>
                <span className="exam-date">May 15, 2024</span>
              </div>
              <div className="exam-progress">
                <div className="progress-circle">
                  <span>75%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 