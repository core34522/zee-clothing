// ============================================================
//  ZEE CLOTHING — Firebase Config
//  Replace ALL values below with your real Firebase credentials
//  Firebase Console → Project Settings → Your Apps → Web App
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth }        from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore }   from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBu1TEtpMt0fZlQBk6eb6kQqjRBv2Vyb2g",
  authDomain: "zee-brand-853d5.firebaseapp.com",
  projectId: "zee-brand-853d5",
  storageBucket: "zee-brand-853d5.firebasestorage.app",
  messagingSenderId: "837952716272",
  appId: "1:837952716272:web:8ddb11af5cd53b48e3f135"
};
const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
export default app;
