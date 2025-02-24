import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OpenAIService } from '../../services/openai.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  userMessage: string = '';
  chatHistory: { role: string, content: string }[] = [];

  constructor(private http: HttpClient, private openAIService: OpenAIService) { }

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
        userId: '12345',  // Hardcoded for now
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
    this.loadChatHistory();
  }

  loadChatHistory() {
    this.http.get<any[]>('http://localhost:5001/api/chats').subscribe({
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