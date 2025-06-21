import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
  reviewCount: number;
}

@Component({
  selector: 'app-flashcards',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flashcards-container">
      <div class="header">
        <h1>🗂️ Flashcards</h1>
        <button class="btn-primary" (click)="showCreateForm = true">+ Create New Flashcard</button>
      </div>

      <!-- Create/Edit Form -->
      <div class="form-overlay" *ngIf="showCreateForm" (click)="closeForm()">
        <div class="form-container" (click)="$event.stopPropagation()">
          <h2>{{ editingCard ? 'Edit' : 'Create' }} Flashcard</h2>
          <form (ngSubmit)="saveCard()" #flashcardForm="ngForm">
            <div class="form-group">
              <label for="front">Front (Question)</label>
              <textarea 
                id="front" 
                name="front" 
                [(ngModel)]="currentCard.front" 
                required 
                rows="3"
                placeholder="Enter the question or prompt..."
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="back">Back (Answer)</label>
              <textarea 
                id="back" 
                name="back" 
                [(ngModel)]="currentCard.back" 
                required 
                rows="3"
                placeholder="Enter the answer..."
              ></textarea>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="category">Category</label>
                <input 
                  type="text" 
                  id="category" 
                  name="category" 
                  [(ngModel)]="currentCard.category" 
                  required
                  placeholder="e.g., Math, Science, History"
                >
              </div>
              
              <div class="form-group">
                <label for="difficulty">Difficulty</label>
                <select id="difficulty" name="difficulty" [(ngModel)]="currentCard.difficulty" required>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="closeForm()">Cancel</button>
              <button type="submit" class="btn-primary" [disabled]="!flashcardForm.form.valid">
                {{ editingCard ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="controls">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Search flashcards..." 
            [(ngModel)]="searchTerm"
            (input)="filterCards()"
          >
        </div>
        
        <div class="filters">
          <select [(ngModel)]="selectedCategory" (change)="filterCards()">
            <option value="">All Categories</option>
            <option *ngFor="let category of categories" [value]="category">{{ category }}</option>
          </select>
          
          <select [(ngModel)]="selectedDifficulty" (change)="filterCards()">
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <!-- Flashcards Grid -->
      <div class="flashcards-grid" *ngIf="filteredCards.length > 0">
        <div class="flashcard" *ngFor="let card of filteredCards" (click)="startStudy(card)">
          <div class="card-content">
            <div class="card-front">
              <h3>{{ card.front }}</h3>
            </div>
            <div class="card-info">
              <span class="category">{{ card.category }}</span>
              <span class="difficulty" [class]="card.difficulty">{{ card.difficulty }}</span>
            </div>
            <div class="card-actions">
              <button class="btn-icon" (click)="$event.stopPropagation(); editCard(card)">✏️</button>
              <button class="btn-icon" (click)="$event.stopPropagation(); deleteCard(card)">🗑️</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="filteredCards.length === 0">
        <div class="empty-icon">📝</div>
        <h3>No flashcards found</h3>
        <p>{{ searchTerm || selectedCategory || selectedDifficulty ? 'Try adjusting your filters' : 'Create your first flashcard to get started!' }}</p>
        <button class="btn-primary" (click)="showCreateForm = true" *ngIf="!searchTerm && !selectedCategory && !selectedDifficulty">
          Create First Flashcard
        </button>
      </div>

      <!-- Study Mode -->
      <div class="study-overlay" *ngIf="studyMode && currentStudyCard" (click)="closeStudy()">
        <div class="study-container" (click)="$event.stopPropagation()">
          <div class="study-card" [class.flipped]="isFlipped" (click)="flipCard()">
            <div class="card-side front">
              <h2>{{ currentStudyCard.front }}</h2>
              <p class="hint">Click to reveal answer</p>
            </div>
            <div class="card-side back">
              <h2>{{ currentStudyCard.back }}</h2>
              <div class="study-actions">
                <button class="btn-difficulty easy" (click)="rateDifficulty('easy')">Easy</button>
                <button class="btn-difficulty medium" (click)="rateDifficulty('medium')">Medium</button>
                <button class="btn-difficulty hard" (click)="rateDifficulty('hard')">Hard</button>
              </div>
            </div>
          </div>
          
          <div class="study-progress">
            <span>{{ studyIndex + 1 }} of {{ studyCards.length }}</span>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="(studyIndex + 1) / studyCards.length * 100"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .flashcards-container {
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

    .controls {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }

    .search-box {
      flex: 1;
      min-width: 300px;
    }

    .search-box input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
    }

    .filters {
      display: flex;
      gap: 12px;
    }

    .filters select {
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
      background: white;
    }

    .flashcards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .flashcard {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .flashcard:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.15);
    }

    .card-content {
      position: relative;
    }

    .card-front h3 {
      margin: 0 0 15px 0;
      color: #333;
      font-size: 1.2rem;
      line-height: 1.4;
    }

    .card-info {
      display: flex;
      gap: 8px;
      margin-bottom: 15px;
    }

    .category {
      background: #e3f2fd;
      color: #1976d2;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .difficulty {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .difficulty.easy {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .difficulty.medium {
      background: #fff3e0;
      color: #f57c00;
    }

    .difficulty.hard {
      background: #ffebee;
      color: #c62828;
    }

    .card-actions {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      background: none;
      border: none;
      font-size: 18px;
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
      padding: 60px 20px;
      color: #666;
    }

    .empty-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }

    .empty-state h3 {
      margin: 0 0 10px 0;
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
      max-width: 600px;
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
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
      font-family: inherit;
    }

    .form-group textarea {
      resize: vertical;
      min-height: 80px;
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

    .study-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .study-container {
      background: white;
      border-radius: 12px;
      padding: 40px;
      max-width: 600px;
      width: 90%;
      text-align: center;
    }

    .study-card {
      position: relative;
      height: 300px;
      perspective: 1000px;
      margin-bottom: 30px;
    }

    .card-side {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.6s;
    }

    .card-side.front {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .card-side.back {
      background: white;
      color: #333;
      transform: rotateY(180deg);
    }

    .study-card.flipped .card-side.front {
      transform: rotateY(180deg);
    }

    .study-card.flipped .card-side.back {
      transform: rotateY(0deg);
    }

    .card-side h2 {
      margin: 0 0 20px 0;
      font-size: 1.5rem;
      line-height: 1.4;
    }

    .hint {
      font-size: 14px;
      opacity: 0.8;
    }

    .study-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
    }

    .btn-difficulty {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .btn-difficulty.easy {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .btn-difficulty.medium {
      background: #fff3e0;
      color: #f57c00;
    }

    .btn-difficulty.hard {
      background: #ffebee;
      color: #c62828;
    }

    .btn-difficulty:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .study-progress {
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

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .controls {
        flex-direction: column;
      }
      
      .search-box {
        min-width: auto;
      }
    }
  `]
})
export class FlashcardsComponent {
  flashcards: Flashcard[] = [];
  filteredCards: Flashcard[] = [];
  searchTerm = '';
  selectedCategory = '';
  selectedDifficulty = '';
  categories: string[] = [];
  
  showCreateForm = false;
  editingCard: Flashcard | null = null;
  currentCard: Flashcard = this.createEmptyCard();
  
  studyMode = false;
  studyCards: Flashcard[] = [];
  studyIndex = 0;
  currentStudyCard: Flashcard | null = null;
  isFlipped = false;

  constructor() {
    this.loadFlashcards();
    this.filterCards();
  }

  createEmptyCard(): Flashcard {
    return {
      id: '',
      front: '',
      back: '',
      category: '',
      difficulty: 'medium',
      reviewCount: 0
    };
  }

  loadFlashcards(): void {
    const saved = localStorage.getItem('flashcards');
    if (saved) {
      this.flashcards = JSON.parse(saved);
      this.categories = [...new Set(this.flashcards.map(card => card.category))];
    }
  }

  saveFlashcards(): void {
    localStorage.setItem('flashcards', JSON.stringify(this.flashcards));
    this.categories = [...new Set(this.flashcards.map(card => card.category))];
  }

  filterCards(): void {
    this.filteredCards = this.flashcards.filter(card => {
      const matchesSearch = !this.searchTerm || 
        card.front.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        card.back.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        card.category.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || card.category === this.selectedCategory;
      const matchesDifficulty = !this.selectedDifficulty || card.difficulty === this.selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }

  saveCard(): void {
    if (this.editingCard) {
      const index = this.flashcards.findIndex(card => card.id === this.editingCard!.id);
      if (index !== -1) {
        this.flashcards[index] = { ...this.currentCard };
      }
    } else {
      this.currentCard.id = Date.now().toString();
      this.flashcards.push({ ...this.currentCard });
    }
    
    this.saveFlashcards();
    this.filterCards();
    this.closeForm();
  }

  editCard(card: Flashcard): void {
    this.editingCard = card;
    this.currentCard = { ...card };
    this.showCreateForm = true;
  }

  deleteCard(card: Flashcard): void {
    if (confirm('Are you sure you want to delete this flashcard?')) {
      this.flashcards = this.flashcards.filter(c => c.id !== card.id);
      this.saveFlashcards();
      this.filterCards();
    }
  }

  closeForm(): void {
    this.showCreateForm = false;
    this.editingCard = null;
    this.currentCard = this.createEmptyCard();
  }

  startStudy(card: Flashcard): void {
    this.studyCards = [card];
    this.studyIndex = 0;
    this.currentStudyCard = card;
    this.isFlipped = false;
    this.studyMode = true;
  }

  flipCard(): void {
    this.isFlipped = !this.isFlipped;
  }

  rateDifficulty(difficulty: 'easy' | 'medium' | 'hard'): void {
    if (this.currentStudyCard) {
      const card = this.flashcards.find(c => c.id === this.currentStudyCard!.id);
      if (card) {
        card.difficulty = difficulty;
        card.lastReviewed = new Date();
        card.reviewCount++;
        this.saveFlashcards();
      }
    }
    
    this.closeStudy();
  }

  closeStudy(): void {
    this.studyMode = false;
    this.isFlipped = false;
    this.currentStudyCard = null;
  }
}
