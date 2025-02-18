// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBafBOUwsfLPywvV4McO2DUeHhVDJBnTAA",
  authDomain: "ai-hub-a61e1.firebaseapp.com",
  projectId: "ai-hub-a61e1",
  storageBucket: "ai-hub-a61e1.firebasestorage.app",
  messagingSenderId: "547282561512",
  appId: "1:547282561512:web:eedec28b40bb17e0951c5d",
  measurementId: "G-JY12MRGYR6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);