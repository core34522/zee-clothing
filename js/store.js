// ============================================================
//  ZEE CLOTHING — Products & Orders Service
// ============================================================

import { db, auth } from "./firebase-config.js";
import {
  collection, doc, addDoc, getDoc, getDocs, updateDoc,
  deleteDoc, query, orderBy, where, serverTimestamp, limit
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ─── PRODUCTS ─────────────────────────────────────────────

export async function addProduct(data) {
  return await addDoc(collection(db, "products"), {
    ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp()
  });
}

export async function updateProduct(id, data) {
  await updateDoc(doc(db, "products", id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, "products", id));
}

export async function getProducts() {
  const snap = await getDocs(query(collection(db, "products"), orderBy("createdAt", "desc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getProduct(id) {
  const snap = await getDoc(doc(db, "products", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getFeaturedProducts() {
  const snap = await getDocs(query(collection(db, "products"), where("featured", "==", true), limit(6)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ─── ORDERS ───────────────────────────────────────────────

export async function createOrder(orderData) {
  const user = auth.currentUser;
  const ref = await addDoc(collection(db, "orders"), {
    ...orderData,
    userId:    user?.uid || "guest",
    userEmail: user?.email || orderData.email,
    status:    "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    orderRef:  "ZEE-" + Date.now().toString().slice(-6)
  });
  return ref.id;
}

export async function getOrders() {
  const snap = await getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getUserOrders() {
  const user = auth.currentUser;
  if (!user) return [];
  const snap = await getDocs(query(
    collection(db, "orders"),
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc")
  ));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateOrderStatus(id, status) {
  await updateDoc(doc(db, "orders", id), { status, updatedAt: serverTimestamp() });
}

// ─── CUSTOMERS ────────────────────────────────────────────

export async function getCustomers() {
  const snap = await getDocs(query(collection(db, "users"), orderBy("createdAt", "desc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ─── MESSAGES (Chat) ──────────────────────────────────────

export async function sendMessage(text, isAdmin = false) {
  const user = auth.currentUser;
  await addDoc(collection(db, "messages"), {
    text, isAdmin,
    userId:    user?.uid || "guest",
    userName:  user?.displayName || "Guest",
    userEmail: user?.email || "guest",
    createdAt: serverTimestamp(),
    read: false
  });
}

export async function getMessages(userId) {
  const snap = await getDocs(query(
    collection(db, "messages"),
    where("userId", "==", userId),
    orderBy("createdAt", "asc")
  ));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getAllChats() {
  const snap = await getDocs(query(collection(db, "messages"), orderBy("createdAt", "desc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
