// ============================================================
//  ZEE CLOTHING — Auth + OTP Service
// ============================================================

import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc, setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp, collection, addDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const googleProvider = new GoogleAuthProvider();

// Generate 6-digit OTP
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTP in Firestore (expires in 10 minutes)
export async function storeOTP(email, otp) {
  await setDoc(doc(db, "otps", email), {
    otp,
    email,
    createdAt: serverTimestamp(),
    expiresAt: Date.now() + 10 * 60 * 1000
  });
}

// Verify OTP
export async function verifyOTP(email, otp) {
  const snap = await getDoc(doc(db, "otps", email));
  if (!snap.exists()) return false;
  const data = snap.data();
  if (Date.now() > data.expiresAt) return false;
  if (data.otp !== otp) return false;
  await deleteDoc(doc(db, "otps", email));
  return true;
}

// Send OTP via EmailJS (free email service)
export async function sendOTPEmail(email, otp, name) {
  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id:  "service_0kx1z58",
        template_id: "template_9k0r5fs",
        user_id:     "2ykOvHcVMbERDDph7",
        template_params: {
          to_email: email,
          to_name:  name || "Customer",
          otp_code: otp,
          brand:    "ZEE CLOTHING"
        }
      })
    });
    return response.ok;
  } catch {
    console.warn("Email sending failed — OTP stored in Firestore");
    return false;
  }
}

// Sign Up
export async function signUp(email, password, fullName) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;
  await updateProfile(user, { displayName: fullName });
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid, fullName, email,
    role: "customer",
    verified: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    phone: null, address: null, orders: []
  });
  return user;
}

// Login
export async function login(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

// Google Login
export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const user   = result.user;
  const ref    = doc(db, "users", user.uid);
  const snap   = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid, fullName: user.displayName,
      email: user.email, role: "customer",
      verified: true, createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      phone: null, address: null, orders: []
    });
  }
  return user;
}

// Logout
export async function logout() {
  await signOut(auth);
  window.location.href = "/zee-clothing/pages/login.html";
}

// Forgot Password
export async function forgotPassword(email) {
  await sendPasswordResetEmail(auth, email, {
    url: window.location.origin + "/pages/login.html"
  });
}

// Get user data
export async function getUserData(uid) {
  const snap = await getDoc(doc(db, "users", uid || auth.currentUser?.uid));
  return snap.exists() ? snap.data() : null;
}

// Update user profile
export async function updateUserProfile(data) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    role: "customer",
    createdAt: serverTimestamp(),
    ...data,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

// Check if admin
export async function isAdmin() {
  const data = await getUserData();
  return data?.role === "admin";
}

// Auth state observer
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}
