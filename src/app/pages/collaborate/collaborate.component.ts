import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  members: GroupMember[];
  maxMembers: number;
  isPublic: boolean;
  createdAt: Date;
  lastActivity: Date;
}

interface GroupMember {
  id: string;
  name: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: Date;
  avatar: string;
}

interface StudySession {
  id: string;
  groupId: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'virtual' | 'in-person' | 'hybrid';
  location?: string;
  meetingLink?: string;
  participants: string[];
  maxParticipants: number;
}

interface Message {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'link';
  attachment?: string;
}

@Component({
  selector: 'app-collaborate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="collaborate-container">
      <div class="header">
        <h1>👥 Collaborate</h1>
        <div class="header-actions">
          <button class="btn-primary" (click)="showCreateGroup = true">+ Create Group</button>
          <button class="btn-secondary" (click)="showJoinGroup = true">Join Group</button>
        </div>
      </div>

      <!-- Create Group Form -->
      <div class="form-overlay" *ngIf="showCreateGroup" (click)="closeCreateForm()">
        <div class="form-container" (click)="$event.stopPropagation()">
          <h2>Create Study Group</h2>
          <form (ngSubmit)="saveGroup()" #groupForm="ngForm">
            <div class="form-group">
              <label for="name">Group Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                [(ngModel)]="currentGroup.name" 
                required
                placeholder="Enter group name..."
              >
            </div>
            
            <div class="form-group">
              <label for="description">Description</label>
              <textarea 
                id="description" 
                name="description" 
                [(ngModel)]="currentGroup.description" 
                rows="3"
                placeholder="Describe your study group..."
              ></textarea>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="category">Subject/Category</label>
                <input 
                  type="text" 
                  id="category" 
                  name="category" 
                  [(ngModel)]="currentGroup.category" 
                  required
                  placeholder="e.g., Math, Science, History"
                >
              </div>
              
              <div class="form-group">
                <label for="maxMembers">Max Members</label>
                <input 
                  type="number" 
                  id="maxMembers" 
                  name="maxMembers" 
                  [(ngModel)]="currentGroup.maxMembers" 
                  required
                  min="2"
                  max="50"
                >
              </div>
            </div>
            
            <div class="form-group">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="currentGroup.isPublic" 
                  name="isPublic"
                >
                Make group public (visible to all users)
              </label>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="closeCreateForm()">Cancel</button>
              <button type="submit" class="btn-primary" [disabled]="!groupForm.form.valid">
                Create Group
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Join Group Form -->
      <div class="form-overlay" *ngIf="showJoinGroup" (click)="closeJoinForm()">
        <div class="form-container" (click)="$event.stopPropagation()">
          <h2>Join Study Group</h2>
          <div class="search-groups">
            <input 
              type="text" 
              placeholder="Search groups..." 
              [(ngModel)]="groupSearchTerm"
              (input)="filterGroups()"
            >
          </div>
          
          <div class="available-groups" *ngIf="filteredGroups.length > 0">
            <div 
              class="group-item" 
              *ngFor="let group of filteredGroups"
              (click)="joinGroup(group)"
            >
              <div class="group-info">
                <h4>{{ group.name }}</h4>
                <p>{{ group.description }}</p>
                <div class="group-meta">
                  <span class="category">{{ group.category }}</span>
                  <span class="members">{{ group.members.length }}/{{ group.maxMembers }} members</span>
                  <span class="public" *ngIf="group.isPublic">Public</span>
                </div>
              </div>
              <button class="btn-join">Join</button>
            </div>
          </div>
          
          <div class="no-groups" *ngIf="filteredGroups.length === 0">
            <p>No groups found matching your search.</p>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="closeJoinForm()">Close</button>
          </div>
        </div>
      </div>

      <!-- My Groups -->
      <div class="my-groups">
        <h2>My Study Groups</h2>
        <div class="groups-grid" *ngIf="myGroups.length > 0">
          <div class="group-card" *ngFor="let group of myGroups" (click)="openGroup(group)">
            <div class="group-header">
              <h3>{{ group.name }}</h3>
              <div class="group-status" [class]="getGroupStatus(group)">
                {{ getGroupStatus(group) }}
              </div>
            </div>
            
            <p class="group-description">{{ group.description }}</p>
            
            <div class="group-stats">
              <div class="stat">
                <span class="stat-label">Members</span>
                <span class="stat-value">{{ group.members.length }}/{{ group.maxMembers }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Category</span>
                <span class="stat-value">{{ group.category }}</span>
              </div>
            </div>
            
            <div class="group-actions">
              <button class="btn-secondary" (click)="$event.stopPropagation(); scheduleSession(group)">
                Schedule Session
              </button>
              <button class="btn-icon" (click)="$event.stopPropagation(); editGroup(group)">
                ✏️
              </button>
              <button class="btn-icon" (click)="$event.stopPropagation(); leaveGroup(group)">
                🚪
              </button>
            </div>
          </div>
        </div>
        
        <div class="empty-groups" *ngIf="myGroups.length === 0">
          <div class="empty-icon">👥</div>
          <h3>No study groups yet</h3>
          <p>Create or join a study group to start collaborating!</p>
          <div class="empty-actions">
            <button class="btn-primary" (click)="showCreateGroup = true">Create Group</button>
            <button class="btn-secondary" (click)="showJoinGroup = true">Join Group</button>
          </div>
        </div>
      </div>

      <!-- Group Chat/Details -->
      <div class="group-details" *ngIf="activeGroup">
        <div class="group-header">
          <button class="btn-back" (click)="closeGroup()">‹ Back</button>
          <h2>{{ activeGroup.name }}</h2>
          <div class="group-info">
            <span class="category">{{ activeGroup.category }}</span>
            <span class="members">{{ activeGroup.members.length }} members</span>
          </div>
        </div>
        
        <div class="group-content">
          <div class="chat-section">
            <div class="chat-messages" #chatContainer>
              <div 
                class="message" 
                *ngFor="let message of groupMessages"
                [class.own-message]="message.senderId === currentUserId"
              >
                <div class="message-header">
                  <span class="sender">{{ message.senderName }}</span>
                  <span class="timestamp">{{ formatTime(message.timestamp) }}</span>
                </div>
                <div class="message-content">
                  <span *ngIf="message.type === 'text'">{{ message.content }}</span>
                  <a *ngIf="message.type === 'link'" [href]="message.content" target="_blank">
                    {{ message.content }}
                  </a>
                  <div *ngIf="message.type === 'file'" class="file-attachment">
                    📎 {{ message.attachment }}
                  </div>
                </div>
              </div>
            </div>
            
            <div class="chat-input">
              <input 
                type="text" 
                placeholder="Type a message..." 
                [(ngModel)]="newMessage"
                (keyup.enter)="sendMessage()"
              >
              <button class="btn-send" (click)="sendMessage()" [disabled]="!newMessage.trim()">
                Send
              </button>
            </div>
          </div>
          
          <div class="group-sidebar">
            <div class="members-list">
              <h3>Members</h3>
              <div class="member-item" *ngFor="let member of activeGroup.members">
                <div class="member-avatar">{{ member.avatar }}</div>
                <div class="member-info">
                  <span class="member-name">{{ member.name }}</span>
                  <span class="member-role">{{ member.role }}</span>
                </div>
              </div>
            </div>
            
            <div class="upcoming-sessions">
              <h3>Upcoming Sessions</h3>
              <div class="session-item" *ngFor="let session of groupSessions">
                <div class="session-info">
                  <h4>{{ session.title }}</h4>
                  <p>{{ formatDate(session.date) }} at {{ session.startTime }}</p>
                  <span class="session-type">{{ session.type }}</span>
                </div>
                <button class="btn-join-session" (click)="joinSession(session)">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .collaborate-container {
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

    .header-actions {
      display: flex;
      gap: 12px;
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

    .my-groups {
      margin-bottom: 40px;
    }

    .my-groups h2 {
      color: #333;
      margin-bottom: 20px;
    }

    .groups-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .group-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .group-card:hover {
      transform: translateY(-5px);
    }

    .group-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .group-header h3 {
      margin: 0;
      color: #333;
      font-size: 1.2rem;
    }

    .group-status {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .group-status.active {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .group-status.inactive {
      background: #ffebee;
      color: #c62828;
    }

    .group-description {
      color: #666;
      margin-bottom: 16px;
      line-height: 1.4;
    }

    .group-stats {
      display: flex;
      gap: 20px;
      margin-bottom: 16px;
    }

    .stat {
      display: flex;
      flex-direction: column;
    }

    .stat-label {
      font-size: 0.8rem;
      color: #666;
    }

    .stat-value {
      font-weight: 500;
      color: #333;
    }

    .group-actions {
      display: flex;
      gap: 8px;
      align-items: center;
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

    .empty-groups {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .empty-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }

    .empty-groups h3 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .empty-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-top: 20px;
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

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .checkbox-label input[type="checkbox"] {
      width: auto;
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

    .search-groups {
      margin-bottom: 20px;
    }

    .search-groups input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
    }

    .available-groups {
      max-height: 400px;
      overflow-y: auto;
    }

    .group-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border: 1px solid #eee;
      border-radius: 8px;
      margin-bottom: 12px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .group-item:hover {
      background-color: #f8f9ff;
    }

    .group-info h4 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .group-info p {
      margin: 0 0 8px 0;
      color: #666;
      font-size: 0.9rem;
    }

    .group-meta {
      display: flex;
      gap: 8px;
    }

    .group-meta span {
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.8rem;
      background: #f0f0f0;
      color: #666;
    }

    .btn-join {
      background: #4caf50;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    }

    .group-details {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .group-header {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 20px;
      border-bottom: 1px solid #eee;
    }

    .btn-back {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
    }

    .group-header h2 {
      margin: 0;
      color: #333;
    }

    .group-info {
      display: flex;
      gap: 12px;
    }

    .group-info span {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.9rem;
      background: #f0f0f0;
      color: #666;
    }

    .group-content {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 0;
    }

    .chat-section {
      border-right: 1px solid #eee;
    }

    .chat-messages {
      height: 400px;
      overflow-y: auto;
      padding: 20px;
    }

    .message {
      margin-bottom: 16px;
    }

    .message.own-message {
      text-align: right;
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
      font-size: 0.8rem;
      color: #666;
    }

    .message-content {
      background: #f8f9fa;
      padding: 12px;
      border-radius: 8px;
      display: inline-block;
      max-width: 70%;
    }

    .own-message .message-content {
      background: #667eea;
      color: white;
    }

    .chat-input {
      display: flex;
      gap: 12px;
      padding: 20px;
      border-top: 1px solid #eee;
    }

    .chat-input input {
      flex: 1;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
    }

    .btn-send {
      background: #667eea;
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      cursor: pointer;
    }

    .btn-send:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .group-sidebar {
      padding: 20px;
    }

    .members-list,
    .upcoming-sessions {
      margin-bottom: 30px;
    }

    .members-list h3,
    .upcoming-sessions h3 {
      margin: 0 0 16px 0;
      color: #333;
    }

    .member-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
    }

    .member-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #667eea;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
    }

    .member-name {
      font-weight: 500;
      color: #333;
    }

    .member-role {
      font-size: 0.8rem;
      color: #666;
    }

    .session-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      border: 1px solid #eee;
      border-radius: 8px;
      margin-bottom: 8px;
    }

    .session-info h4 {
      margin: 0 0 4px 0;
      color: #333;
      font-size: 0.9rem;
    }

    .session-info p {
      margin: 0 0 4px 0;
      color: #666;
      font-size: 0.8rem;
    }

    .session-type {
      font-size: 0.8rem;
      color: #667eea;
    }

    .btn-join-session {
      background: #4caf50;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .group-content {
        grid-template-columns: 1fr;
      }
      
      .chat-section {
        border-right: none;
        border-bottom: 1px solid #eee;
      }
    }
  `]
})
export class CollaborateComponent {
  groups: StudyGroup[] = [];
  myGroups: StudyGroup[] = [];
  filteredGroups: StudyGroup[] = [];
  activeGroup: StudyGroup | null = null;
  groupMessages: Message[] = [];
  groupSessions: StudySession[] = [];
  
  showCreateGroup = false;
  showJoinGroup = false;
  groupSearchTerm = '';
  
  currentGroup: StudyGroup = this.createEmptyGroup();
  newMessage = '';
  currentUserId = 'user1'; // In a real app, this would come from auth service

  constructor() {
    this.loadGroups();
    this.updateMyGroups();
  }

  createEmptyGroup(): StudyGroup {
    return {
      id: '',
      name: '',
      description: '',
      category: '',
      members: [],
      maxMembers: 10,
      isPublic: true,
      createdAt: new Date(),
      lastActivity: new Date()
    };
  }

  loadGroups(): void {
    const saved = localStorage.getItem('studyGroups');
    if (saved) {
      this.groups = JSON.parse(saved).map((group: any) => ({
        ...group,
        createdAt: new Date(group.createdAt),
        lastActivity: new Date(group.lastActivity),
        members: group.members.map((member: any) => ({
          ...member,
          joinedAt: new Date(member.joinedAt)
        }))
      }));
    }
  }

  saveGroups(): void {
    localStorage.setItem('studyGroups', JSON.stringify(this.groups));
  }

  updateMyGroups(): void {
    this.myGroups = this.groups.filter(group => 
      group.members.some(member => member.id === this.currentUserId)
    );
  }

  filterGroups(): void {
    this.filteredGroups = this.groups.filter(group => {
      const matchesSearch = !this.groupSearchTerm || 
        group.name.toLowerCase().includes(this.groupSearchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(this.groupSearchTerm.toLowerCase()) ||
        group.category.toLowerCase().includes(this.groupSearchTerm.toLowerCase());
      
      const isNotMember = !group.members.some(member => member.id === this.currentUserId);
      
      return matchesSearch && isNotMember && group.isPublic;
    });
  }

  saveGroup(): void {
    this.currentGroup.id = Date.now().toString();
    this.currentGroup.members = [{
      id: this.currentUserId,
      name: 'You',
      role: 'admin',
      joinedAt: new Date(),
      avatar: '👤'
    }];
    this.groups.push({ ...this.currentGroup });
    this.saveGroups();
    this.updateMyGroups();
    this.closeCreateForm();
  }

  joinGroup(group: StudyGroup): void {
    const member: GroupMember = {
      id: this.currentUserId,
      name: 'You',
      role: 'member',
      joinedAt: new Date(),
      avatar: '👤'
    };
    
    group.members.push(member);
    this.saveGroups();
    this.updateMyGroups();
    this.closeJoinForm();
  }

  leaveGroup(group: StudyGroup): void {
    if (confirm('Are you sure you want to leave this group?')) {
      group.members = group.members.filter(member => member.id !== this.currentUserId);
      if (group.members.length === 0) {
        this.groups = this.groups.filter(g => g.id !== group.id);
      }
      this.saveGroups();
      this.updateMyGroups();
    }
  }

  openGroup(group: StudyGroup): void {
    this.activeGroup = group;
    this.loadGroupMessages(group.id);
    this.loadGroupSessions(group.id);
  }

  closeGroup(): void {
    this.activeGroup = null;
    this.groupMessages = [];
    this.groupSessions = [];
  }

  loadGroupMessages(groupId: string): void {
    const saved = localStorage.getItem(`messages_${groupId}`);
    if (saved) {
      this.groupMessages = JSON.parse(saved).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    }
  }

  loadGroupSessions(groupId: string): void {
    const saved = localStorage.getItem(`sessions_${groupId}`);
    if (saved) {
      this.groupSessions = JSON.parse(saved).map((session: any) => ({
        ...session,
        date: new Date(session.date)
      }));
    }
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.activeGroup) return;
    
    const message: Message = {
      id: Date.now().toString(),
      groupId: this.activeGroup.id,
      senderId: this.currentUserId,
      senderName: 'You',
      content: this.newMessage,
      timestamp: new Date(),
      type: 'text'
    };
    
    this.groupMessages.push(message);
    this.saveGroupMessages();
    this.newMessage = '';
  }

  saveGroupMessages(): void {
    if (this.activeGroup) {
      localStorage.setItem(`messages_${this.activeGroup.id}`, JSON.stringify(this.groupMessages));
    }
  }

  scheduleSession(group: StudyGroup): void {
    // Implementation for scheduling sessions
    console.log('Schedule session for group:', group.name);
  }

  editGroup(group: StudyGroup): void {
    // Implementation for editing group
    console.log('Edit group:', group.name);
  }

  joinSession(session: StudySession): void {
    // Implementation for joining sessions
    console.log('Join session:', session.title);
  }

  closeCreateForm(): void {
    this.showCreateGroup = false;
    this.currentGroup = this.createEmptyGroup();
  }

  closeJoinForm(): void {
    this.showJoinGroup = false;
    this.groupSearchTerm = '';
    this.filteredGroups = [];
  }

  getGroupStatus(group: StudyGroup): string {
    const now = new Date();
    const lastActivity = new Date(group.lastActivity);
    const daysSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24);
    
    return daysSinceActivity < 7 ? 'active' : 'inactive';
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
