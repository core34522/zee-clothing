// ============================================================
//  ZEE CLOTHING — Cart Service (localStorage)
// ============================================================

const CART_KEY = "zee_cart";

export function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartUI();
}

export function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id && i.size === product.size);
  if (existing) { existing.qty += 1; }
  else { cart.push({ ...product, qty: 1 }); }
  saveCart(cart);
  showCartToast(product.name);
}

export function removeFromCart(id, size) {
  const cart = getCart().filter(i => !(i.id === id && i.size === size));
  saveCart(cart);
}

export function updateQty(id, size, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === id && i.size === size);
  if (item) { item.qty = Math.max(1, qty); }
  saveCart(cart);
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartUI();
}

export function getCartTotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}

export function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function updateCartUI() {
  const badge = document.getElementById("cart-count");
  if (badge) {
    const count = getCartCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
  }
}

function showCartToast(name) {
  const t = document.createElement("div");
  t.style.cssText = `
    position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
    background:#C8FF00; color:#000; padding:12px 24px;
    font-family:'Space Mono',monospace; font-size:11px; letter-spacing:2px;
    text-transform:uppercase; font-weight:700; z-index:9999;
    animation: slideUp 0.3s ease;
  `;
  t.textContent = `✓ ${name} added to cart`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}

// Init on load
document.addEventListener("DOMContentLoaded", updateCartUI);
