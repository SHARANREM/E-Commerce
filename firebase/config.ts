
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * SECURITY RULES EXPLANATION:
 * 1. users: Allow read if request.auth.uid == userId. Allow write if request.auth != null. Admin has full access.
 * 2. products: Allow read to anyone. Allow write/delete ONLY to admin (checked via users collection role).
 * 3. carts: Allow read/write only if request.auth.uid == userId.
 * 4. orders: Allow read/write if request.auth.uid == userId. Allow read/update status for admins.
 * 
 * To set an admin initially: Manually edit a user document in Firestore to have role: "admin".
 */

const firebaseConfig = {
  apiKey: "AIzaSyDidEpU3fL6RoxVqMMTADYgTbqveMolnNY",
  authDomain: "e-commerce-website-a5f0c.firebaseapp.com",
  databaseURL: "https://e-commerce-website-a5f0c-default-rtdb.firebaseio.com",
  projectId: "e-commerce-website-a5f0c",
  storageBucket: "e-commerce-website-a5f0c.firebasestorage.app",
  messagingSenderId: "856106767066",
  appId: "1:856106767066:web:6e4d84107fc41b0fa70be3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
