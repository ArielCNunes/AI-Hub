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
      this.loadConversationInfo();
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

    if (this.chatHistory.length === 1) {
      const title = userMessage.length > 50 ? userMessage.slice(0, 47) + '...' : userMessage;
      this.updateConversationTitle(title);
    }

    // Check if the selected AI model is Claude
    if (selectedAIModel === 'claude') {
      // Sending the message to Claude
      this.claudeService.sendMessage(userMessage).subscribe({
        // Handling the response from Claude
        next: (res) => {
          // Extracting the message from Claude's response
          const aiMessage = res?.content?.[0]?.text || 'No response from Claude';
          this.chatHistory.push({ role: 'assistant', content: aiMessage });

          // Saving the message to chat history
          this.saveChat(userMessage, aiMessage);

          // Triggering summary generation as the conversation progresses
          if (this.chatHistory.length > 1) {
            this.generateAndSaveConversationSummary();
          }
        },
        error: (err) => {
          console.error('Error communicating with Claude API:', err);
          this.chatHistory.push({ role: 'assistant', content: 'Error communicating with Claude API' });
        }
      });
    } else {
      // Sending the message to OpenAI
      this.openAIService.sendMessage(userMessage).subscribe({
        // Handling the response from OpenAI
        next: (response) => {
          // Extracting the message from OpenAI's response
          const aiMessage = response.choices[0].message.content;
          this.chatHistory.push({ role: 'assistant', content: aiMessage });

          // Saving the message to chat history
          this.saveChat(userMessage, aiMessage);

          // Triggering summary generation as the conversation progresses
          if (this.chatHistory.length > 1) {
            this.generateAndSaveConversationSummary();
          }
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
      next: () => console.log('Chat saved successfully. Model:' + this.selectedAIModel),
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

  private updateConversationTitle(title: string) {
    if (!this.conversationId) return;

    this.http.patch(`http://localhost:5001/api/conversations/${this.conversationId}`, { title }).subscribe({
      next: () => console.log('Conversation title updated'),
      error: (err) => console.error('Failed to update conversation title:', err)
    });
  }

  // Generate and save a summary of the conversation using OpenAI
  private generateAndSaveConversationSummary() {
    // AI will follow this prompt to generate the summary
    const systemPrompt = "Summarize this conversation in one short sentence. " +
      "Be as short and objective as possible. " +
      "Use third person to refer to the user and assistant. " +
      "Start with 'User wants to...' or 'User asked about...' (a variation of these)'" +
      "Limit to 15 words.";

    // Combine the system prompt with the chat history
    const messages = [
      { role: 'system', content: systemPrompt },
      ...this.chatHistory
    ];

    // Send the prompt and history to OpenAI and subscribe to the response
    this.openAIService.sendCustomMessage(messages).subscribe({
      next: (response) => {
        // Extract the summary from the OpenAI response
        const summary = response.choices[0].message.content;

        // Save the generated summary to the conversation
        this.updateConversationSummary(summary);
      },
      error: (err) => console.error('Failed to generate summary:', err)
    });
  }

  /**
   * Updates the summary field of the current conversation in the backend.
   * Called after a summary is generated from OpenAI to persist it to MongoDB.
   */
  private updateConversationSummary(summary: string) {
    if (!this.conversationId) return;

    // API call to update conversation summary in backend
    this.http.patch(`http://localhost:5001/api/conversations/${this.conversationId}`, { summary }).subscribe({
      next: () => console.log('Summary saved'),
      error: (err) => console.error('Failed to save summary:', err)
    });
  }

  private loadConversationInfo() {
    if (!this.conversationId) return;

    this.http.get<any>(`http://localhost:5001/api/conversations/${this.conversationId}`).subscribe({
      next: (conversation) => {
        this.selectedAIModel = conversation.aiModel || 'openai';
      },
      error: (err) => {
        console.error('Failed to load conversation info:', err);
      }
    });
  }

  public updateAIModel(model: string) {
    this.selectedAIModel = model;

    if (!this.conversationId) return;

    this.http.patch(`http://localhost:5001/api/conversations/${this.conversationId}`, {
      aiModel: model
    }).subscribe({
      next: () => console.log('AI model updated to:', model),
      error: (err) => console.error('Failed to update AI model:', err)
    });
  }
}