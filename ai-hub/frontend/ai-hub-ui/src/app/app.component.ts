import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IonicModule } from '@ionic/angular';  // Import standalone Ionic
import { NavbarComponent } from './components/navbar/navbar.component';  // Import standalone Navbar

@Component({
  selector: 'app-root',
  standalone: true,  // Standalone component
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, IonicModule, NavbarComponent]  // Import other standalone components
})
export class AppComponent { }