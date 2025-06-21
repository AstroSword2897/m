import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'flashcards',
    loadComponent: () => import('./pages/flashcards/flashcards.component').then(m => m.FlashcardsComponent)
  },
  {
    path: 'practice',
    loadComponent: () => import('./pages/practice/practice.component').then(m => m.PracticeComponent)
  },
  {
    path: 'progress',
    loadComponent: () => import('./pages/progress/progress.component').then(m => m.ProgressComponent)
  },
  {
    path: 'schedule',
    loadComponent: () => import('./pages/schedule/schedule.component').then(m => m.ScheduleComponent)
  },
  {
    path: 'collaborate',
    loadComponent: () => import('./pages/collaborate/collaborate.component').then(m => m.CollaborateComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
  }
]; 