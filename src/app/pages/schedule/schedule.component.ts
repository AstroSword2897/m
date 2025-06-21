import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface StudyEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  category: string;
  type: 'study' | 'exam' | 'assignment' | 'review';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="schedule-container">
      <div class="header">
        <h1>📅 Study Schedule</h1>
        <button class="btn-primary" (click)="showAddEvent = true">+ Add Event</button>
      </div>

      <!-- Add Event Form -->
      <div class="form-overlay" *ngIf="showAddEvent" (click)="closeForm()">
        <div class="form-container" (click)="$event.stopPropagation()">
          <h2>{{ editingEvent ? 'Edit' : 'Add' }} Event</h2>
          <form (ngSubmit)="saveEvent()" #eventForm="ngForm">
            <div class="form-group">
              <label for="title">Event Title</label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                [(ngModel)]="currentEvent.title" 
                required
                placeholder="Enter event title..."
              >
            </div>
            
            <div class="form-group">
              <label for="description">Description</label>
              <textarea 
                id="description" 
                name="description" 
                [(ngModel)]="currentEvent.description" 
                rows="3"
                placeholder="Enter event description..."
              ></textarea>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="date">Date</label>
                <input 
                  type="date" 
                  id="date" 
                  name="date" 
                  [(ngModel)]="currentEvent.date" 
                  required
                >
              </div>
              
              <div class="form-group">
                <label for="type">Event Type</label>
                <select id="type" name="type" [(ngModel)]="currentEvent.type" required>
                  <option value="study">Study Session</option>
                  <option value="exam">Exam</option>
                  <option value="assignment">Assignment</option>
                  <option value="review">Review</option>
                </select>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="startTime">Start Time</label>
                <input 
                  type="time" 
                  id="startTime" 
                  name="startTime" 
                  [(ngModel)]="currentEvent.startTime" 
                  required
                >
              </div>
              
              <div class="form-group">
                <label for="endTime">End Time</label>
                <input 
                  type="time" 
                  id="endTime" 
                  name="endTime" 
                  [(ngModel)]="currentEvent.endTime" 
                  required
                >
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="category">Category</label>
                <input 
                  type="text" 
                  id="category" 
                  name="category" 
                  [(ngModel)]="currentEvent.category" 
                  required
                  placeholder="e.g., Math, Science, History"
                >
              </div>
              
              <div class="form-group">
                <label for="priority">Priority</label>
                <select id="priority" name="priority" [(ngModel)]="currentEvent.priority" required>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="closeForm()">Cancel</button>
              <button type="submit" class="btn-primary" [disabled]="!eventForm.form.valid">
                {{ editingEvent ? 'Update' : 'Add' }} Event
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Calendar Navigation -->
      <div class="calendar-nav">
        <button class="btn-nav" (click)="previousMonth()">‹</button>
        <h2>{{ currentMonthName }} {{ currentYear }}</h2>
        <button class="btn-nav" (click)="nextMonth()">›</button>
      </div>

      <!-- Calendar Grid -->
      <div class="calendar">
        <div class="calendar-header">
          <div class="day-header" *ngFor="let day of weekDays">{{ day }}</div>
        </div>
        
        <div class="calendar-body">
          <div 
            class="calendar-day" 
            *ngFor="let day of calendarDays"
            [class.other-month]="day.otherMonth"
            [class.today]="day.isToday"
            [class.has-events]="day.events.length > 0"
            (click)="selectDate(day.date)"
          >
            <span class="day-number">{{ day.dayNumber }}</span>
            <div class="day-events">
              <div 
                class="event-indicator" 
                *ngFor="let event of day.events.slice(0, 3)"
                [class]="event.priority"
                [title]="event.title"
              ></div>
              <span class="more-events" *ngIf="day.events.length > 3">+{{ day.events.length - 3 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Date Events -->
      <div class="selected-date-events" *ngIf="selectedDate">
        <h3>Events for {{ formatDate(selectedDate) }}</h3>
        <div class="events-list" *ngIf="selectedDateEvents.length > 0">
          <div 
            class="event-item" 
            *ngFor="let event of selectedDateEvents"
            [class.completed]="event.completed"
            [class]="event.priority"
          >
            <div class="event-time">
              <span class="start-time">{{ event.startTime }}</span>
              <span class="end-time">{{ event.endTime }}</span>
            </div>
            <div class="event-content">
              <div class="event-header">
                <h4>{{ event.title }}</h4>
                <div class="event-meta">
                  <span class="event-type">{{ event.type }}</span>
                  <span class="event-category">{{ event.category }}</span>
                  <span class="event-priority" [class]="event.priority">{{ event.priority }}</span>
                </div>
              </div>
              <p class="event-description" *ngIf="event.description">{{ event.description }}</p>
            </div>
            <div class="event-actions">
              <button 
                class="btn-icon" 
                (click)="toggleComplete(event)"
                [title]="event.completed ? 'Mark as incomplete' : 'Mark as complete'"
              >
                {{ event.completed ? '✅' : '⭕' }}
              </button>
              <button class="btn-icon" (click)="editEvent(event)" title="Edit event">✏️</button>
              <button class="btn-icon" (click)="deleteEvent(event)" title="Delete event">🗑️</button>
            </div>
          </div>
        </div>
        
        <div class="empty-events" *ngIf="selectedDateEvents.length === 0">
          <p>No events scheduled for this date.</p>
          <button class="btn-primary" (click)="addEventForDate()">Add Event</button>
        </div>
      </div>

      <!-- Upcoming Events -->
      <div class="upcoming-events">
        <h3>Upcoming Events</h3>
        <div class="upcoming-list" *ngIf="upcomingEvents.length > 0">
          <div 
            class="upcoming-item" 
            *ngFor="let event of upcomingEvents"
            [class]="event.priority"
          >
            <div class="upcoming-date">
              <span class="date">{{ formatShortDate(event.date) }}</span>
              <span class="time">{{ event.startTime }}</span>
            </div>
            <div class="upcoming-content">
              <h4>{{ event.title }}</h4>
              <span class="upcoming-category">{{ event.category }}</span>
            </div>
            <div class="upcoming-actions">
              <button class="btn-icon" (click)="editEvent(event)">✏️</button>
            </div>
          </div>
        </div>
        
        <div class="empty-upcoming" *ngIf="upcomingEvents.length === 0">
          <p>No upcoming events.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .schedule-container {
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

    .calendar-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .calendar-nav h2 {
      color: #333;
      margin: 0;
      font-size: 1.5rem;
    }

    .btn-nav {
      background: #f8f9fa;
      border: 1px solid #ddd;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 18px;
      transition: all 0.3s ease;
    }

    .btn-nav:hover {
      background: #e9ecef;
    }

    .calendar {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }

    .calendar-header {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      background: #f8f9fa;
      border-radius: 12px 12px 0 0;
    }

    .day-header {
      padding: 15px;
      text-align: center;
      font-weight: 500;
      color: #666;
      border-bottom: 1px solid #eee;
    }

    .calendar-body {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
    }

    .calendar-day {
      min-height: 100px;
      padding: 8px;
      border-right: 1px solid #eee;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      transition: background-color 0.3s ease;
      position: relative;
    }

    .calendar-day:hover {
      background-color: #f8f9ff;
    }

    .calendar-day.other-month {
      background-color: #f8f9fa;
      color: #999;
    }

    .calendar-day.today {
      background-color: #e8f0ff;
      border: 2px solid #667eea;
    }

    .calendar-day.has-events {
      background-color: #fff8e1;
    }

    .day-number {
      font-weight: 500;
      margin-bottom: 8px;
      display: block;
    }

    .day-events {
      display: flex;
      flex-wrap: wrap;
      gap: 2px;
    }

    .event-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #667eea;
    }

    .event-indicator.high {
      background: #f44336;
    }

    .event-indicator.medium {
      background: #ff9800;
    }

    .event-indicator.low {
      background: #4caf50;
    }

    .more-events {
      font-size: 10px;
      color: #666;
      margin-left: 4px;
    }

    .selected-date-events {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }

    .selected-date-events h3 {
      margin: 0 0 20px 0;
      color: #333;
    }

    .events-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .event-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 16px;
      border-radius: 8px;
      border-left: 4px solid #667eea;
      background: #f8f9ff;
      transition: all 0.3s ease;
    }

    .event-item.high {
      border-left-color: #f44336;
      background: #ffebee;
    }

    .event-item.medium {
      border-left-color: #ff9800;
      background: #fff3e0;
    }

    .event-item.low {
      border-left-color: #4caf50;
      background: #e8f5e8;
    }

    .event-item.completed {
      opacity: 0.6;
      background: #f5f5f5;
    }

    .event-time {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 80px;
    }

    .start-time {
      font-weight: 500;
      color: #333;
    }

    .end-time {
      font-size: 0.9rem;
      color: #666;
    }

    .event-content {
      flex: 1;
    }

    .event-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }

    .event-header h4 {
      margin: 0;
      color: #333;
      font-size: 1.1rem;
    }

    .event-meta {
      display: flex;
      gap: 8px;
    }

    .event-meta span {
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .event-type {
      background: #e3f2fd;
      color: #1976d2;
    }

    .event-category {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .event-priority {
      background: #fff3e0;
      color: #f57c00;
    }

    .event-priority.high {
      background: #ffebee;
      color: #c62828;
    }

    .event-priority.medium {
      background: #fff3e0;
      color: #f57c00;
    }

    .event-priority.low {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .event-description {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .event-actions {
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
      background-color: rgba(0,0,0,0.1);
    }

    .empty-events {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }

    .upcoming-events {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .upcoming-events h3 {
      margin: 0 0 20px 0;
      color: #333;
    }

    .upcoming-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .upcoming-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px;
      border-radius: 8px;
      background: #f8f9ff;
      border-left: 4px solid #667eea;
    }

    .upcoming-item.high {
      border-left-color: #f44336;
      background: #ffebee;
    }

    .upcoming-item.medium {
      border-left-color: #ff9800;
      background: #fff3e0;
    }

    .upcoming-item.low {
      border-left-color: #4caf50;
      background: #e8f5e8;
    }

    .upcoming-date {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 80px;
    }

    .upcoming-date .date {
      font-weight: 500;
      color: #333;
    }

    .upcoming-date .time {
      font-size: 0.9rem;
      color: #666;
    }

    .upcoming-content {
      flex: 1;
    }

    .upcoming-content h4 {
      margin: 0 0 4px 0;
      color: #333;
    }

    .upcoming-category {
      font-size: 0.9rem;
      color: #666;
    }

    .upcoming-actions {
      display: flex;
      gap: 8px;
    }

    .empty-upcoming {
      text-align: center;
      padding: 40px 20px;
      color: #666;
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
    .form-group select,
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
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .calendar-day {
        min-height: 80px;
        padding: 4px;
      }
      
      .event-item {
        flex-direction: column;
        gap: 12px;
      }
      
      .event-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }
  `]
})
export class ScheduleComponent implements OnInit {
  events: StudyEvent[] = [];
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  currentMonth = this.currentDate.getMonth();
  selectedDate: Date | null = null;
  selectedDateEvents: StudyEvent[] = [];
  upcomingEvents: StudyEvent[] = [];
  
  showAddEvent = false;
  editingEvent: StudyEvent | null = null;
  currentEvent: StudyEvent = this.createEmptyEvent();

  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: Array<{
    date: Date;
    dayNumber: number;
    otherMonth: boolean;
    isToday: boolean;
    events: StudyEvent[];
  }> = [];

  ngOnInit(): void {
    this.loadEvents();
    this.generateCalendar();
    this.updateUpcomingEvents();
  }

  createEmptyEvent(): StudyEvent {
    return {
      id: '',
      title: '',
      description: '',
      date: new Date(),
      startTime: '09:00',
      endTime: '10:00',
      category: '',
      type: 'study',
      priority: 'medium',
      completed: false
    };
  }

  loadEvents(): void {
    const saved = localStorage.getItem('studyEvents');
    if (saved) {
      this.events = JSON.parse(saved).map((event: any) => ({
        ...event,
        date: new Date(event.date)
      }));
    }
  }

  saveEvents(): void {
    localStorage.setItem('studyEvents', JSON.stringify(this.events));
    this.updateUpcomingEvents();
  }

  generateCalendar(): void {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    this.calendarDays = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dayEvents = this.events.filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() === date.getTime();
      });
      
      this.calendarDays.push({
        date: new Date(date),
        dayNumber: date.getDate(),
        otherMonth: date.getMonth() !== this.currentMonth,
        isToday: date.getTime() === today.getTime(),
        events: dayEvents
      });
    }
  }

  previousMonth(): void {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar();
  }

  selectDate(date: Date): void {
    this.selectedDate = date;
    this.selectedDateEvents = this.events.filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === selectedDate.getTime();
    });
  }

  addEvent(): void {
    this.editingEvent = null;
    this.currentEvent = this.createEmptyEvent();
    this.showAddEvent = true;
  }

  addEventForDate(): void {
    this.editingEvent = null;
    this.currentEvent = this.createEmptyEvent();
    if (this.selectedDate) {
      this.currentEvent.date = new Date(this.selectedDate);
    }
    this.showAddEvent = true;
  }

  saveEvent(): void {
    if (this.editingEvent) {
      const index = this.events.findIndex(e => e.id === this.editingEvent!.id);
      if (index !== -1) {
        this.events[index] = { ...this.currentEvent };
      }
    } else {
      this.currentEvent.id = Date.now().toString();
      this.events.push({ ...this.currentEvent });
    }
    
    this.saveEvents();
    this.generateCalendar();
    if (this.selectedDate) {
      this.selectDate(this.selectedDate);
    }
    this.closeForm();
  }

  editEvent(event: StudyEvent): void {
    this.editingEvent = event;
    this.currentEvent = { ...event };
    this.showAddEvent = true;
  }

  deleteEvent(event: StudyEvent): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.events = this.events.filter(e => e.id !== event.id);
      this.saveEvents();
      this.generateCalendar();
      if (this.selectedDate) {
        this.selectDate(this.selectedDate);
      }
    }
  }

  toggleComplete(event: StudyEvent): void {
    event.completed = !event.completed;
    this.saveEvents();
  }

  closeForm(): void {
    this.showAddEvent = false;
    this.editingEvent = null;
    this.currentEvent = this.createEmptyEvent();
  }

  updateUpcomingEvents(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    this.upcomingEvents = this.events
      .filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() >= today.getTime() && !event.completed;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  }

  get currentMonthName(): string {
    return new Date(this.currentYear, this.currentMonth).toLocaleDateString('en-US', { month: 'long' });
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatShortDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
}
