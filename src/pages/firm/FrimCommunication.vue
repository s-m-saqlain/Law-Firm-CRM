<template>
  <div
    class="flex bg-gray-100 font-sans h-[33rem] overflow-hidden rounded-3xl shadow-lg border border-gray-200"
  >
    <aside
      class="w-80 bg-white border-r border-gray-200 hidden md:flex flex-col"
    >
      <div
        class="p-4 bg-[#F1F1FC] flex justify-between items-center rounded-tl-3xl"
      >
        <h1 class="text-xl font-bold text-indigo-600">Messages</h1>
        <span
          v-if="loading"
          class="text-[10px] text-gray-400 animate-pulse uppercase"
          >Loading...</span
        >
      </div>

      <div class="flex-1 overflow-y-auto bg-white">
        <div
          v-for="room in chatRooms"
          :key="room.id"
          @click="selectRoom(room)"
          :class="[
            'p-5 cursor-pointer transition-all border-b border-gray-50 relative group',
            activeRoom?.id === room.id
              ? 'bg-[#F8FAFC] border-l-4 border-indigo-600'
              : 'bg-white hover:bg-gray-50',
          ]"
        >
          <div class="flex justify-between items-center mb-1">
            <span
              class="text-[10px] font-bold text-indigo-500 uppercase tracking-tight"
            >
              {{ room.matter_data?.display_name?.split(":")[0] || "MATTER" }}
            </span>
            <span
              v-if="room.unread_messages_count > 0"
              class="bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md"
            >
              {{ room.unread_messages_count }}
            </span>
          </div>
          <div class="mb-3">
            <h3 class="text-[13px] font-bold text-slate-800 truncate">
              {{ room.chat_title }}
            </h3>
            <p
              class="text-[11px] text-slate-400 italic truncate mt-0.5 font-medium"
            >
              "{{ room.room_last_message }}"
            </p>
          </div>
          <div class="flex justify-between items-center mt-2">
            <div class="flex -space-x-2">
              <img
                v-for="p in room.participants_details.slice(0, 3)"
                :key="p.user_id"
                :src="p.profile_image"
                class="h-7 w-7 rounded-full ring-2 ring-white object-cover"
              />
              <div
                v-if="room.participants_count > 3"
                class="h-7 w-7 rounded-full bg-slate-100 ring-2 ring-white flex items-center justify-center text-[9px] font-bold text-slate-500"
              >
                +{{ room.participants_count - 3 }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <main class="flex-1 flex flex-col min-w-0 bg-white">
      <header
        v-if="activeRoom"
        class="p-4 border-b border-gray-100 flex items-center bg-white shadow-sm z-10"
      >
        <div class="ml-3">
          <p class="text-sm font-bold text-slate-800">
            {{ activeRoom.chat_title }}
          </p>
          <div
            class="flex items-center text-[10px] text-green-500 font-bold uppercase"
          >
            <span
              class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"
            ></span>
            Online
          </div>
        </div>
      </header>

      <section
        ref="scrollContainer"
        class="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8FAFC] custom-scrollbar"
      >
        <div
          v-if="!activeRoom"
          class="h-full flex flex-col items-center justify-center text-gray-400"
        >
          <p class="text-sm font-medium italic">
            Select a conversation to start chatting
          </p>
        </div>

        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="[
            'flex items-start gap-3',
            msg.is_you ? 'flex-row-reverse' : 'flex-row',
          ]"
        >
          <img
            :src="msg.sender_image"
            class="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm mt-1"
          />
          <div
            :class="[
              'flex flex-col max-w-[75%]',
              msg.is_you ? 'items-end' : 'items-start',
            ]"
          >
            <span
              class="text-[10px] font-extrabold text-slate-500 uppercase mb-1 px-1"
              >{{ msg.sender_name }}</span
            >
            <div
              :class="[
                'p-3 px-5 rounded-3xl shadow-sm text-[13px] font-medium',
                msg.is_you
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-white text-slate-800 border border-gray-100 rounded-tl-none',
              ]"
            >
              {{ msg.text }}
            </div>
            <span class="text-[9px] text-gray-400 mt-1.5 font-bold uppercase">{{
              new Date(msg.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            }}</span>
          </div>
        </div>
      </section>

      <footer v-if="activeRoom" class="p-4 bg-white border-t border-gray-100">
        <form
          @submit.prevent="handleSendMessage"
          class="flex items-center bg-gray-50 rounded-full px-4 py-1 border border-gray-200 focus-within:border-indigo-400 focus-within:bg-white transition-all shadow-inner"
        >
          <input
            v-model="newMessageText"
            type="text"
            placeholder="Type message..."
            class="flex-1 bg-transparent border-none focus:ring-0 outline-none text-sm py-2.5 font-medium"
          />
          <button
            type="submit"
            :disabled="!newMessageText.trim() || isSending"
            class="ml-2 bg-indigo-600 text-white p-2.5 rounded-full hover:bg-indigo-700 shadow-lg disabled:opacity-40 transition-transform active:scale-95"
          >
            <svg
              v-if="!isSending"
              class="h-4 w-4 transform rotate-90"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
              />
            </svg>
            <div
              v-else
              class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></div>
          </button>
        </form>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted, watch } from "vue";
import api from "../../services/auth.js"; // Path adjust kar lena agar alag ho
import { useSocketStore } from "../../stores/socket";
import { useAuthStore } from "../../stores/auth"; // 🔥 Auth store chahiye user ID ke liye
import Swal from "sweetalert2";

