import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="sidebar">
      <div class="logo">
        <h2>CPRSCAC</h2>
      </div>
      <ul class="nav-links">
        <li>
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            📊 Dashboard
          </a>
        </li>
        <li>
          <a routerLink="/flashcards" routerLinkActive="active">
            🗂️ Flashcards
          </a>
        </li>
        <li>
          <a routerLink="/practice" routerLinkActive="active">
            🎯 Practice
          </a>
        </li>
        <li>
          <a routerLink="/progress" routerLinkActive="active">
            📈 Progress
          </a>
        </li>
        <li>
          <a routerLink="/schedule" routerLinkActive="active">
            📅 Schedule
          </a>
        </li>
        <li>
          <a routerLink="/collaborate" routerLinkActive="active">
            👥 Collaborate
          </a>
        </li>
        <li>
          <a routerLink="/settings" routerLinkActive="active">
            ⚙️ Settings
          </a>
        </li>
      </ul>
    </nav>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      box-shadow: 2px 0 5px rgba(0,0,0,0.1);
    }
    
    .logo h2 {
      margin: 0 0 30px 0;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
    }
    
    .nav-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .nav-links li {
      margin-bottom: 10px;
    }
    
    .nav-links a {
      display: block;
      padding: 12px 15px;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.3s ease;
      font-size: 16px;
    }
    
    .nav-links a:hover {
      background-color: rgba(255,255,255,0.1);
      transform: translateX(5px);
    }
    
    .nav-links a.active {
      background-color: rgba(255,255,255,0.2);
      font-weight: bold;
    }
  `]
})
export class NavigationComponent {} 