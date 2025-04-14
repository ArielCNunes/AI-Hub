import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, onAuthStateChanged, fetchSignInMethodsForEmail } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseEnvironment } from '../environments/firebaseEnvironment';
import { setPersistence, browserLocalPersistence } from 'firebase/auth';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private auth = getAuth(initializeApp(firebaseEnvironment.firebaseConfig));
    private currentUser: User | null = null;

    // Initialize Firebase Auth
    constructor() {
        // Make sure user stays logged in
        setPersistence(this.auth, browserLocalPersistence)
            .then(() => {
                onAuthStateChanged(this.auth, (user) => {
                    this.currentUser = user;
                });
            })
            .catch((error) => {
                console.error('Failed to set persistence:', error);
            });
    }

    // Creates a new user account with the provided email and password using Firebase Authentication.
    // Returns the created user or a detailed error message if registration fails.
    async signUp(email: string, password: string): Promise<{ user: User | null; error?: string }> {
        try {
            // Create and return user with email and password
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            return { user: userCredential.user };
        } catch (error: any) {
            // Handle different error codes (trying to catch all possible errors)
            if (error.code === 'auth/email-already-in-use') {
                return { user: null, error: 'This email is already registered. Try logging in instead.' };
            }
            else if (error.code === 'auth/weak-password') {
                return { user: null, error: 'Password is too weak. Please try again.' };
            }
            else if (error.code === 'auth/invalid-email') {
                return { user: null, error: 'Invalid email. Please try again.' };
            }
            console.error('Error signing up:', error);
            return { user: null, error: error.message || 'Failed to create account. Please try again.' };
        }
    }

    // Signs in an existing user using their email and password via Firebase Authentication.
    // Returns the authenticated user or a descriptive error message if login fails.
    async signIn(email: string, password: string): Promise<{ user: User | null; error?: string }> {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            return { user: userCredential.user };
        } catch (error: any) {
            // Handle different error codes (trying to catch all possible errors)
            if (error.code === 'auth/invalid-credential') {
                return { user: null, error: 'Incorrect credentials. Please try again.' };
            }
            else if (error.code === 'auth/user-not-found') {
                return { user: null, error: 'No account found with this email.' };
            }
            else if (error.code === 'auth/invalid-email') {
                return { user: null, error: 'Invalid email. Please try again.' };
            }
            else if (error.code === 'auth/wrong-password') {
                return { user: null, error: 'Incorrect password. Please try again.' };
            }
            else if (error.code === 'auth/too-many-requests') {
                return { user: null, error: 'Too many requests. Please try again later.' };
            }
            console.error('Error signing in:', error); // this should not run
            return { user: null, error: 'Failed to sign in. Please try again.' };
        }
    }

    // Logs out the current user from Firebase Authentication.
    async signOut(): Promise<void> {
        try {
            await signOut(this.auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }

    // Checks if an email is already registered in Firebase Authentication.
    // Returns true if the email has sign-in methods associated with it; false otherwise.
    async isEmailTaken(email: string): Promise<boolean> {
        try {
            // Check if email is already in use
            const methods = await fetchSignInMethodsForEmail(this.auth, email);

            // This means the email is already registered
            return methods.length > 0;
        } catch (error: any) {
            if (error.code === 'auth/invalid-email') {
                return false;
            }
            console.error('Unexpected error checking email:', error);
            return false;
        }
    }

    // Returns the currently authenticated user stored in the service.
    // May return null if no user is logged in.
    getCurrentUser(): User | null {
        return this.currentUser;
    }
}