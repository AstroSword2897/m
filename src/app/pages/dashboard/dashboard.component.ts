import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FileUploadComponent } from '../../components/file-upload/file-upload.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FileUploadComponent, CommonModule],
  template: `
    <div class="dashboard">
      <h1>Welcome to CPRSCAC v{{ version }}</h1>
      <p>Your study productivity companion</p>
      
      <div class="quick-actions">
        <div class="action-card">
          <h3>📚 Study Sets</h3>
          <p>Create and manage your study materials</p>
          <button class="btn-primary" (click)="navigateTo('/flashcards')">Get Started</button>
        </div>
        
        <div class="action-card">
          <h3>🎯 Practice Questions</h3>
          <p>Test your knowledge with interactive quizzes</p>
          <button class="btn-primary" (click)="navigateTo('/practice')">Start Practice</button>
        </div>
        
        <div class="action-card">
          <h3>📈 Track Progress</h3>
          <p>Monitor your learning journey</p>
          <button class="btn-primary" (click)="navigateTo('/progress')">View Progress</button>
        </div>
      </div>

      <!-- File Upload Section -->
      <div class="upload-section">
        <h2>📁 Upload Study Materials</h2>
        <p>Upload large files (up to 1GB) for analysis and study material creation</p>
        <app-file-upload (fileParsed)="onFileParsed($event)"></app-file-upload>
      </div>

      <!-- Recent Activity -->
      <div class="recent-activity" *ngIf="recentFiles.length > 0">
        <h2>📋 Recent Files</h2>
        <div class="file-list">
          <div class="file-item" *ngFor="let file of recentFiles">
            <div class="file-info">
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ file.size }}</span>
            </div>
            <div class="file-actions">
              <button class="btn-secondary" (click)="viewFile(file)">View</button>
              <button class="btn-secondary" (click)="deleteFile(file)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    h1 {
      color: #333;
      margin-bottom: 10px;
      font-size: 2.5rem;
    }
    
    p {
      color: #666;
      font-size: 1.2rem;
      margin-bottom: 40px;
    }
    
    .quick-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    
    .action-card {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      text-align: center;
      transition: transform 0.3s ease;
    }
    
    .action-card:hover {
      transform: translateY(-5px);
    }
    
    .action-card h3 {
      color: #333;
      margin-bottom: 15px;
      font-size: 1.5rem;
    }
    
    .action-card p {
      color: #666;
      margin-bottom: 20px;
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
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .upload-section {
      background: white;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .upload-section h2 {
      color: #333;
      margin-bottom: 10px;
      font-size: 1.8rem;
    }

    .upload-section p {
      color: #666;
      margin-bottom: 20px;
      font-size: 1rem;
    }

    .recent-activity {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .recent-activity h2 {
      color: #333;
      margin-bottom: 20px;
      font-size: 1.8rem;
    }

    .file-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .file-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border: 1px solid #eee;
      border-radius: 8px;
      transition: background-color 0.3s ease;
    }

    .file-item:hover {
      background-color: #f8f9ff;
    }

    .file-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .file-name {
      font-weight: 500;
      color: #333;
    }

    .file-size {
      font-size: 14px;
      color: #666;
    }

    .file-actions {
      display: flex;
      gap: 8px;
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
      border-color: #adb5bd;
    }
  `]
})
export class DashboardComponent {
  version = '1.0.0';
  recentFiles: Array<{name: string, size: string, id: string}> = [];

  constructor(private router: Router) {}

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  onFileParsed(result: any): void {
    console.log('File parsed:', result);
    // Add the parsed file to recent files
    this.recentFiles.unshift({
      name: result.fileName || 'Unknown File',
      size: this.formatFileSize(result.fileSize || 0),
      id: result.fileId || Date.now().toString()
    });
  }

  viewFile(file: any): void {
    console.log('Viewing file:', file);
    // Implement file viewing logic
  }

  deleteFile(file: any): void {
    console.log('Deleting file:', file);
    this.recentFiles = this.recentFiles.filter(f => f.id !== file.id);
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
} 