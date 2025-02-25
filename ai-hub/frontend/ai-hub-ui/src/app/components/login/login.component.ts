import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    const user = await this.authService.signIn(this.email, this.password);
    if (user) {
      this.router.navigate(['/chat']);
    } else {
      this.errorMessage = 'Failed to login. Please check your credentials.';
    }
  }
}