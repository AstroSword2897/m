import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadService, UploadProgress } from '../../services/file-upload.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="file-upload-container">
      <div 
        class="upload-area" 
        [class.dragover]="isDragOver"
        [class.uploading]="isUploading"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        (click)="fileInput.click()"
      >
        <div class="upload-content">
          <div class="upload-icon">📁</div>
          <h3>Upload Files</h3>
          <p>Drag and drop files here or click to browse</p>
          <p class="file-size-limit">Maximum file size: 1GB</p>
          <input 
            #fileInput 
            type="file" 
            multiple 
            (change)="onFileSelected($event)"
            style="display: none;"
            accept="*/*"
          >
        </div>
      </div>

      <!-- Upload Progress -->
      <div class="upload-progress" *ngIf="uploadProgress.length > 0">
        <h4>Upload Progress</h4>
        <div class="progress-item" *ngFor="let progress of uploadProgress">
          <div class="file-info">
            <span class="file-name">{{ progress.fileName }}</span>
            <span class="file-size">{{ formatFileSize(progress.loaded) }} / {{ formatFileSize(progress.total) }}</span>
          </div>
          
          <div class="progress-bar-container">
            <div class="progress-bar" [style.width.%]="progress.percentage"></div>
            <span class="progress-text">{{ progress.percentage }}%</span>
          </div>
          
          <div class="status" [class]="progress.status">
            <span *ngIf="progress.status === 'uploading'">⏳ Uploading...</span>
            <span *ngIf="progress.status === 'completed'">✅ Completed</span>
            <span *ngIf="progress.status === 'error'">❌ Error: {{ progress.error }}</span>
          </div>
        </div>
      </div>

      <!-- Parse Button -->
      <div class="parse-section" *ngIf="completedUploads.length > 0">
        <h4>Parse Files</h4>
        <div class="parse-buttons">
          <button 
            *ngFor="let fileId of completedUploads" 
            class="btn-parse"
            (click)="parseFile(fileId)"
            [disabled]="isParsing"
          >
            🔍 Parse File
          </button>
        </div>
        <div class="parse-status" *ngIf="isParsing">
          <span>⏳ Parsing file...</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .file-upload-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .upload-area {
      border: 2px dashed #ccc;
      border-radius: 12px;
      padding: 40px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: white;
      margin-bottom: 20px;
    }

    .upload-area:hover {
      border-color: #667eea;
      background-color: #f8f9ff;
    }

    .upload-area.dragover {
      border-color: #667eea;
      background-color: #e8f0ff;
      transform: scale(1.02);
    }

    .upload-area.uploading {
      border-color: #ffa500;
      background-color: #fff8e1;
    }

    .upload-content {
      pointer-events: none;
    }

    .upload-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .upload-content h3 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 24px;
    }

    .upload-content p {
      margin: 0 0 8px 0;
      color: #666;
      font-size: 16px;
    }

    .file-size-limit {
      font-size: 14px !important;
      color: #999 !important;
    }

    .upload-progress {
      background: white;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .upload-progress h4 {
      margin: 0 0 16px 0;
      color: #333;
    }

    .progress-item {
      margin-bottom: 16px;
      padding: 12px;
      border: 1px solid #eee;
      border-radius: 8px;
    }

    .file-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .file-name {
      font-weight: 500;
      color: #333;
    }

    .file-size {
      font-size: 14px;
      color: #666;
    }

    .progress-bar-container {
      position: relative;
      height: 20px;
      background-color: #f0f0f0;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 8px;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      transition: width 0.3s ease;
    }

    .progress-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 12px;
      font-weight: 500;
      color: #333;
    }

    .status {
      font-size: 14px;
      font-weight: 500;
    }

    .status.uploading {
      color: #ffa500;
    }

    .status.completed {
      color: #4caf50;
    }

    .status.error {
      color: #f44336;
    }

    .parse-section {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .parse-section h4 {
      margin: 0 0 16px 0;
      color: #333;
    }

    .parse-buttons {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .btn-parse {
      background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
    }

    .btn-parse:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .btn-parse:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .parse-status {
      margin-top: 12px;
      color: #ffa500;
      font-weight: 500;
    }
  `]
})
export class FileUploadComponent {
  @Output() fileParsed = new EventEmitter<any>();

  isDragOver = false;
  isUploading = false;
  isParsing = false;
  uploadProgress: UploadProgress[] = [];
  completedUploads: string[] = [];

  constructor(private fileUploadService: FileUploadService) {
    this.fileUploadService.uploadProgress$.subscribe(progress => {
      this.uploadProgress = progress;
      this.completedUploads = progress
        .filter(p => p.status === 'completed')
        .map(p => p.fileName); // Using fileName as identifier for simplicity
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(Array.from(files));
    }
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files) {
      this.handleFiles(Array.from(files));
    }
  }

  private async handleFiles(files: File[]): Promise<void> {
    this.isUploading = true;

    try {
      for (const file of files) {
        await this.fileUploadService.uploadFile(file);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      this.isUploading = false;
    }
  }

  async parseFile(fileId: string): Promise<void> {
    this.isParsing = true;

    try {
      const result = await this.fileUploadService.parseFile(fileId);
      this.fileParsed.emit(result);
    } catch (error) {
      console.error('Parse error:', error);
    } finally {
      this.isParsing = false;
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
} 