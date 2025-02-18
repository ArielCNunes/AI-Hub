import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private apiKey = 'apikey'; // Replace with your actual API key

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<any> {
    const body = {
      model: 'gpt-3.5-turbo', // Or 'gpt-4' if you have access
      messages: [{ role: 'user', content: message }]
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}