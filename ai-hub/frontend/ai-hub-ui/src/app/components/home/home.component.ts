import { Component, OnInit } from '@angular/core'; // Angular core and Ionic modules
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [IonicModule, RouterModule, CommonModule]
})
export class HomeComponent implements OnInit {
  user: any = null; // Stores current user info
  conversations: any[] = [];

  constructor(private authService: AuthService, public router: Router, private http: HttpClient) {
    addIcons({ add });
  }

  // On component initialisation, load user and fetch conversations
  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.http.get<any[]>(`http://localhost:5001/api/conversations?userId=${this.user.uid}`)
        .subscribe(convs => {
          this.conversations = convs;
        });
    }
  }

  // Creates a new conversation and navigates to chat page
  startNewChat() {
    if (this.user) {
      this.http.post<any>('http://localhost:5001/api/conversations', { userId: this.user.uid })
        .subscribe({
          next: (newConv) => {
            this.router.navigate(['/chat'], { queryParams: { conversationId: newConv._id } });
          },
          error: (err) => console.error('Failed to create conversation:', err)
        });
    }
  }
}