import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IonicModule],
  styleUrls: ['./login.component.css'],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  async login() {
    this.email = this.email.trim();

    // Check if email input is empty
    if (!this.email) {
      this.errorMessage = 'Email cannot be empty.';
      return;
    }

    // Check if email is valid
    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailPattern.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    // Check if password input is empty
    if (!this.password) {
      this.errorMessage = 'Password cannot be empty.';
      return;
    }

    // Check if password is at least 6 characters
    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    // Log in user
    const result = await this.authService.signIn(this.email, this.password); // Call signIn method from AuthService
    if (result.user) { // Check if user has been logged in
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = result.error || 'Sign in failed. Please try again.';
    }
  }
}