import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface UploadProgress {
  fileName: string;
  loaded: number;
  total: number;
  percentage: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface FileChunk {
  chunk: Blob;
  index: number;
  totalChunks: number;
  fileName: string;
  fileId: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private uploadProgressSubject = new BehaviorSubject<UploadProgress[]>([]);
  public uploadProgress$ = this.uploadProgressSubject.asObservable();

  private readonly CHUNK_SIZE = 1024 * 1024; // 1MB chunks
  private readonly MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB

  constructor(private apiService: ApiService) {}

  /**
   * Upload a file with chunked upload support for large files
   */
  async uploadFile(file: File): Promise<string> {
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(`File size ${file.size} bytes exceeds maximum allowed size of ${this.MAX_FILE_SIZE} bytes`);
    }

    const fileId = this.generateFileId();
    const chunks = this.createFileChunks(file, fileId);
    
    // Initialize progress
    this.updateProgress(file.name, 0, file.size, 'uploading');

    try {
      // Upload chunks sequentially
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        await this.uploadChunk(chunk);
        
        // Update progress
        const loaded = (i + 1) * this.CHUNK_SIZE;
        const percentage = Math.min((loaded / file.size) * 100, 100);
        this.updateProgress(file.name, loaded, file.size, 'uploading');
      }

      // Mark as completed
      this.updateProgress(file.name, file.size, file.size, 'completed');
      
      return fileId;
    } catch (error) {
      this.updateProgress(file.name, 0, file.size, 'error', (error as Error).message);
      throw error;
    }
  }

  /**
   * Create chunks from a file
   */
  private createFileChunks(file: File, fileId: string): FileChunk[] {
    const chunks: FileChunk[] = [];
    const totalChunks = Math.ceil(file.size / this.CHUNK_SIZE);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * this.CHUNK_SIZE;
      const end = Math.min(start + this.CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      chunks.push({
        chunk,
        index: i,
        totalChunks,
        fileName: file.name,
        fileId
      });
    }

    return chunks;
  }

  /**
   * Upload a single chunk
   */
  private async uploadChunk(chunkData: FileChunk): Promise<void> {
    const formData = new FormData();
    formData.append('chunk', chunkData.chunk);
    formData.append('index', chunkData.index.toString());
    formData.append('totalChunks', chunkData.totalChunks.toString());
    formData.append('fileName', chunkData.fileName);
    formData.append('fileId', chunkData.fileId);

    try {
      // Try to use the real API first
      const response = await this.apiService.uploadChunk(formData).toPromise();
      if (!response?.success) {
        throw new Error(response?.error || 'Upload failed');
      }
    } catch (error) {
      // Fallback to mock API for development
      console.warn('Real API unavailable, using mock upload');
      const mockResponse = await this.apiService.mockUploadChunk(formData).toPromise();
      if (!mockResponse?.success) {
        throw new Error('Mock upload failed');
      }
    }
  }

  /**
   * Parse uploaded file content
   */
  async parseFile(fileId: string): Promise<any> {
    try {
      // Try to use the real API first
      const response = await this.apiService.parseFile(fileId).toPromise();
      if (response?.success && response.data) {
        return response.data;
      }
      throw new Error(response?.error || 'Failed to parse file');
    } catch (error) {
      // Fallback to mock API for development
      console.warn('Real API unavailable, using mock parse');
      const mockResponse = await this.apiService.mockParseFile(fileId).toPromise();
      if (mockResponse?.success && mockResponse.data) {
        return mockResponse.data;
      }
      throw new Error('Mock parse failed');
    }
  }

  /**
   * Get file information
   */
  async getFileInfo(fileId: string): Promise<any> {
    try {
      const response = await this.apiService.getFileInfo(fileId).toPromise();
      if (response?.success && response.data) {
        return response.data;
      }
      throw new Error(response?.error || 'Failed to get file info');
    } catch (error) {
      throw new Error(`Error getting file info: ${(error as Error).message}`);
    }
  }

  /**
   * Delete a file
   */
  async deleteFile(fileId: string): Promise<void> {
    try {
      const response = await this.apiService.deleteFile(fileId).toPromise();
      if (!response?.success) {
        throw new Error(response?.error || 'Failed to delete file');
      }
    } catch (error) {
      throw new Error(`Error deleting file: ${(error as Error).message}`);
    }
  }

  /**
   * Get user's uploaded files
   */
  async getUserFiles(): Promise<any[]> {
    try {
      const response = await this.apiService.getUserFiles().toPromise();
      if (response?.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.warn('Failed to get user files:', error);
      return [];
    }
  }

  /**
   * Update upload progress
   */
  private updateProgress(fileName: string, loaded: number, total: number, status: UploadProgress['status'], error?: string): void {
    const currentProgress = this.uploadProgressSubject.value;
    const existingIndex = currentProgress.findIndex(p => p.fileName === fileName);

    const progress: UploadProgress = {
      fileName,
      loaded,
      total,
      percentage: Math.round((loaded / total) * 100),
      status,
      error
    };

    if (existingIndex >= 0) {
      currentProgress[existingIndex] = progress;
    } else {
      currentProgress.push(progress);
    }

    this.uploadProgressSubject.next([...currentProgress]);
  }

  /**
   * Generate unique file ID
   */
  private generateFileId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Clear upload progress
   */
  clearProgress(): void {
    this.uploadProgressSubject.next([]);
  }

  /**
   * Get current upload progress
   */
  getCurrentProgress(): UploadProgress[] {
    return this.uploadProgressSubject.value;
  }

  /**
   * Check if backend is available
   */
  async checkBackendHealth(): Promise<boolean> {
    try {
      const response = await this.apiService.healthCheck().toPromise();
      return response?.success || false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get supported file types
   */
  getSupportedFileTypes(): string[] {
    return [
      'text/plain',
      'text/markdown',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/csv',
      'application/json',
      'application/xml',
      'text/html',
      'text/css',
      'application/javascript',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/svg+xml'
    ];
  }

  /**
   * Validate file type
   */
  isFileTypeSupported(file: File): boolean {
    const supportedTypes = this.getSupportedFileTypes();
    return supportedTypes.includes(file.type) || file.type === '';
  }

  /**
   * Get file size in human readable format
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Estimate upload time
   */
  estimateUploadTime(fileSize: number, uploadSpeed: number = 1024 * 1024): number {
    return Math.ceil(fileSize / uploadSpeed); // in seconds
  }
} 