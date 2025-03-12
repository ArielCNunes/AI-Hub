import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [FormsModule, IonicModule, CommonModule, RouterLink]
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  async onSubmit() {
    this.email = this.email.trim();

    // Check if email exists
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

    // Check if password exists
    if (!this.password || !this.confirmPassword) {
      this.errorMessage = 'Please enter and confirm your password.';
      return;
    }

    // Check if password is at least 6 characters long
    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    // Check if passwords match
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    // Check if email does not already exist before signing up
    if (await this.authService.isEmailTaken(this.email)) {
      this.errorMessage = 'This email is already registered. Try logging in instead.';
      return;
    }

    // Sign up user
    const result = await this.authService.signUp(this.email, this.password);
    if (result.user) {
      this.router.navigate(['/login']);
    } else {
      this.errorMessage = result.error || 'Sign up failed. Please try again.';
    }
  }
}