import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ClaudeService {
    private apiUrl = 'http://localhost:5001/api/claude';

    constructor(private http: HttpClient) { }

    sendMessage(message: string): Observable<any> {
        return this.http.post<any>(this.apiUrl, { prompt: message });
    }
}