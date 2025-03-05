import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  chatHistory: { role: string, content: string }[] = [];
  userId: string | null = null;
  message: string = '';
  response: string = '';

  constructor(
    private http: HttpClient,
    private openAIService: OpenAIService,
    private claudeService: ClaudeService,
    private authService: AuthService
  ) {
    addIcons({ send });
  }

  sendMessageToClaude() {
    if (!this.userMessage.trim()) return;

    this.chatHistory.push({ role: 'user', content: this.userMessage });

    this.claudeService.sendMessage(this.userMessage).subscribe({
      next: (res) => {
        // Get the first response from Claude
        const aiMessage = res?.content?.[0]?.text || 'No response from Claude';
        this.chatHistory.push({ role: 'assistant', content: aiMessage });

        const chatData = {
          userId: this.userId,
          message: this.userMessage,
          response: aiMessage
        };

        this.http.post('http://localhost:5001/api/chats', chatData).subscribe({
          next: () => console.log('Claude chat saved successfully'),
          error: (err) => console.error('Failed to save Claude chat:', err)
        });

        this.userMessage = '';
      },
      error: (err) => {
        console.error('Error communicating with Claude API:', err);
        this.chatHistory.push({
          role: 'assistant',
          content: 'Error communicating with Claude API'
        });
      },
    });
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;

    // Add user message to chat history
    this.chatHistory.push({ role: 'user', content: this.userMessage });

    // Send user message to OpenAI
    this.openAIService.sendMessage(this.userMessage).subscribe(response => {
      // Extract the response from the API response
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

  ngOnInit() {
    // Get the currently logged-in user's ID
    const currentUser = this.authService.getCurrentUser();
    this.userId = currentUser?.uid || null;

    if (this.userId) {
      this.loadChatHistory();
    } else {
      console.error('No user logged in');
    }
  }

  loadChatHistory() {
    this.http.get<any[]>(`http://localhost:5001/api/chats?userId=${this.userId}`).subscribe({
      next: (chats) => {
        // Transform the chat data into a flat array of messages
        this.chatHistory = chats.map(chat => [
          { role: 'user', content: chat.message },
          { role: 'assistant', content: chat.response }
        ]).flat();
      },
      error: (err) => console.error('Failed to load chat history:', err)
    });
  }
}