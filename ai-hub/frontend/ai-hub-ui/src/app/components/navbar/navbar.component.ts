import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, IonicModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  // Injects AuthService for authentication control and Router for navigation
  constructor(private authService: AuthService, private router: Router) { }

  // Logs the user out and redirects to the login page
  logout(): void {
    this.authService.signOut().then(() => {
      this.router.navigate(['/login']);  // Redirect to login page after logout
    }).catch((error) => {
      console.error('Error logging out:', error);
    });
  }

  // Returns true if a user is currently logged in
  get isLoggedIn(): boolean {
    return this.authService.getCurrentUser() !== null;
  }
}
