// firebase-config.js
// Single place where the Firebase app is initialized.
// signin.js and signup.js both import { auth, googleProvider, githubProvider } from here.

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyABrUR5ZwYcXLfwGkyqx7Ncct7Jz5DLqa0",
  authDomain: "chat-room-f4499.firebaseapp.com",
  projectId: "chat-room-f4499",
  storageBucket: "chat-room-f4499.firebasestorage.app",
  messagingSenderId: "1025320632993",
  appId: "1:1025320632993:web:f776e8635808e7fc0266e0",
  databaseURL: "https://chat-room-f4499-default-rtdb.europe-west1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();