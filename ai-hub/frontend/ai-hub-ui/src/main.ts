import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { firebaseEnvironment } from './app/environments/firebaseEnvironment';
import { provideIonicAngular } from'@ionic/angular/standalone';
import { IonicRouteStrategy } from '@ionic/angular';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp } from 'firebase/app';

// Initialize Firebase
initializeApp(firebaseEnvironment.firebaseConfig);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideRouter(routes),
    provideIonicAngular(),
    provideHttpClient(),
  ],
}).catch(err => console.error(err));