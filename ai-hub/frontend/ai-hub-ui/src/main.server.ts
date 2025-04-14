import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component'; // Root component of the application

import { config } from './app/app.config.server'; // Server-specific configuration for the app

const bootstrap = () => {
    // Bootstraps the app with server-specific config
    return bootstrapApplication(AppComponent, config);
};

export default bootstrap;
