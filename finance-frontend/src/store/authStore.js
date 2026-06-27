import { create } from 'zustand';

const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  userId: localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null,
  role: localStorage.getItem('role') || null,

  login: (data) => {
    const { token, username, role, userId } = data;
    const user = { username, role, userId };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userId', String(userId));
    localStorage.setItem('role', role);
    set({ token, user, userId, role });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    set({ token: null, user: null, userId: null, role: null });
  },

  isAuthenticated: () => {
    const state = useAuthStore.getState();
    return !!state.token;
  },
}));

export default useAuthStore;
