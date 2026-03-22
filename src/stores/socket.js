// stores/socket.js
import { defineStore } from "pinia";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const useSocketStore = defineStore("socket", {
  state: () => ({
    socket: null,
    isConnected: false,
    unreadCount: 0, // Global state for unread count
    heartbeatInterval: null,
    latestNotification: null,
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

      // 🔥 NAYA LISTENER: Global Notification
      this.socket.on("new_message_notification", (data) => {
        if (!data || !data.message) return;

        const msg = data.message;

        // Tumhara apna message dobara popup nahi hona chahiye
        // WARNING: Store ke andar apna user ID check karne ka logic add karna padega agar is_you hamesha false ata hai
        if (msg.is_you) return;

        // Custom HTML Toaster with Image, Name, Role and Text
        Toast.fire({
          html: `
            <div style="display: flex; align-items: center; gap: 12px; font-family: sans-serif;">
              <img src="${msg.sender_image || "/default-avatar.png"}" 
                   style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid #e5e7eb;">
              <div style="text-align: left; overflow: hidden;">
                <h4 style="margin: 0; font-size: 14px; font-weight: 600; color: #1f2937; line-height: 1.2;">
                  ${msg.sender_name} 
                  <span style="font-size: 10px; font-weight: bold; color: #4f46e5; background: #e0e7ff; padding: 2px 6px; border-radius: 10px; margin-left: 4px;">
                    ${msg.sender_role || "User"}
                  </span>
                </h4>
                <p style="margin: 2px 0 0 0; font-size: 12px; color: #4b5563; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;">
                  ${msg.text}
                </p>
              </div>
            </div>
          `,
          background: "#ffffff",
          customClass: {
            popup: "rounded-xl shadow-lg border border-gray-100", // Tailwind classes agar configure ki hain
          },
        });
        this.latestNotification = msg;
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
