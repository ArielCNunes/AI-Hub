import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { OpenAIService } from '../../services/openai.service';
import { ClaudeService } from '../../services/claude.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { send } from 'ionicons/icons';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  userMessage: string = '';
  response: string = '';
  userId: string | null = null;
  conversationId: string | null = null;
  chatHistory: { role: string, content: string }[] = [];
  selectedAIModel: string = 'openai';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private openAIService: OpenAIService,
    private claudeService: ClaudeService,
    private authService: AuthService
  ) {
    addIcons({ send });

    // Set the selected AI model
    this.route.queryParams.subscribe(params => {
      this.selectedAIModel = params['model'] || 'openai';
      this.conversationId = params['conversationId'] || null;
    });
  }

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    this.userId = currentUser?.uid || null;

    if (this.userId) {
      this.loadChatHistory();
    } else {
      console.error('No user logged in');
    }
  }

  // Send message to AI model
  sendMessage(selectedAIModel: string) {
    if (!this.userMessage.trim()) return;

    this.chatHistory.push({ role: 'user', content: this.userMessage });
    const userMessage = this.userMessage;
    this.userMessage = '';

    if (selectedAIModel === 'claude') {
      this.claudeService.sendMessage(userMessage).subscribe({
        next: (res) => {
          const aiMessage = res?.content?.[0]?.text || 'No response from Claude';
          this.chatHistory.push({ role: 'assistant', content: aiMessage });
          this.saveChat(userMessage, aiMessage);
        },
        error: (err) => {
          console.error('Error communicating with Claude API:', err);
          this.chatHistory.push({ role: 'assistant', content: 'Error communicating with Claude API' });
        }
      });
    } else {
      this.openAIService.sendMessage(userMessage).subscribe({
        next: (response) => {
          const aiMessage = response.choices[0].message.content;
          this.chatHistory.push({ role: 'assistant', content: aiMessage });
          this.saveChat(userMessage, aiMessage);
        },
        error: (err) => {
          console.error('Error communicating with OpenAI API:', err);
          this.chatHistory.push({ role: 'assistant', content: 'Error communicating with OpenAI API' });
        }
      });
    }
  }

  private saveChat(message: string, response: string) {
    const chatData = {
      userId: this.userId,
      conversationId: this.conversationId,
      message,
      response
    };

    this.http.post('http://localhost:5001/api/chats', chatData).subscribe({
      next: () => console.log('Chat saved successfully'),
      error: (err) => console.error('Failed to save chat:', err)
    });
  }

  loadChatHistory() {
    this.http.get<any[]>(`http://localhost:5001/api/chats?userId=${this.userId}&conversationId=${this.conversationId}`).subscribe({
      next: (chats) => {
        this.chatHistory = chats.map(chat => [
          { role: 'user', content: chat.message },
          { role: 'assistant', content: chat.response }
        ]).flat();
      },
      error: (err) => console.error('Failed to load chat history:', err)
    });
  }
}