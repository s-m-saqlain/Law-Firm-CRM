<template>
  <div class="flex h-screen bg-gray-100 font-sans h-[83vh]">
    <aside
      class="w-80 bg-white border-r border-gray-200 hidden md:flex flex-col"
    >
      <div
        class="p-4 border-b border-gray-200 flex justify-between items-center"
      >
        <h1 class="text-xl font-bold text-indigo-600">MyChat</h1>
        <span v-if="loading" class="text-xs text-gray-400 animate-pulse"
          >Loading...</span
        >
      </div>

      <div class="flex-1 overflow-y-auto">
        <div
          v-for="room in chatRooms"
          :key="room.id"
          class="flex items-center p-4 cursor-pointer hover:bg-indigo-50 transition border-b border-gray-50"
        >
          <div class="relative">
            <img
              :src="room.participants_details[0]?.profile_image"
              class="w-12 h-12 rounded-full object-cover border border-gray-200"
              alt="profile"
            />
            <span
              v-if="room.unread_messages_count > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full border-2 border-white"
            >
              {{ room.unread_messages_count }}
            </span>
          </div>

          <div class="ml-4 flex-1">
            <div class="flex justify-between items-start">
              <p class="text-sm font-bold text-gray-900 truncate w-32">
                {{ room.chat_title }}
              </p>
              <span
                class="text-[10px] text-indigo-500 font-medium bg-indigo-50 px-2 py-0.5 rounded"
              >
                {{ room.participants_details[0]?.role }}
              </span>
            </div>
            <p class="text-xs font-semibold text-gray-700 truncate">
              {{ room.participants_details[0]?.full_name }}
            </p>
            <p class="text-xs text-gray-500 truncate mt-1">
              {{ room.room_last_message || "No messages yet" }}
            </p>
          </div>
        </div>

        <div
          v-if="!loading && chatRooms.length === 0"
          class="p-10 text-center text-gray-400"
        >
          No chats found.
        </div>
      </div>
    </aside>

    <main class="flex-1 flex flex-col min-w-0 bg-white">
      <header
        class="p-[10px] border-b border-gray-200 flex items-center justify-between shadow-sm"
      >
        <div class="flex items-center">
          <div class="w-10 h-10 bg-green-500 rounded-full"></div>
          <div class="ml-3">
            <p class="text-sm font-bold">Active Contact</p>
            <p class="text-xs text-green-500 italic">Online</p>
          </div>
        </div>
      </header>

      <section class="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
        <div class="flex items-end">
          <div
            class="max-w-xs lg:max-w-md bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100"
          >
            <p class="text-sm text-gray-800">
              Assalam-o-Alaikum! Project kahan tak pohancha?
            </p>
            <span class="text-[10px] text-gray-400 mt-1 block text-right"
              >10:45 AM</span
            >
          </div>
        </div>

        <div class="flex items-end justify-end">
          <div
            class="max-w-xs lg:max-w-md bg-indigo-600 p-3 rounded-2xl rounded-br-none shadow-md"
          >
            <p class="text-sm text-white">
              Walaikum-Assalam! Bas Websockets integrate kar raha hoon.
            </p>
            <span class="text-[10px] text-indigo-200 mt-1 block text-right"
              >10:46 AM</span
            >
          </div>
        </div>
      </section>

      <footer class="p-4 bg-white border-t border-gray-200">
        <div class="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Type a message..."
            class="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2"
          />
          <button
            class="ml-2 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
              />
            </svg>
          </button>
        </div>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/auth.js";

const chatRooms = ref([]);
const loading = ref(true);

const fetchChatRooms = async () => {
  try {
    const response = await api.get("/api/chat/firm-chat/filter-all-chatrooms/");
    console.log(response)
    if (response.data.status) {
      chatRooms.value = response.data.data;
    }
  } catch (error) {
    console.error("Error fetching chatrooms:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchChatRooms();
});
</script>
