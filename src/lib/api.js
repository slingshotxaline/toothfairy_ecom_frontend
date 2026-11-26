import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API,
    prepareHeaders: (h, { getState }) => {
      const t = getState().auth.token;
      if (t) h.set('authorization', `Bearer ${t}`);
      return h;
    },
  }),
  tagTypes: ['Admin', 'Settings', 'Products', 'Me'],
  endpoints: (b) => ({
    // storefront
    settings: b.query({ query: () => '/settings/public', providesTags: ['Settings'] }),
    categories: b.query({ query: () => '/categories', providesTags: ['Admin'] }),
    products: b.query({ query: (params) => ({ url: '/products', params }), providesTags: ['Products'] }),
    product: b.query({ query: (slug) => `/products/${slug}`, providesTags: ['Products'] }),
    zones: b.query({ query: () => '/shipping/zones', providesTags: ['Admin'] }),
    quote: b.mutation({ query: (body) => ({ url: '/shipping/quote', method: 'POST', body }) }),
    validateCoupon: b.mutation({ query: (body) => ({ url: '/coupons/validate', method: 'POST', body }) }),
    placeOrder: b.mutation({ query: (body) => ({ url: '/orders', method: 'POST', body }) }),
    myOrders: b.query({ query: () => '/orders/mine' }),
    subscribe: b.mutation({ query: (email) => ({ url: '/subscribe', method: 'POST', body: { email } }) }),
    customOrder: b.mutation({ query: (fd) => ({ url: '/custom-orders', method: 'POST', body: fd }) }),
    login: b.mutation({ query: (body) => ({ url: '/auth/login', method: 'POST', body }) }),
    register: b.mutation({ query: (body) => ({ url: '/auth/register', method: 'POST', body }) }),
    me: b.query({ query: () => '/auth/me', providesTags: ['Me'] }),
    // admin (path is the part after /admin/)
    adminGet: b.query({ query: (path) => `/admin/${path}`, providesTags: ['Admin'] }),
    adminSave: b.mutation({
      query: ({ path, method = 'POST', body }) => ({ url: `/admin/${path}`, method, body }),
      invalidatesTags: ['Admin', 'Settings', 'Products'],
    }),
    adminDelete: b.mutation({ query: (path) => ({ url: `/admin/${path}`, method: 'DELETE' }), invalidatesTags: ['Admin', 'Products'] }),
    upload: b.mutation({
      query: (file) => { const fd = new FormData(); fd.append('file', file); return { url: '/admin/upload', method: 'POST', body: fd }; },
    }),
  }),
});

export const {
  useSettingsQuery, useCategoriesQuery, useProductsQuery, useProductQuery, useZonesQuery, useQuoteMutation,
  useValidateCouponMutation, usePlaceOrderMutation, useMyOrdersQuery, useSubscribeMutation, useCustomOrderMutation,
  useLoginMutation, useRegisterMutation, useMeQuery, useAdminGetQuery, useAdminSaveMutation, useAdminDeleteMutation, useUploadMutation,
} = api;
