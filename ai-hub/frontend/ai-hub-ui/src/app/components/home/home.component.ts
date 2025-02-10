import { Component } from '@angular/core';
import { IonButton, IonContent, IonCard, IonCardContent, IonCardTitle, IonCardHeader } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    IonButton, IonContent, IonCard, IonCardContent, IonCardTitle, IonCardHeader
  ]
})
export class HomeComponent { }