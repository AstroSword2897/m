import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface StudySession {
  id: string;
  date: Date;
  duration: number; // in minutes
  type: 'flashcards' | 'practice' | 'reading';
  category: string;
  score?: number; // for practice sessions
  cardsReviewed?: number; // for flashcard sessions
}

interface ProgressStats {
  totalSessions: number;
  totalTime: number;
  averageScore: number;
  streakDays: number;
  categories: { [key: string]: number };
}

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="progress-container">
      <div class="header">
        <h1>📈 Progress Tracking</h1>
        <button class="btn-primary" (click)="addSession()">+ Add Study Session</button>
      </div>

      <!-- Add Session Form -->
      <div class="form-overlay" *ngIf="showAddForm" (click)="closeForm()">
        <div class="form-container" (click)="$event.stopPropagation()">
          <h2>Add Study Session</h2>
          <form (ngSubmit)="saveSession()" #sessionForm="ngForm">
            <div class="form-group">
              <label for="type">Session Type</label>
              <select id="type" name="type" [(ngModel)]="currentSession.type" required>
                <option value="flashcards">Flashcards</option>
                <option value="practice">Practice Quiz</option>
                <option value="reading">Reading</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="category">Category</label>
              <input 
                type="text" 
                id="category" 
                name="category" 
                [(ngModel)]="currentSession.category" 
                required
                placeholder="e.g., Math, Science, History"
              >
            </div>
            
            <div class="form-group">
              <label for="duration">Duration (minutes)</label>
              <input 
                type="number" 
                id="duration" 
                name="duration" 
                [(ngModel)]="currentSession.duration" 
                required
                min="1"
                placeholder="How long did you study?"
              >
            </div>
            
            <div class="form-group" *ngIf="currentSession.type === 'practice'">
              <label for="score">Score (%)</label>
              <input 
                type="number" 
                id="score" 
                name="score" 
                [(ngModel)]="currentSession.score" 
                min="0"
                max="100"
                placeholder="What was your score?"
              >
            </div>
            
            <div class="form-group" *ngIf="currentSession.type === 'flashcards'">
              <label for="cardsReviewed">Cards Reviewed</label>
              <input 
                type="number" 
                id="cardsReviewed" 
                name="cardsReviewed" 
                [(ngModel)]="currentSession.cardsReviewed" 
                min="1"
                placeholder="How many cards did you review?"
              >
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="closeForm()">Cancel</button>
              <button type="submit" class="btn-primary" [disabled]="!sessionForm.form.valid">
                Add Session
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <h3>{{ stats.totalSessions }}</h3>
            <p>Total Sessions</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⏱️</div>
          <div class="stat-content">
            <h3>{{ formatTime(stats.totalTime) }}</h3>
            <p>Total Study Time</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-content">
            <h3>{{ stats.averageScore.toFixed(1) }}%</h3>
            <p>Average Score</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🔥</div>
          <div class="stat-content">
            <h3>{{ stats.streakDays }}</h3>
            <p>Day Streak</p>
          </div>
        </div>
      </div>

      <!-- Charts and Analytics -->
      <div class="analytics-section">
        <div class="chart-container">
          <h2>Study Time by Category</h2>
          <div class="category-chart">
            <div 
              class="category-bar" 
              *ngFor="let category of getCategoryStats()"
              [style.width.%]="category.percentage"
            >
              <span class="category-name">{{ category.name }}</span>
              <span class="category-time">{{ formatTime(category.time) }}</span>
            </div>
          </div>
        </div>
        
        <div class="chart-container">
          <h2>Recent Activity</h2>
          <div class="activity-chart">
            <div 
              class="activity-day" 
              *ngFor="let day of getLast7Days()"
              [class.has-activity]="day.hasActivity"
              [style.height.px]="day.height"
            >
              <span class="day-label">{{ day.date }}</span>
              <span class="day-time" *ngIf="day.hasActivity">{{ formatTime(day.time) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Sessions -->
      <div class="recent-sessions">
        <h2>Recent Study Sessions</h2>
        <div class="sessions-list" *ngIf="recentSessions.length > 0">
          <div class="session-item" *ngFor="let session of recentSessions">
            <div class="session-info">
              <div class="session-type">
                <span class="type-icon">{{ getTypeIcon(session.type) }}</span>
                <span class="type-name">{{ session.type }}</span>
              </div>
              <div class="session-details">
                <span class="category">{{ session.category }}</span>
                <span class="duration">{{ formatTime(session.duration) }}</span>
                <span class="score" *ngIf="session.score">{{ session.score }}%</span>
                <span class="cards" *ngIf="session.cardsReviewed">{{ session.cardsReviewed }} cards</span>
              </div>
              <div class="session-date">
                {{ formatDate(session.date) }}
              </div>
            </div>
            <div class="session-actions">
              <button class="btn-icon" (click)="editSession(session)">✏️</button>
              <button class="btn-icon" (click)="deleteSession(session)">🗑️</button>
            </div>
          </div>
        </div>
        
        <div class="empty-state" *ngIf="recentSessions.length === 0">
          <div class="empty-icon">📝</div>
          <h3>No study sessions yet</h3>
          <p>Start tracking your progress by adding your first study session!</p>
          <button class="btn-primary" (click)="addSession()">Add First Session</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .progress-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .header h1 {
      color: #333;
      margin: 0;
      font-size: 2rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .stats-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      font-size: 2rem;
    }

    .stat-content h3 {
      margin: 0 0 4px 0;
      color: #333;
      font-size: 1.8rem;
      font-weight: bold;
    }

    .stat-content p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .analytics-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 40px;
    }

    .chart-container {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .chart-container h2 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 1.3rem;
    }

    .category-chart {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .category-bar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-width: 100px;
      transition: width 0.3s ease;
    }

    .category-name {
      font-weight: 500;
    }

    .category-time {
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .activity-chart {
      display: flex;
      gap: 8px;
      align-items: end;
      height: 200px;
    }

    .activity-day {
      flex: 1;
      background: #f0f0f0;
      border-radius: 4px 4px 0 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: end;
      padding: 8px 4px;
      min-height: 40px;
      transition: all 0.3s ease;
    }

    .activity-day.has-activity {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .day-label {
      font-size: 0.8rem;
      margin-bottom: 4px;
    }

    .day-time {
      font-size: 0.7rem;
      opacity: 0.8;
    }

    .recent-sessions {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .recent-sessions h2 {
      margin: 0 0 20px 0;
      color: #333;
    }

    .sessions-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .session-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border: 1px solid #eee;
      border-radius: 8px;
      transition: background-color 0.3s ease;
    }

    .session-item:hover {
      background-color: #f8f9ff;
    }

    .session-info {
      flex: 1;
    }

    .session-type {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .type-icon {
      font-size: 1.2rem;
    }

    .type-name {
      font-weight: 500;
      color: #333;
      text-transform: capitalize;
    }

    .session-details {
      display: flex;
      gap: 16px;
      margin-bottom: 4px;
    }

    .session-details span {
      font-size: 0.9rem;
      color: #666;
    }

    .session-date {
      font-size: 0.8rem;
      color: #999;
    }

    .session-actions {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      background: none;
      border: none;
      font-size: 16px;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: background-color 0.3s ease;
    }

    .btn-icon:hover {
      background-color: #f5f5f5;
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .form-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .form-container {
      background: white;
      border-radius: 12px;
      padding: 30px;
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .form-container h2 {
      margin: 0 0 20px 0;
      color: #333;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #333;
      font-weight: 500;
    }

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 30px;
    }

    .btn-secondary {
      background: #f8f9fa;
      color: #333;
      border: 1px solid #ddd;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-secondary:hover {
      background: #e9ecef;
    }

    @media (max-width: 768px) {
      .analytics-section {
        grid-template-columns: 1fr;
      }
      
      .stats-overview {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .session-details {
        flex-direction: column;
        gap: 4px;
      }
    }
  `]
})
export class ProgressComponent implements OnInit {
  studySessions: StudySession[] = [];
  recentSessions: StudySession[] = [];
  stats: ProgressStats = {
    totalSessions: 0,
    totalTime: 0,
    averageScore: 0,
    streakDays: 0,
    categories: {}
  };
  
  showAddForm = false;
  currentSession: StudySession = this.createEmptySession();

  ngOnInit(): void {
    this.loadSessions();
    this.calculateStats();
  }

  createEmptySession(): StudySession {
    return {
      id: '',
      date: new Date(),
      duration: 0,
      type: 'flashcards',
      category: ''
    };
  }

  loadSessions(): void {
    const saved = localStorage.getItem('studySessions');
    if (saved) {
      this.studySessions = JSON.parse(saved).map((session: any) => ({
        ...session,
        date: new Date(session.date)
      }));
    }
    this.updateRecentSessions();
  }

  saveSessions(): void {
    localStorage.setItem('studySessions', JSON.stringify(this.studySessions));
    this.updateRecentSessions();
  }

  updateRecentSessions(): void {
    this.recentSessions = this.studySessions
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10);
  }

  calculateStats(): void {
    const practiceSessions = this.studySessions.filter(s => s.type === 'practice' && s.score !== undefined);
    const totalScore = practiceSessions.reduce((sum, s) => sum + (s.score || 0), 0);
    
    this.stats = {
      totalSessions: this.studySessions.length,
      totalTime: this.studySessions.reduce((sum, s) => sum + s.duration, 0),
      averageScore: practiceSessions.length > 0 ? totalScore / practiceSessions.length : 0,
      streakDays: this.calculateStreak(),
      categories: this.calculateCategoryStats()
    };
  }

  calculateStreak(): number {
    if (this.studySessions.length === 0) return 0;
    
    const sortedSessions = this.studySessions
      .sort((a, b) => b.date.getTime() - a.date.getTime());
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 365; i++) {
      const hasSession = sortedSessions.some(session => {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === currentDate.getTime();
      });
      
      if (hasSession) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  }

  calculateCategoryStats(): { [key: string]: number } {
    const stats: { [key: string]: number } = {};
    this.studySessions.forEach(session => {
      stats[session.category] = (stats[session.category] || 0) + session.duration;
    });
    return stats;
  }

  getCategoryStats(): Array<{name: string, time: number, percentage: number}> {
    const totalTime = this.stats.totalTime;
    if (totalTime === 0) return [];
    
    return Object.entries(this.stats.categories)
      .map(([name, time]) => ({
        name,
        time,
        percentage: (time / totalTime) * 100
      }))
      .sort((a, b) => b.time - a.time);
  }

  getLast7Days(): Array<{date: string, time: number, hasActivity: boolean, height: number}> {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const daySessions = this.studySessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate.toDateString() === date.toDateString();
      });
      
      const totalTime = daySessions.reduce((sum, s) => sum + s.duration, 0);
      const maxTime = Math.max(...this.studySessions.map(s => s.duration), 60);
      const height = totalTime > 0 ? Math.max(40, (totalTime / maxTime) * 160) : 40;
      
      days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        time: totalTime,
        hasActivity: totalTime > 0,
        height
      });
    }
    
    return days;
  }

  addSession(): void {
    this.currentSession = this.createEmptySession();
    this.showAddForm = true;
  }

  saveSession(): void {
    this.currentSession.id = Date.now().toString();
    this.studySessions.push({ ...this.currentSession });
    this.saveSessions();
    this.calculateStats();
    this.closeForm();
  }

  editSession(session: StudySession): void {
    this.currentSession = { ...session };
    this.showAddForm = true;
  }

  deleteSession(session: StudySession): void {
    if (confirm('Are you sure you want to delete this session?')) {
      this.studySessions = this.studySessions.filter(s => s.id !== session.id);
      this.saveSessions();
      this.calculateStats();
    }
  }

  closeForm(): void {
    this.showAddForm = false;
    this.currentSession = this.createEmptySession();
  }

  getTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      flashcards: '🗂️',
      practice: '🎯',
      reading: '📖'
    };
    return icons[type] || '📚';
  }

  formatTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
