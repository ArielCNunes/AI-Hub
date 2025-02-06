import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';  // Import standalone Navbar

@Component({
  selector: 'app-root',
  standalone: true,  // ✅ This makes it a standalone component
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, NavbarComponent]  // Import other standalone components
})
export class AppComponent { }