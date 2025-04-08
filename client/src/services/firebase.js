// client/src/services/firebase.js
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5Y5Rr14dgTET7eRBYQZFksyex4TDGK9c",
  authDomain: "study-plan-okcu.firebaseapp.com",
  projectId: "study-plan-okcu",
  storageBucket: "study-plan-okcu.firebasestorage.app",
  messagingSenderId: "756565855",
  appId: "1:756565855:web:36a71a58cf9959c7e5d8ea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}; 

// Sign out
export const logoutUser = () => {
  return signOut(auth);
};

export { auth, db };