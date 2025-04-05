import { Component, OnInit } from '@angular/core'; // Angular core and Ionic modules
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, trashOutline, flameOutline } from 'ionicons/icons';

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

  constructor(private authService: AuthService, public router: Router, private http: HttpClient, private alertController: AlertController) {
    addIcons({ add, trashOutline, flameOutline });
  }

  // On component initialisation, load user and fetch conversations
  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.http.get<any[]>(`https://ai-hub-doml.onrender.com/api/conversations?userId=${this.user.uid}`)
        .subscribe(convs => {
          this.conversations = convs;
        });
    }
  }

  // Creates a new conversation and navigates to chat page
  startNewChat() {
    if (this.user) {
      this.http.post<any>('https://ai-hub-doml.onrender.com/api/conversations', {
        userId: this.user.uid,
        aiModel: 'openai'
      })
        .subscribe({
          next: (newConv) => {
            this.router.navigate(['/chat'], { queryParams: { conversationId: newConv._id } });
          },
          error: (err) => console.error('Failed to create conversation:', err)
        });
    }
  }

  async deleteConversation(conversationId: string) {
    const alert = await this.alertController.create({
      header: 'Delete Chat',
      message: 'Are you sure you want to delete this conversation?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.http.delete(`https://ai-hub-doml.onrender.com/api/conversations/${conversationId}`)
              .subscribe({
                next: () => {
                  this.conversations = this.conversations.filter(conv => conv._id !== conversationId);
                  console.log('Conversation deleted');
                },
                error: (err) => console.error('Failed to delete conversation:', err)
              });
          }
        }
      ]
    });

    await alert.present();
  }
}