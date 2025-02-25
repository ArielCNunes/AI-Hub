import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseEnvironment } from '../environments/firebaseEnvironment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private auth = getAuth(initializeApp(firebaseEnvironment.firebaseConfig));

    // User Sign Up
    async signUp(email: string, password: string): Promise<User | null> {
        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error('Error signing up:', error);
            return null;
        }
    }

    // User Sign In
    async signIn(email: string, password: string): Promise<User | null> {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error('Error signing in:', error);
            return null;
        }
    }

    // User Sign Out
    async signOut(): Promise<void> {
        try {
            await signOut(this.auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }

    // Get Current User
    getCurrentUser(): User | null {
        return this.auth.currentUser;
    }
}