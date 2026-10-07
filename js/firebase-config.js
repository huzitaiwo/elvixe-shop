import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBjmPSCgMkJswFfSjkNTyxXLixZA8ZiV4I",
  authDomain: "elvixe-shop.firebaseapp.com",
  projectId: "elvixe-shop",
  storageBucket: "elvixe-shop.firebasestorage.app",
  messagingSenderId: "384104818938",
  appId: "1:384104818938:web:0e8d8828c715a7379b8143",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
