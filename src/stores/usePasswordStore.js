import { create } from 'zustand';
import { axiosInstance, fetchCsrfToken } from '../lib/axios';

const usePasswordStore = create((set, get) => ({
  email: '',
  token: '',
  password: '',
  password_confirmation: '',
  loading: false,
  error: null,
  successMessage: null,

  setField: (field, value) => set({ [field]: value }),

  sendResetLink: async (email) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      await fetchCsrfToken();
      const res = await axiosInstance.post('/forgot-password', { email });
      set({ successMessage: res.data.message });
    } catch (err) {
      set({ error: err?.response?.data?.message || 'Failed to send reset link' });
    } finally {
      set({ loading: false });
    }
  },

  validateToken: async (email, token) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const res = await axiosInstance.post('/validate-reset-token', { email, token });
      return res.data.valid === true;
    } catch (err) {
      set({ error: err?.response?.data?.message || 'Invalid token' });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  resetPassword: async ({ email, token, password, password_confirmation } = {}) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      // automatically use token from store if not passed
  // try store token, then localStorage fallback
  const storedToken = get().token || localStorage.getItem('password_reset_token');
  const tokenToUse = token || storedToken;
      // don't block if token is missing client-side; allow server to decide
      await fetchCsrfToken();
      const res = await axiosInstance.post('/reset-password', { email, token: tokenToUse, password, password_confirmation });
  set({ successMessage: res.data.message, token: '' });
  // cleanup persisted token after successful reset
  try { localStorage.removeItem('password_reset_token'); } catch (e) { /* ignore */ }
    } catch (err) {
      set({ error: err?.response?.data?.message || 'Failed to reset password' });
    } finally {
      set({ loading: false });
    }
  }
}));

export default usePasswordStore;
