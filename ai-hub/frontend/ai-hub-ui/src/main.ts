import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from './app/environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([]), // Ensure routes are properly configured
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth())
  ]
}).catch(err => console.error(err));