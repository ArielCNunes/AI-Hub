import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private apiKey = environment.openaiApiKey; // API key stored in environment.ts (hidden from source control)

  constructor(private http: HttpClient) { }

  sendMessage(message: string): Observable<any> {
    const body = {
      model: 'gpt-3.5-turbo', // Or 'gpt-4' if you have access
      messages: [{ role: 'user', content: message }]
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };

    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      map(res => ({
        message: res.choices[0].message.content,
        tokens: res.usage?.total_tokens ?? 0
      }))
    );
  }

  /**
   * Sends a custom array of messages to the OpenAI Chat API.
   * This method allows for full control over the message history,
   * including system prompts, user/assistant roles, and multi-turn context.
   */
  sendCustomMessage(messages: { role: string, content: string }[]): Observable<any> {
    // Define the body structure with model and messages
    const body = {
      model: 'gpt-3.5-turbo',
      messages
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}