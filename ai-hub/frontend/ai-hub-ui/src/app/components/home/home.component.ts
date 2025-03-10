import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [IonicModule, RouterModule]
})
export class HomeComponent implements OnInit {
  user: any = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
  }

  startNewChat(model: 'openai' | 'claude') {
    this.router.navigate(['/chat'], { queryParams: { model } });
  }
}