// --- CONFIGURATION ---
const socketStore = useSocketStore();
const authStore = useAuthStore(); // Current user ID lene ke liye
const chatRooms = ref([]);
const messages = ref([]);
const activeRoom = ref(null);
const loading = ref(true);
const messagesLoading = ref(false);
const scrollContainer = ref(null);
const newMessageText = ref("");
const isSending = ref(false);

// Toast Configuration
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

// --- API CALLS ---
const fetchChatRooms = async () => {
  try {
    const response = await api.get("/api/chat/firm-chat/filter-all-chatrooms/");
    if (response.data.status) {
      chatRooms.value = response.data.data;
    }
  } catch (error) {
    console.error("Error fetching rooms:", error);
  } finally {
    loading.value = false;
  }
};

const selectRoom = async (room) => {
  activeRoom.value = room;
  messagesLoading.value = true;
  messages.value = []; // Clear old messages

  // ✅ Socket: Join Room
  socketStore.joinRoom(room.id);

  // Unread count reset locally
  room.unread_messages_count = 0;

  try {
    const response = await api.get(
      `/api/chat/firm-chat/get-messages/?room_id=${room.id}`,
    );
    if (response.data.status) {
      messages.value = response.data.data.messages.reverse();
      scrollToBottom();
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
  } finally {
    messagesLoading.value = false;
  }
};

const handleSendMessage = async () => {
  const text = newMessageText.value.trim();
  if (!text || !activeRoom.value || isSending.value) return;

  isSending.value = true;
  const payload = {
    room: activeRoom.value.id,
    message_type: "Text",
    text: text,
  };

  try {
    const response = await api.post(
      "/api/chat/firm-chat/send-message/",
      payload,
    );

    if (response.data.status) {
      // ✅ Optimistic UI update: Message list me daal do
      messages.value.push(response.data.data);
      newMessageText.value = "";
      scrollToBottom();

      // Sidebar update
      updateSidebarRoom(activeRoom.value.id, text, new Date());
    }
  } catch (error) {
    console.error("Send error:", error);
    Toast.fire({ icon: "error", title: "Failed to send message" });
  } finally {
    isSending.value = false;
  }
};

// --- REAL-TIME SOCKET LOGIC ---

// Named function banaya taake remove kar saken easily
const handleIncomingMessage = (data) => {
  // console.log("📩 New Message Received:", data);

  const incomingRoomId = data.room_id || data.room;
  const messageContent = data.message;
  const currentUserId = authStore.user?.id; // Make sure authStore user ID de raha ho

  // 🔥 1. Ignore my own messages (Duplicate prevention)
  if (messageContent.sender === currentUserId) {
    return;
  }

  // 🔥 2. Ignore if message already exists in list (Safety)
  if (messages.value.some((m) => m.id === messageContent.id)) {
    return;
  }

  
  if (activeRoom.value && activeRoom.value.id === incomingRoomId) {
    messages.value.push(messageContent);
    scrollToBottom();
  }
 
  // else {
  //   Toast.fire({
  //     icon: "info",
  //     title: `New message from ${messageContent.sender_name || "User"}`,
  //     text: messageContent.text?.substring(0, 30) + "...",
  //   });

  //   // Sidebar count update
  //   const roomIndex = chatRooms.value.findIndex((r) => r.id === incomingRoomId);
  //   if (roomIndex !== -1) {
  //     chatRooms.value[roomIndex].unread_messages_count += 1;
  //   }
  // }

  // C. Sidebar Update (Move to top)
  updateSidebarRoom(
    incomingRoomId,
    messageContent.text,
    messageContent.created_at,
  );
};

const setupSocketListeners = () => {
  if (!socketStore.socket) return;

  // Pehle purana listener hatao taake duplicate na ho
  socketStore.socket.off("new_message", handleIncomingMessage);

  // Naya listener lagao
  socketStore.socket.on("new_message", handleIncomingMessage);
};

// Helper to update sidebar list
const updateSidebarRoom = (roomId, lastMessage) => {
  // Loose equality (==) use kiya hai taake String vs Number IDs ka masla na ho
  const index = chatRooms.value.findIndex((r) => r.id == roomId);

  if (index !== -1) {
    // 1. Room ko array se nikaal lo (ye original reactive object return karega)
    const [room] = chatRooms.value.splice(index, 1);

    // 2. Last message update karo
    room.room_last_message = lastMessage;

    // 3. Top par wapis insert karo
    chatRooms.value.unshift(room);
  } else {
    // Agar room list me exist hi nahi karta (New Chat), to api se refresh karo
    fetchChatRooms();
  }
};

// Helper: Scroll
const scrollToBottom = () => {
  nextTick(() => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
    }
  });
};

// --- LIFECYCLE ---
onMounted(() => {
  fetchChatRooms();

  // Socket connect logic
  socketStore.connect(); // Ab yeh safe hai, multiple connection nahi banayega

  if (socketStore.isConnected) {
    setupSocketListeners();
  } else {
    // Wait for connection
    const unwatch = socketStore.$subscribe((mutation, state) => {
      if (state.isConnected) {
        setupSocketListeners();
        unwatch();
      }
    });
  }
});

onUnmounted(() => {
  // ✅ Clean up listener specifically
  if (socketStore.socket) {
    socketStore.socket.off("new_message", handleIncomingMessage);
  }
});
</script>
