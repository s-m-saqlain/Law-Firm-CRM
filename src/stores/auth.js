import { defineStore } from "pinia";
import api from "../services/auth.js";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    accessToken: null,
    refreshToken: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    userRole: (state) => state.user?.role || null,
  },
  actions: {
    async login(email, password) {
      try {
        const response = await api.post("/api/auth/session/login/", {
          email,
          password,
        });
        if (response.data.status) {
          this.accessToken = response.data.access_token;
          this.refreshToken = response.data.refresh_token;
          this.user = response.data.data;

          localStorage.setItem("access_token", this.accessToken);
          localStorage.setItem("refresh_token", this.refreshToken);
          localStorage.setItem("user", JSON.stringify(this.user));

          return true;
        }
        return false;
      } catch (error) {
        console.error("Login error:", error);
        return false;
      }
    },

    async getProfile() {
      try {
        const response = await api.get("/api/auth/session/get_profile/");
        if (response.data.status) {
          this.user = response.data.data;
          localStorage.setItem("user", JSON.stringify(this.user));
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    },

    logout() {
      this.user = null;
      this.accessToken = null;
      this.refreshToken = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    },

    initializeAuth() {
      const token = localStorage.getItem("access_token");
      const user = localStorage.getItem("user");
      if (token && user) {
        this.accessToken = token;
        this.user = JSON.parse(user);
        this.refreshToken = localStorage.getItem("refresh_token");
      }
    },
  },
});
