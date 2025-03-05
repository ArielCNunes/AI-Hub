import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClaudeService {
  private apiUrl = 'https://api.anthropic.com/v1/completions'; // Placeholder URL
  private apiKey = environment.claudeApiKey; // Use environment variable for the API key

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<any> {
    const body = {
      model: 'claude-2', // Adjust based on the available model
      prompt: message,
      max_tokens: 100,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
    });

    return this.http.post(this.apiUrl, body, { headers });
  }
}