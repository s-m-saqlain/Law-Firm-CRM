<template>
  <div class="flex h-screen bg-gray-100 font-sans h-[82.5vh]">
    <aside
      class="w-80 bg-white border-r border-gray-200 hidden md:flex flex-col"
    >
      <div class="p-4 bg-[#F1F1FC] rounded-tl-3xl">
        <h1 class="text-xl font-bold text-indigo-600">Messages</h1>
      </div>

      <div class="flex-1 overflow-y-auto">
        <div
          v-for="room in chatRooms"
          :key="room.id"
          @click="selectRoom(room)"
          :class="[
            'p-5 cursor-pointer transition border-b border-gray-50 relative',
            activeRoom?.id === room.id
              ? 'bg-indigo-50'
              : 'bg-white hover:bg-gray-50',
          ]"
        >
          <div class="flex justify-between items-center mb-1">
            <span class="text-[11px] font-bold text-indigo-500 uppercase">
              {{ room.matter_data.display_name.split(":")[0] }}
            </span>
            <span
              v-if="room.unread_messages_count > 0"
              class="bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full"
            >
              {{ room.unread_messages_count }}
            </span>
          </div>

          <h3 class="text-sm font-bold text-slate-800 truncate">
            {{ room.chat_title }}
          </h3>
          <p class="text-xs text-slate-400 italic truncate mt-0.5">
            "{{ room.room_last_message }}"
          </p>

          <div class="flex justify-between items-center mt-3">
            <div class="flex -space-x-2">
              <img
                v-for="p in room.participants_details.slice(0, 3)"
                :key="p.user_id"
                :src="p.profile_image"
                class="h-7 w-7 rounded-full ring-2 ring-white object-cover"
              />
              <div
                v-if="room.participants_count > 3"
                class="h-7 w-7 rounded-full bg-gray-100 ring-2 ring-white flex items-center justify-center text-[10px] font-bold text-gray-500"
              >
                +{{ room.participants_count - 3 }}
              </div>
            </div>
            <span class="text-[10px] text-slate-400 flex items-center">
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"
                ></path>
              </svg>
              {{ room.participants_count }} Members
            </span>
          </div>
        </div>
      </div>
    </aside>

    <main class="flex-1 flex flex-col min-w-0 bg-white">
      <header
        v-if="activeRoom"
        class="p-[15px] border-b border-gray-100 flex items-center shadow-sm rounded-tr-3xl bg-white"
      >
        <div
          class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold"
        >
          {{ activeRoom.chat_title.charAt(0) }}
        </div>
        <div class="ml-3">
          <p class="text-sm font-bold text-gray-800">
            {{ activeRoom.chat_title }}
          </p>
          <p class="text-[10px] text-green-500 flex items-center">
            <span class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
            Online
          </p>
        </div>
      </header>

      <section
        ref="scrollContainer"
        class="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8FAFC]"
      >
        <div
          v-if="!activeRoom"
          class="h-full flex items-center justify-center text-gray-400"
        >
          Select a chat to start messaging
        </div>

        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="[
            'flex items-start gap-2',
            msg.is_you ? 'flex-row-reverse' : 'flex-row',
          ]"
        >
          <img
            :src="msg.sender_image"
            class="w-8 h-8 rounded-full object-cover border border-gray-200 mt-1"
          />

          <div
            :class="[
              'flex flex-col max-w-[70%]',
              msg.is_you ? 'items-end' : 'items-start',
            ]"
          >
            <span
              class="text-[10px] font-bold text-gray-500 uppercase mb-1 px-1"
            >
              {{ msg.sender_name }}
            </span>

            <div
              :class="[
                'p-3 px-4 rounded-2xl shadow-sm text-sm relative',
                msg.is_you
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none',
              ]"
            >
              {{ msg.text }}
            </div>

            <span class="text-[9px] text-gray-400 mt-1 uppercase">
              {{
                new Date(msg.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
            </span>
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
            placeholder="Type your message here..."
            class="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2.5 placeholder-slate-400 font-medium"
          />

          <button
            type="submit"
            :disabled="!newMessageText.trim() || isSending"
            class="ml-2 bg-indigo-600 text-white p-2.5 rounded-full hover:bg-indigo-700 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-transform active:scale-95 flex items-center justify-center"
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
import { ref, onMounted, nextTick } from "vue";
import api from "../../services/auth.js";

const chatRooms = ref([]);
const messages = ref([]);
const activeRoom = ref(null);
const loading = ref(true);
const messagesLoading = ref(false);
const scrollContainer = ref(null);
const newMessageText = ref("");
const isSending = ref(false);

const fetchChatRooms = async () => {
  try {
    const response = await api.get("/api/chat/firm-chat/filter-all-chatrooms/");
    if (response.data.status) {
      chatRooms.value = response.data.data;
    }
  } catch (error) {
    console.error("Error fetching chatrooms:", error);
  } finally {
    loading.value = false;
  }
};

const selectRoom = async (room) => {
  activeRoom.value = room;
  messagesLoading.value = true;
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

const scrollToBottom = () => {
  nextTick(() => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
    }
  });
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
      // messages.value.push(response.data.data);

      newMessageText.value = "";
      scrollToBottom();
    }
  } catch (error) {
    console.error("Sending failed:", error);
    alert("Message nahi bheja ja saka.");
  } finally {
    isSending.value = false;
  }
};

onMounted(fetchChatRooms);
</script>
