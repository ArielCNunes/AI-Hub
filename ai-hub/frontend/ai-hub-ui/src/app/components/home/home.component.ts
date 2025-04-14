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
  user: any = null; // Store current user info
  conversations: any[] = [];

  constructor(private authService: AuthService, public router: Router, private http: HttpClient, private alertController: AlertController) {
    addIcons({ add, trashOutline, flameOutline });
  }

  // Loads the authenticated user and fetches their saved conversations from the backend.
  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.http.get<any[]>(`https://ai-hub-doml.onrender.com/api/conversations?userId=${this.user.uid}`)
        .subscribe(convs => {
          this.conversations = convs;
        });
    }
  }

  // Creates a new conversation for the current user using the OpenAI model and navigates to the chat view.
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

  // Shows a confirmation alert and deletes the selected conversation from the backend if confirmed.
  // Updates the UI by removing the deleted conversation from the list.
  async deleteConversation(conversationId: string) {
    const alert = await this.alertController.create({
      // Create an alert to confirm deletion
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
            // Make a DELETE request to the backend to delete the conversation
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