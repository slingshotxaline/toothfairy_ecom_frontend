import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import { authSlice, cartSlice, uiSlice } from './slices';

export const makeStore = () =>
  configureStore({
    reducer: { [api.reducerPath]: api.reducer, auth: authSlice.reducer, cart: cartSlice.reducer, ui: uiSlice.reducer },
    middleware: (gdm) => gdm().concat(api.middleware),
  });
