import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ClaudeService {
    private apiUrl = 'https://ai-hub-doml.onrender.com/api/claude';

    constructor(private http: HttpClient) { }

    // Method to send a message to the Claude API (through the backend)
    sendMessage(message: string): Observable<any> {
        return this.http.post<any>(this.apiUrl, { prompt: message });
    }
}