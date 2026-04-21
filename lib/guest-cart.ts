// Quản lý giỏ hàng của khách chưa đăng nhập qua localStorage.
// Khi user đăng nhập, GuestCartSync sẽ gọi /api/cart/sync và xóa localStorage.

const STORAGE_KEY = "parfum:guest-cart";

export type GuestCartItem = { productId: string; quantity: number };

function isBrowser() {
  return typeof window !== "undefined";
}

export function getGuestCart(): GuestCartItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is GuestCartItem =>
        x &&
        typeof x.productId === "string" &&
        typeof x.quantity === "number" &&
        x.quantity > 0
    );
  } catch {
    return [];
  }
}

export function addGuestCartItem(productId: string, quantity = 1) {
  if (!isBrowser()) return;
  const items = getGuestCart();
  const idx = items.findIndex((i) => i.productId === productId);
  if (idx >= 0) {
    items[idx].quantity = Math.min(99, items[idx].quantity + quantity);
  } else {
    items.push({ productId, quantity });
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function clearGuestCart() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}
