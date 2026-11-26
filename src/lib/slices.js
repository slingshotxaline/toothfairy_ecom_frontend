import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: { token: null, user: null, ready: false },
  reducers: {
    hydrate: (s, { payload }) => ({ ...s, ...payload, ready: true }),
    setCredentials: (s, { payload }) => { s.token = payload.token; s.user = payload.user; localStorage.setItem('tf_auth', JSON.stringify(payload)); },
    setUser: (s, { payload }) => { s.user = payload; },
    logout: (s) => { s.token = null; s.user = null; localStorage.removeItem('tf_auth'); },
  },
});

export const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    hydrateCart: (s, { payload }) => { s.items = payload || []; },
    addItem: (s, { payload }) => {
      const key = `${payload.productId}:${payload.variantId || ''}`;
      const ex = s.items.find((i) => i.key === key);
      if (ex) ex.qty = Math.min(ex.qty + payload.qty, payload.max || 20);
      else s.items.push({ ...payload, key });
    },
    setQty: (s, { payload: { key, qty } }) => { const i = s.items.find((x) => x.key === key); if (i) i.qty = Math.max(1, Math.min(qty, i.max || 20)); },
    removeItem: (s, { payload }) => { s.items = s.items.filter((i) => i.key !== payload); },
    clearCart: (s) => { s.items = []; },
  },
});

export const uiSlice = createSlice({
  name: 'ui',
  initialState: { toast: null },
  reducers: { toast: (s, { payload }) => { s.toast = { text: payload, id: Date.now() }; }, clearToast: (s) => { s.toast = null; } },
});

export const { hydrate, setCredentials, setUser, logout } = authSlice.actions;
export const { hydrateCart, addItem, setQty, removeItem, clearCart } = cartSlice.actions;
export const { toast, clearToast } = uiSlice.actions;
