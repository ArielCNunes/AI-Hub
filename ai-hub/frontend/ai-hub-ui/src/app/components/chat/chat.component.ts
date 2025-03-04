import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { OpenAIService } from '../../services/openai.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  userMessage: string = '';
  chatHistory: { role: string, content: string }[] = [];
  userId: string | null = null;
  isNewChat: boolean = false;

  constructor(
    private http: HttpClient,
    private openAIService: OpenAIService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Get the currently logged-in user's ID
    const currentUser = this.authService.getCurrentUser();
    this.userId = currentUser?.uid || null;

    if (!this.userId) {
      console.error('No user logged in');
      return;
    }

    // Check if this is a new chat session
    this.route.queryParams.subscribe(params => {
      this.isNewChat = params['newChat'] === 'true';
      if (this.isNewChat) {
        this.chatHistory = []; // Start with an empty chat history
      } else {
        this.loadChatHistory();
      }
    });
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;

    // Add user message to chat history
    this.chatHistory.push({ role: 'user', content: this.userMessage });

    // Send user message to OpenAI
    this.openAIService.sendMessage(this.userMessage).subscribe(response => {
      const aiMessage = response.choices[0].message.content;
      this.chatHistory.push({ role: 'assistant', content: aiMessage });

      // Store chat in MongoDB
      const chatData = {
        userId: this.userId,
        message: this.userMessage,
        response: aiMessage
      };

      this.http.post('http://localhost:5001/api/chats', chatData).subscribe({
        next: () => console.log('Chat saved successfully'),
        error: (err) => console.error('Failed to save chat:', err)
      });

      // Clear input field
      this.userMessage = '';
    });
  }

  loadChatHistory() {
    this.http.get<any[]>(`http://localhost:5001/api/chats?userId=${this.userId}`).subscribe({
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