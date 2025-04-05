import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ChatService {
    private apiUrl = 'https://ai-hub-doml.onrender.com/api/chats';

    constructor(private http: HttpClient) { }

    // Fetch all chats
    getChats(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    // Send a new chat
    sendChat(userId: string, message: string, response: string): Observable<any> {
        return this.http.post<any>(this.apiUrl, { userId, message, response });
    }
}