import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { firebaseEnvironment } from './app/environments/firebaseEnvironment';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { IonicRouteStrategy } from '@ionic/angular';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp } from 'firebase/app';
import { isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';

// Initialize Firebase with the app's Firebase configuration
initializeApp(firebaseEnvironment.firebaseConfig);

bootstrapApplication(AppComponent, {
  // Bootstrap the Angular application with required providers and configuration
  providers: [
    // Use Ionic's route reuse strategy for better navigation performance
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideRouter(routes), // Provide the application's routing configuration
    provideIonicAngular(),
    provideHttpClient(),
    provideServiceWorker('ngsw-worker.js', { // Register a service worker for PWA support (enabled only in production)
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
}).catch(err => {
  console.error(err);
});