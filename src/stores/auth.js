import { defineStore } from "pinia";
import api from "../services/auth.js";
import Cookies from "js-cookie";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    accessToken: null,
    refreshToken: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
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
          const { access_token, refresh_token, data: user } = response.data;

          this.user = user;
          this.accessToken = access_token;
          this.refreshToken = refresh_token;

          Cookies.set("access_token", access_token, {
            secure: true,
            sameSite: "Strict",
          });
          Cookies.set("refresh_token", refresh_token, {
            secure: true,
            sameSite: "Strict",
          });
          // Cookies.set("user", JSON.stringify(user), {
          //   secure: true,
          //   sameSite: "Strict",
          // });

          return response.data;
        } else {
          return response.data;
        }
      } catch (error) {
        return {
          status: false,
          message:
            error.response?.data?.message || "Unable to connect to the server.",
        };
      }
    },

    async getProfile() {
      try {
        const response = await api.get("/api/auth/session/get_profile/");
        if (response.data.status) {
          this.user = response.data.data;
          Cookies.set("user", JSON.stringify(this.user), {
            secure: true,
            sameSite: "Strict",
          });
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    },

    logout() {
      this.user = null;
      this.accessToken = null;
      this.refreshToken = null;

      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      Cookies.remove("user");
    },

    initializeAuth() {
      const token = Cookies.get("access_token");
      const user = Cookies.get("user");
      if (token && user) {
        this.accessToken = token;
        this.user = JSON.parse(user);
        this.refreshToken = Cookies.get("refresh_token");
      }
    },
  },
});
