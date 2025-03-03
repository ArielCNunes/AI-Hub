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
    // Get rid of leading/trailing whitespace
    this.email = this.email.trim();

    // Validate email so Firebase doesn't throw an error
    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailPattern.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    // Check password
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    } else if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    // Attempt to sign up
    try {
      const user = await this.authService.signUp(this.email, this.password);
      if (user) {
        this.router.navigate(['/login']); // Redirect to login page
      } else {
        this.errorMessage = 'Sign up failed. Please try again.';
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      this.errorMessage = 'An error occurred. Please try again later.';
    }
  }
}