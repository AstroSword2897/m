import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    reminders: boolean;
    studyReminders: boolean;
  };
  study: {
    defaultSessionLength: number;
    breakLength: number;
    autoStartBreaks: boolean;
    showProgress: boolean;
  };
  privacy: {
    shareProgress: boolean;
    publicProfile: boolean;
    allowMessages: boolean;
  };
  display: {
    language: string;
    timezone: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
  };
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container">
      <div class="header">
        <h1>⚙️ Settings</h1>
        <button class="btn-primary" (click)="saveSettings()">Save Changes</button>
      </div>

      <div class="settings-grid">
        <!-- Appearance -->
        <div class="settings-section">
          <h2>🎨 Appearance</h2>
          <div class="setting-item">
            <label for="theme">Theme</label>
            <select id="theme" [(ngModel)]="settings.theme" (change)="applyTheme()">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>
          
          <div class="setting-item">
            <label for="language">Language</label>
            <select id="language" [(ngModel)]="settings.display.language">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="zh">中文</option>
              <option value="ja">日本語</option>
            </select>
          </div>
          
          <div class="setting-item">
            <label for="timeFormat">Time Format</label>
            <select id="timeFormat" [(ngModel)]="settings.display.timeFormat">
              <option value="12h">12-hour (AM/PM)</option>
              <option value="24h">24-hour</option>
            </select>
          </div>
        </div>

        <!-- Notifications -->
        <div class="settings-section">
          <h2>🔔 Notifications</h2>
          <div class="setting-item">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                [(ngModel)]="settings.notifications.email"
              >
              Email Notifications
            </label>
          </div>
          
          <div class="setting-item">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                [(ngModel)]="settings.notifications.push"
              >
              Push Notifications
            </label>
          </div>
          
          <div class="setting-item">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                [(ngModel)]="settings.notifications.reminders"
              >
              Study Reminders
            </label>
          </div>
          
          <div class="setting-item">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                [(ngModel)]="settings.notifications.studyReminders"
              >
              Break Reminders
            </label>
          </div>
        </div>

        <!-- Study Preferences -->
        <div class="settings-section">
          <h2>📚 Study Preferences</h2>
          <div class="setting-item">
            <label for="sessionLength">Default Session Length (minutes)</label>
            <input 
              type="number" 
              id="sessionLength" 
              [(ngModel)]="settings.study.defaultSessionLength"
              min="5"
              max="120"
            >
          </div>
          
          <div class="setting-item">
            <label for="breakLength">Break Length (minutes)</label>
            <input 
              type="number" 
              id="breakLength" 
              [(ngModel)]="settings.study.breakLength"
              min="1"
              max="30"
            >
          </div>
          
          <div class="setting-item">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                [(ngModel)]="settings.study.autoStartBreaks"
              >
              Auto-start breaks after sessions
            </label>
          </div>
          
          <div class="setting-item">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                [(ngModel)]="settings.study.showProgress"
              >
              Show progress indicators
            </label>
          </div>
        </div>

        <!-- Privacy -->
        <div class="settings-section">
          <h2>🔒 Privacy</h2>
          <div class="setting-item">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                [(ngModel)]="settings.privacy.shareProgress"
              >
              Share progress with study groups
            </label>
          </div>
          
          <div class="setting-item">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                [(ngModel)]="settings.privacy.publicProfile"
              >
              Public profile
            </label>
          </div>
          
          <div class="setting-item">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                [(ngModel)]="settings.privacy.allowMessages"
              >
              Allow messages from other users
            </label>
          </div>
        </div>

        <!-- Account -->
        <div class="settings-section">
          <h2>👤 Account</h2>
          <div class="profile-info">
            <div class="avatar-section">
              <div class="avatar">👤</div>
              <button class="btn-secondary">Change Avatar</button>
            </div>
            
            <div class="profile-details">
              <div class="setting-item">
                <label for="displayName">Display Name</label>
                <input 
                  type="text" 
                  id="displayName" 
                  value="Study User"
                  placeholder="Enter your display name"
                >
              </div>
              
              <div class="setting-item">
                <label for="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  value="user@example.com"
                  placeholder="Enter your email"
                >
              </div>
              
              <div class="setting-item">
                <label for="timezone">Timezone</label>
                <select id="timezone" [(ngModel)]="settings.display.timezone">
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Data Management -->
        <div class="settings-section">
          <h2>💾 Data Management</h2>
          <div class="data-actions">
            <div class="action-item">
              <h4>Export Data</h4>
              <p>Download all your study data as a JSON file</p>
              <button class="btn-secondary" (click)="exportData()">Export Data</button>
            </div>
            
            <div class="action-item">
              <h4>Import Data</h4>
              <p>Import study data from a JSON file</p>
              <input 
                type="file" 
                id="importFile" 
                accept=".json"
                (change)="importData($event)"
                style="display: none;"
              >
              <button class="btn-secondary" (click)="triggerImport()">
                Import Data
              </button>
            </div>
            
            <div class="action-item">
              <h4>Clear All Data</h4>
              <p>Permanently delete all your study data</p>
              <button class="btn-danger" (click)="clearAllData()">Clear All Data</button>
            </div>
          </div>
        </div>

        <!-- About -->
        <div class="settings-section">
          <h2>ℹ️ About</h2>
          <div class="about-info">
            <div class="app-info">
              <h3>CPRSCAC Study App</h3>
              <p>Version 1.0.0</p>
              <p>A comprehensive study productivity companion</p>
            </div>
            
            <div class="links">
              <a href="#" class="link">Privacy Policy</a>
              <a href="#" class="link">Terms of Service</a>
              <a href="#" class="link">Help & Support</a>
              <a href="#" class="link">Report a Bug</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Status -->
      <div class="save-status" *ngIf="showSaveStatus">
        <span class="status-message" [class]="saveStatus">
          {{ saveStatus === 'success' ? '✅ Settings saved successfully!' : '❌ Failed to save settings' }}
        </span>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
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

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 30px;
    }

    .settings-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .settings-section h2 {
      color: #333;
      margin: 0 0 20px 0;
      font-size: 1.3rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .setting-item {
      margin-bottom: 20px;
    }

    .setting-item label {
      display: block;
      margin-bottom: 8px;
      color: #333;
      font-weight: 500;
    }

    .setting-item input[type="text"],
    .setting-item input[type="email"],
    .setting-item input[type="number"],
    .setting-item select {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s ease;
    }

    .setting-item input:focus,
    .setting-item select:focus {
      outline: none;
      border-color: #667eea;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      font-weight: 500;
      color: #333;
    }

    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: #667eea;
    }

    .profile-info {
      display: flex;
      gap: 24px;
      align-items: flex-start;
    }

    .avatar-section {
      text-align: center;
    }

    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin-bottom: 12px;
    }

    .profile-details {
      flex: 1;
    }

    .data-actions {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .action-item {
      padding: 16px;
      border: 1px solid #eee;
      border-radius: 8px;
      background: #f8f9fa;
    }

    .action-item h4 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .action-item p {
      margin: 0 0 12px 0;
      color: #666;
      font-size: 0.9rem;
    }

    .btn-secondary {
      background: #f8f9fa;
      color: #333;
      border: 1px solid #ddd;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-secondary:hover {
      background: #e9ecef;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-danger:hover {
      background: #c82333;
    }

    .about-info {
      text-align: center;
    }

    .app-info h3 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .app-info p {
      margin: 0 0 4px 0;
      color: #666;
    }

    .links {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      justify-content: center;
      margin-top: 20px;
    }

    .link {
      color: #667eea;
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.3s ease;
    }

    .link:hover {
      color: #764ba2;
      text-decoration: underline;
    }

    .save-status {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 1000;
      animation: slideIn 0.3s ease;
    }

    .status-message {
      font-weight: 500;
    }

    .status-message.success {
      color: #4caf50;
    }

    .status-message.error {
      color: #f44336;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .settings-grid {
        grid-template-columns: 1fr;
      }
      
      .profile-info {
        flex-direction: column;
        align-items: center;
      }
      
      .header {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
      }
    }
  `]
})
export class SettingsComponent {
  settings: UserSettings = this.getDefaultSettings();
  showSaveStatus = false;
  saveStatus: 'success' | 'error' = 'success';

  constructor() {
    this.loadSettings();
  }

  getDefaultSettings(): UserSettings {
    return {
      theme: 'light',
      notifications: {
        email: true,
        push: true,
        reminders: true,
        studyReminders: true
      },
      study: {
        defaultSessionLength: 25,
        breakLength: 5,
        autoStartBreaks: true,
        showProgress: true
      },
      privacy: {
        shareProgress: true,
        publicProfile: false,
        allowMessages: true
      },
      display: {
        language: 'en',
        timezone: 'UTC',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h'
      }
    };
  }

  loadSettings(): void {
    const saved = localStorage.getItem('userSettings');
    if (saved) {
      this.settings = { ...this.getDefaultSettings(), ...JSON.parse(saved) };
    }
    this.applyTheme();
  }

  saveSettings(): void {
    try {
      localStorage.setItem('userSettings', JSON.stringify(this.settings));
      this.showSaveStatus = true;
      this.saveStatus = 'success';
      setTimeout(() => {
        this.showSaveStatus = false;
      }, 3000);
    } catch (error) {
      this.showSaveStatus = true;
      this.saveStatus = 'error';
      setTimeout(() => {
        this.showSaveStatus = false;
      }, 3000);
    }
  }

  applyTheme(): void {
    const root = document.documentElement;
    if (this.settings.theme === 'dark' || 
        (this.settings.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark-theme');
    } else {
      root.classList.remove('dark-theme');
    }
  }

  exportData(): void {
    const data = {
      flashcards: JSON.parse(localStorage.getItem('flashcards') || '[]'),
      quizzes: JSON.parse(localStorage.getItem('quizzes') || '[]'),
      studySessions: JSON.parse(localStorage.getItem('studySessions') || '[]'),
      studyEvents: JSON.parse(localStorage.getItem('studyEvents') || '[]'),
      studyGroups: JSON.parse(localStorage.getItem('studyGroups') || '[]'),
      settings: this.settings
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  importData(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          
          if (data.flashcards) localStorage.setItem('flashcards', JSON.stringify(data.flashcards));
          if (data.quizzes) localStorage.setItem('quizzes', JSON.stringify(data.quizzes));
          if (data.studySessions) localStorage.setItem('studySessions', JSON.stringify(data.studySessions));
          if (data.studyEvents) localStorage.setItem('studyEvents', JSON.stringify(data.studyEvents));
          if (data.studyGroups) localStorage.setItem('studyGroups', JSON.stringify(data.studyGroups));
          if (data.settings) {
            this.settings = { ...this.getDefaultSettings(), ...data.settings };
            this.applyTheme();
          }
          
          alert('Data imported successfully!');
        } catch (error) {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  }

  clearAllData(): void {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      this.settings = this.getDefaultSettings();
      this.applyTheme();
      alert('All data has been cleared.');
    }
  }

  exportSettings() {
    // ... (logic from before)
  }

  importSettings(event: any) {
    // ... (logic from before)
  }

  triggerImport() {
    document.getElementById('importFile')?.click();
  }
}
