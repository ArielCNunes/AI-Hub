import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  // Redirect to home page
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Login and Signup routes
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./components/signup/signup.component').then(m => m.SignupComponent) },

  // Home and chat routes (protected by AuthGuard)
  { path: 'home', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent), canActivate: [AuthGuard] },
  { path: 'chat', loadComponent: () => import('./components/chat/chat.component').then(m => m.ChatComponent), canActivate: [AuthGuard] },

  // Redirect to login
  { path: '**', redirectTo: 'login' }
];