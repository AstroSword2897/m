import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface UploadResponse {
  fileId: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
}

export interface ParseResponse {
  fileId: string;
  content: any;
  metadata: {
    fileType: string;
    wordCount?: number;
    pageCount?: number;
    extractedText?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api'; // Backend API URL

  constructor(private http: HttpClient) {}

  /**
   * Upload a file chunk
   */
  uploadChunk(chunkData: FormData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/upload/chunk`, chunkData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Parse uploaded file
   */
  parseFile(fileId: string): Observable<ApiResponse<ParseResponse>> {
    return this.http.post<ApiResponse<ParseResponse>>(`${this.baseUrl}/parse/${fileId}`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get file information
   */
  getFileInfo(fileId: string): Observable<ApiResponse<UploadResponse>> {
    return this.http.get<ApiResponse<UploadResponse>>(`${this.baseUrl}/files/${fileId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Delete a file
   */
  deleteFile(fileId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/files/${fileId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get user's uploaded files
   */
  getUserFiles(): Observable<ApiResponse<UploadResponse[]>> {
    return this.http.get<ApiResponse<UploadResponse[]>>(`${this.baseUrl}/files`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Create a study group
   */
  createStudyGroup(groupData: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/groups`, groupData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get study groups
   */
  getStudyGroups(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/groups`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Join a study group
   */
  joinStudyGroup(groupId: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/groups/${groupId}/join`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Send a message to a group
   */
  sendGroupMessage(groupId: string, message: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/groups/${groupId}/messages`, {
      content: message
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get group messages
   */
  getGroupMessages(groupId: string): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/groups/${groupId}/messages`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Create a study session
   */
  createStudySession(sessionData: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/sessions`, sessionData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get study sessions
   */
  getStudySessions(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/sessions`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Update user settings
   */
  updateUserSettings(settings: any): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.baseUrl}/user/settings`, settings)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get user profile
   */
  getUserProfile(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/user/profile`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Update user profile
   */
  updateUserProfile(profileData: any): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.baseUrl}/user/profile`, profileData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Export user data
   */
  exportUserData(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/user/export`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Import user data
   */
  importUserData(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/user/import`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Health check
   */
  healthCheck(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/health`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.status ? 
        `Error ${error.status}: ${error.message}` : 
        'Server error';
    }
    
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Create headers with authentication
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  /**
   * Mock API response for development
   */
  private mockApiResponse<T>(data: T, delay: number = 500): Observable<ApiResponse<T>> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          success: true,
          data: data
        });
        observer.complete();
      }, delay);
    });
  }

  /**
   * Mock file upload for development (when backend is not available)
   */
  mockUploadChunk(chunkData: FormData): Observable<ApiResponse> {
    return this.mockApiResponse({
      fileId: Date.now().toString(),
      message: 'Chunk uploaded successfully'
    }, 1000);
  }

  /**
   * Mock file parsing for development
   */
  mockParseFile(fileId: string): Observable<ApiResponse<ParseResponse>> {
    return this.mockApiResponse<ParseResponse>({
      fileId: fileId,
      content: {
        text: 'This is a mock parsed content from the uploaded file.',
        keywords: ['study', 'learning', 'education'],
        summary: 'A sample document for testing purposes.'
      },
      metadata: {
        fileType: 'text/plain',
        wordCount: 15,
        pageCount: 1,
        extractedText: 'This is a mock parsed content from the uploaded file.'
      }
    }, 2000);
  }
} 