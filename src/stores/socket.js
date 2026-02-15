// stores/socket.js
import { defineStore } from "pinia";
import { io } from "socket.io-client";
import Cookies from "js-cookie";

export const useSocketStore = defineStore("socket", {
  state: () => ({
    socket: null,
    isConnected: false,
    unreadCount: 0, // Global state for unread count
    heartbeatInterval: null,
  }),

  actions: {
    connect() {
      const token = Cookies.get("access_token");

      // Agar token nahi hai ya socket already connected hai to return ho jao
      if (!token || (this.socket && this.socket.connected)) {
        return;
      }

      console.log("🔌 Initializing Socket Connection...");

      // 1. Initialize Socket
      this.socket = io("wss://lawfirm-chatting.devssh.xyz", {
        auth: {
          token: token, // Header me token key me token bhej rahe hain
        },
        transports: ["websocket"], // Force websocket transport
      });

      // 2. Event Listeners
      this.socket.on("connect", () => {
        console.log("✅ Socket Connected:", this.socket.id);
        this.isConnected = true;

        // 3. Heartbeat Logic (Every 50 seconds)
        this.startHeartbeat();
      });

      this.socket.on("disconnect", () => {
        console.warn("⚠️ Socket Disconnected");
        this.isConnected = false;
        this.stopHeartbeat();
      });

      this.socket.on("connect_error", (err) => {
        console.error("❌ Socket Connection Error:", err.message);
      });

      // 4. Listen for Unread Count Update
      this.socket.on("new_unread_message_count", (data) => {
        console.log("🔔 New Unread Count via Socket:", data);
        if (data && typeof data.unread_count !== "undefined") {
          this.unreadCount = data.unread_count;
        }
      });
    },

    // ✅ New Action: Join Room
    joinRoom(roomId) {
      if (this.socket && this.isConnected) {
        console.log(`➡️ Emitting join_channel for: ${roomId}`);
        this.socket.emit("join_channel", { channel_name: roomId });
      }
    },

    disconnect() {
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
      }
      this.isConnected = false;
      this.stopHeartbeat();
    },

    startHeartbeat() {
      // Purana interval clear karein agr koi hai
      this.stopHeartbeat();

      console.log("💓 Heartbeat started");
      // 50 seconds (50000ms) timer
      this.heartbeatInterval = setInterval(() => {
        if (this.socket && this.isConnected) {
          // console.log("💓 Sending heartbeat_global...");
          this.socket.emit("heartbeat_global", {});
        }
      }, 50000);
    },

    stopHeartbeat() {
      if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
      }
    },

    // Initial load par API se count set karne ke liye helper
    setUnreadCount(count) {
      this.unreadCount = count;
    },
  },
});
