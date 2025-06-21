import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  category: string;
  timeLimit?: number; // in minutes
}

@Component({
  selector: 'app-practice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="practice-container">
      <div class="header">
        <h1>🎯 Practice Questions</h1>
        <button class="btn-primary" (click)="showCreateQuiz = true">+ Create New Quiz</button>
      </div>

      <!-- Create Quiz Form -->
      <div class="form-overlay" *ngIf="showCreateQuiz" (click)="closeCreateForm()">
        <div class="form-container" (click)="$event.stopPropagation()">
          <h2>Create New Quiz</h2>
          <form (ngSubmit)="saveQuiz()" #quizForm="ngForm">
            <div class="form-group">
              <label for="title">Quiz Title</label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                [(ngModel)]="currentQuiz.title" 
                required
                placeholder="Enter quiz title..."
              >
            </div>
            
            <div class="form-group">
              <label for="description">Description</label>
              <textarea 
                id="description" 
                name="description" 
                [(ngModel)]="currentQuiz.description" 
                rows="3"
                placeholder="Enter quiz description..."
              ></textarea>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="category">Category</label>
                <input 
                  type="text" 
                  id="category" 
                  name="category" 
                  [(ngModel)]="currentQuiz.category" 
                  required
                  placeholder="e.g., Math, Science, History"
                >
              </div>
              
              <div class="form-group">
                <label for="timeLimit">Time Limit (minutes)</label>
                <input 
                  type="number" 
                  id="timeLimit" 
                  name="timeLimit" 
                  [(ngModel)]="currentQuiz.timeLimit" 
                  min="1"
                  placeholder="Optional"
                >
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="closeCreateForm()">Cancel</button>
              <button type="submit" class="btn-primary" [disabled]="!quizForm.form.valid">
                Create Quiz
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Quiz Selection -->
      <div class="quiz-selection" *ngIf="!activeQuiz && !showCreateQuiz">
        <div class="search-filters">
          <input 
            type="text" 
            placeholder="Search quizzes..." 
            [(ngModel)]="searchTerm"
            (input)="filterQuizzes()"
          >
          <select [(ngModel)]="selectedCategory" (change)="filterQuizzes()">
            <option value="">All Categories</option>
            <option *ngFor="let category of categories" [value]="category">{{ category }}</option>
          </select>
        </div>

        <div class="quizzes-grid" *ngIf="filteredQuizzes.length > 0">
          <div class="quiz-card" *ngFor="let quiz of filteredQuizzes">
            <div class="quiz-info">
              <h3>{{ quiz.title }}</h3>
              <p>{{ quiz.description }}</p>
              <div class="quiz-meta">
                <span class="category">{{ quiz.category }}</span>
                <span class="questions">{{ quiz.questions.length }} questions</span>
                <span class="time-limit" *ngIf="quiz.timeLimit">{{ quiz.timeLimit }} min</span>
              </div>
            </div>
            <div class="quiz-actions">
              <button class="btn-primary" (click)="startQuiz(quiz)">Start Quiz</button>
              <button class="btn-secondary" (click)="editQuiz(quiz)">Edit</button>
              <button class="btn-danger" (click)="deleteQuiz(quiz)">Delete</button>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="filteredQuizzes.length === 0">
          <div class="empty-icon">📝</div>
          <h3>No quizzes found</h3>
          <p>{{ searchTerm || selectedCategory ? 'Try adjusting your filters' : 'Create your first quiz to get started!' }}</p>
          <button class="btn-primary" (click)="showCreateQuiz = true" *ngIf="!searchTerm && !selectedCategory">
            Create First Quiz
          </button>
        </div>
      </div>

      <!-- Active Quiz -->
      <div class="quiz-container" *ngIf="activeQuiz && currentQuestion">
        <div class="quiz-header">
          <h2>{{ activeQuiz.title }}</h2>
          <div class="quiz-progress">
            <span>Question {{ currentQuestionIndex + 1 }} of {{ activeQuiz.questions.length }}</span>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="(currentQuestionIndex + 1) / activeQuiz.questions.length * 100"></div>
            </div>
          </div>
          <div class="timer" *ngIf="timeLimit">
            <span>⏱️ {{ formatTime(remainingTime) }}</span>
          </div>
        </div>

        <div class="question-container">
          <div class="question">
            <h3>{{ currentQuestion.question }}</h3>
          </div>
          
          <div class="options">
            <div 
              class="option" 
              *ngFor="let option of currentQuestion.options; let i = index"
              [class.selected]="selectedAnswer === i"
              [class.correct]="showResults && i === currentQuestion.correctAnswer"
              [class.incorrect]="showResults && selectedAnswer === i && i !== currentQuestion.correctAnswer"
              (click)="selectAnswer(i)"
            >
              <span class="option-letter">{{ String.fromCharCode(65 + i) }}</span>
              <span class="option-text">{{ option }}</span>
            </div>
          </div>

          <div class="explanation" *ngIf="showResults">
            <h4>Explanation:</h4>
            <p>{{ currentQuestion.explanation }}</p>
          </div>

          <div class="question-actions">
            <button 
              class="btn-primary" 
              (click)="nextQuestion()" 
              *ngIf="!showResults"
              [disabled]="selectedAnswer === null"
            >
              Submit Answer
            </button>
            <button 
              class="btn-primary" 
              (click)="nextQuestion()" 
              *ngIf="showResults && currentQuestionIndex < activeQuiz.questions.length - 1"
            >
              Next Question
            </button>
            <button 
              class="btn-primary" 
              (click)="finishQuiz()" 
              *ngIf="showResults && currentQuestionIndex === activeQuiz.questions.length - 1"
            >
              Finish Quiz
            </button>
          </div>
        </div>
      </div>

      <!-- Quiz Results -->
      <div class="results-container" *ngIf="showResults && quizCompleted && activeQuiz">
        <div class="results-card">
          <h2>Quiz Results</h2>
          <div class="score">
            <div class="score-circle">
              <span class="score-number">{{ correctAnswers }}</span>
              <span class="score-total">/ {{ activeQuiz.questions.length }}</span>
            </div>
            <div class="score-percentage">{{ (correctAnswers / activeQuiz.questions.length * 100).toFixed(1) }}%</div>
          </div>
          
          <div class="results-summary">
            <div class="summary-item">
              <span class="label">Correct Answers:</span>
              <span class="value correct">{{ correctAnswers }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Incorrect Answers:</span>
              <span class="value incorrect">{{ activeQuiz.questions.length - correctAnswers }}</span>
            </div>
            <div class="summary-item" *ngIf="timeLimit">
              <span class="label">Time Taken:</span>
              <span class="value">{{ formatTime(timeLimit * 60 - remainingTime) }}</span>
            </div>
          </div>

          <div class="results-actions">
            <button class="btn-primary" (click)="retakeQuiz()">Retake Quiz</button>
            <button class="btn-secondary" (click)="backToQuizzes()">Back to Quizzes</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .practice-container {
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

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .search-filters {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
    }

    .search-filters input,
    .search-filters select {
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
    }

    .search-filters input {
      flex: 1;
    }

    .quizzes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .quiz-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }

    .quiz-card:hover {
      transform: translateY(-5px);
    }

    .quiz-info h3 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .quiz-info p {
      color: #666;
      margin-bottom: 15px;
    }

    .quiz-meta {
      display: flex;
      gap: 10px;
      margin-bottom: 15px;
    }

    .quiz-meta span {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .category {
      background: #e3f2fd;
      color: #1976d2;
    }

    .questions {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .time-limit {
      background: #fff3e0;
      color: #f57c00;
    }

    .quiz-actions {
      display: flex;
      gap: 10px;
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

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .empty-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }

    .quiz-container {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .quiz-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 20px;
    }

    .quiz-progress {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .progress-bar {
      width: 200px;
      height: 8px;
      background: #f0f0f0;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      transition: width 0.3s ease;
    }

    .timer {
      font-size: 18px;
      font-weight: 500;
      color: #f57c00;
    }

    .question {
      margin-bottom: 30px;
    }

    .question h3 {
      color: #333;
      font-size: 1.3rem;
      line-height: 1.5;
    }

    .options {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 30px;
    }

    .option {
      display: flex;
      align-items: center;
      padding: 16px;
      border: 2px solid #eee;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .option:hover {
      border-color: #667eea;
      background-color: #f8f9ff;
    }

    .option.selected {
      border-color: #667eea;
      background-color: #e8f0ff;
    }

    .option.correct {
      border-color: #4caf50;
      background-color: #e8f5e8;
    }

    .option.incorrect {
      border-color: #f44336;
      background-color: #ffebee;
    }

    .option-letter {
      background: #667eea;
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      margin-right: 15px;
    }

    .option.correct .option-letter {
      background: #4caf50;
    }

    .option.incorrect .option-letter {
      background: #f44336;
    }

    .explanation {
      background: #f8f9ff;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .explanation h4 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .question-actions {
      text-align: center;
    }

    .results-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
    }

    .results-card {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      text-align: center;
      max-width: 500px;
      width: 100%;
    }

    .results-card h2 {
      color: #333;
      margin-bottom: 30px;
    }

    .score {
      margin-bottom: 30px;
    }

    .score-circle {
      font-size: 3rem;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 10px;
    }

    .score-percentage {
      font-size: 1.5rem;
      color: #666;
    }

    .results-summary {
      margin-bottom: 30px;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }

    .summary-item:last-child {
      border-bottom: none;
    }

    .label {
      color: #666;
    }

    .value {
      font-weight: 500;
    }

    .value.correct {
      color: #4caf50;
    }

    .value.incorrect {
      color: #f44336;
    }

    .results-actions {
      display: flex;
      gap: 15px;
      justify-content: center;
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
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
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
    .form-group textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 30px;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .search-filters {
        flex-direction: column;
      }
      
      .quiz-header {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class PracticeComponent {
  quizzes: Quiz[] = [];
  filteredQuizzes: Quiz[] = [];
  searchTerm = '';
  selectedCategory = '';
  categories: string[] = [];
  
  showCreateQuiz = false;
  currentQuiz: Quiz = this.createEmptyQuiz();
  
  activeQuiz: Quiz | null = null;
  currentQuestionIndex = 0;
  currentQuestion: Question | null = null;
  selectedAnswer: number | null = null;
  showResults = false;
  quizCompleted = false;
  correctAnswers = 0;
  
  timeLimit: number | null = null;
  remainingTime: number = 0;
  timerInterval: any;

  public String = String;

  constructor() {
    this.loadQuizzes();
    this.filterQuizzes();
  }

  createEmptyQuiz(): Quiz {
    return {
      id: '',
      title: '',
      description: '',
      questions: [],
      category: ''
    };
  }

  loadQuizzes(): void {
    const saved = localStorage.getItem('quizzes');
    if (saved) {
      this.quizzes = JSON.parse(saved);
      this.categories = [...new Set(this.quizzes.map(quiz => quiz.category))];
    }
  }

  saveQuizzes(): void {
    localStorage.setItem('quizzes', JSON.stringify(this.quizzes));
    this.categories = [...new Set(this.quizzes.map(quiz => quiz.category))];
  }

  filterQuizzes(): void {
    this.filteredQuizzes = this.quizzes.filter(quiz => {
      const matchesSearch = !this.searchTerm || 
        quiz.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        quiz.category.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || quiz.category === this.selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }

  saveQuiz(): void {
    this.currentQuiz.id = Date.now().toString();
    this.quizzes.push({ ...this.currentQuiz });
    this.saveQuizzes();
    this.filterQuizzes();
    this.closeCreateForm();
  }

  closeCreateForm(): void {
    this.showCreateQuiz = false;
    this.currentQuiz = this.createEmptyQuiz();
  }

  startQuiz(quiz: Quiz): void {
    this.activeQuiz = { ...quiz };
    this.currentQuestionIndex = 0;
    this.selectedAnswer = null;
    this.showResults = false;
    this.quizCompleted = false;
    this.correctAnswers = 0;
    this.currentQuestion = this.activeQuiz.questions[0];
    
    if (this.activeQuiz.timeLimit) {
      this.timeLimit = this.activeQuiz.timeLimit;
      this.remainingTime = this.timeLimit * 60;
      this.startTimer();
    }
  }

  selectAnswer(index: number): void {
    if (!this.showResults) {
      this.selectedAnswer = index;
    }
  }

  nextQuestion(): void {
    if (!this.showResults) {
      // Submit answer
      if (this.selectedAnswer === this.currentQuestion!.correctAnswer) {
        this.correctAnswers++;
      }
      this.showResults = true;
    } else {
      // Move to next question
      this.currentQuestionIndex++;
      if (this.currentQuestionIndex < this.activeQuiz!.questions.length) {
        this.currentQuestion = this.activeQuiz!.questions[this.currentQuestionIndex];
        this.selectedAnswer = null;
        this.showResults = false;
      } else {
        this.finishQuiz();
      }
    }
  }

  finishQuiz(): void {
    this.quizCompleted = true;
    this.stopTimer();
  }

  retakeQuiz(): void {
    this.startQuiz(this.activeQuiz!);
  }

  backToQuizzes(): void {
    this.activeQuiz = null;
    this.quizCompleted = false;
    this.stopTimer();
  }

  editQuiz(quiz: Quiz): void {
    // Implementation for editing quiz
    console.log('Edit quiz:', quiz);
  }

  deleteQuiz(quiz: Quiz): void {
    if (confirm('Are you sure you want to delete this quiz?')) {
      this.quizzes = this.quizzes.filter(q => q.id !== quiz.id);
      this.saveQuizzes();
      this.filterQuizzes();
    }
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        this.finishQuiz();
      }
    }, 1000);
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
