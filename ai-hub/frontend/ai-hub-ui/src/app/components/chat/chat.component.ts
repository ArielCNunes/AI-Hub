import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { OpenAIService } from '../../services/openai.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})

export class ChatComponent {
  userMessage: string = '';
  chatHistory: { role: string, content: string }[] = [];

  constructor(private openAIService: OpenAIService) {}

  sendMessage() {
    if (!this.userMessage.trim()) return;

    // Add user message to chat history
    this.chatHistory.push({ role: 'user', content: this.userMessage });

    this.openAIService.sendMessage(this.userMessage).subscribe(response => {
      // Get AI response and add to chat history
      const aiMessage = response.choices[0].message.content;
      this.chatHistory.push({ role: 'assistant', content: aiMessage });

      // Clear input field
      this.userMessage = '';
    });
  }
}
