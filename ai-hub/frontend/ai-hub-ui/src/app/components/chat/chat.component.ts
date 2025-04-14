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

    // Set the selected AI model on component initialization
    // This will be used to determine which AI model to use for the conversation
    this.route.queryParams.subscribe(params => {
      this.selectedAIModel = params['model'] || 'openai';
      this.conversationId = params['conversationId'] || null;
    });
  }

  ngOnInit() {
    // Get the current user ID from the AuthService
    const currentUser = this.authService.getCurrentUser();
    this.userId = currentUser?.uid || null;

    // Check if the user is logged in
    // If logged in, load the chat history and conversation info (AI model)
    if (this.userId) {
      this.loadChatHistory();
      this.loadConversationInfo();
    } else {
      console.error('No user logged in');
    }
  }

  // Send message to AI model
  sendMessage(selectedAIModel: string) {
    if (!this.userMessage.trim()) return; // Prevent sending empty messages

    // Add the user's message to the chat history
    this.chatHistory.push({ role: 'user', content: this.userMessage });
    const userMessage = this.userMessage;
    this.userMessage = '';

    // Check if the conversation is new and update the title
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
          // Extracting the message from Claude's response and adding it to chat history
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
          // Extracting the message and tokens from OpenAI's response
          const aiMessage = response.message;
          const tokens = response.tokens;
          this.chatHistory.push({ role: 'assistant', content: aiMessage });
          this.saveChat(userMessage, aiMessage, tokens);

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

  // Save chat message and response to the backend
  private saveChat(message: string, response: string, tokens: number = 0) {
    const chatData = {
      userId: this.userId,
      conversationId: this.conversationId,
      message,
      response,
      tokens
    };

    // API call to save chat data in the backend
    // This will save the chat message, response, and tokens to the database
    this.http.post('https://ai-hub-doml.onrender.com/api/chats', chatData).subscribe({
      next: () => console.log('Chat saved successfully. Model:' + this.selectedAIModel),
      error: (err) => console.error('Failed to save chat:', err)
    });
  }

  // Load chat history from the backend
  // This will fetch the chat history for the current user and conversation
  loadChatHistory() {
    this.http.get<any[]>(`https://ai-hub-doml.onrender.com/api/chats?userId=${this.userId}&conversationId=${this.conversationId}`).subscribe({
      next: (chats) => {
        this.chatHistory = chats.map(chat => [
          { role: 'user', content: chat.message },
          { role: 'assistant', content: chat.response }
        ]).flat(); // Flatten the array of chat messages
      },
      error: (err) => console.error('Failed to load chat history:', err)
    });
  }

  // Update the title of the conversation in the backend
  // This will be called when the user sends the first message in a new conversation
  private updateConversationTitle(title: string) {
    if (!this.conversationId) return;

    // API call to update conversation title in backend
    this.http.patch(`https://ai-hub-doml.onrender.com/api/conversations/${this.conversationId}`, { title }).subscribe({
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
      "Limit to 10 words and do not include your response.";

    // Prepare the messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...this.chatHistory // Include the chat history
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
    this.http.patch(`https://ai-hub-doml.onrender.com/api/conversations/${this.conversationId}`, { summary }).subscribe({
      next: () => console.log('Summary saved'),
      error: (err) => console.error('Failed to save summary:', err)
    });
  }

  // Load conversation info from the backend
  private loadConversationInfo() {
    if (!this.conversationId) return;

    // API call to get AI model
    this.http.get<any>(`https://ai-hub-doml.onrender.com/api/conversations/${this.conversationId}`).subscribe({
      next: (conversation) => {
        this.selectedAIModel = conversation.aiModel || 'openai';
      },
      error: (err) => {
        console.error('Failed to load conversation info:', err);
      }
    });
  }

  // Update the AI model for the current conversation
  public updateAIModel(model: string) {
    this.selectedAIModel = model;

    if (!this.conversationId) return;

    this.http.patch(`https://ai-hub-doml.onrender.com/api/conversations/${this.conversationId}`, {
      aiModel: model
    }).subscribe({
      next: () => console.log('AI model updated to:', model),
      error: (err) => console.error('Failed to update AI model:', err)
    });
  }
}