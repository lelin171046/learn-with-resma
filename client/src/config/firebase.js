import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBHJwhqBDvB2A9glab2mtI10321_VhbGYs",
  authDomain: "learn-with-resma.firebaseapp.com",
  projectId: "learn-with-resma",
  storageBucket: "learn-with-resma.firebasestorage.app",
  messagingSenderId: "73976263329",
  appId: "1:73976263329:web:ffd5b571b4bf757467b6e0",
  measurementId: "G-F6ZVX2JKL4",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
