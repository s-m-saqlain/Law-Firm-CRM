<template>
  <div class="flex h-screen bg-white">
    <aside class="w-64 bg-gray-900 text-white flex flex-col justify-between">
      <div>
        <div class="flex items-center gap-2 p-4 border-b border-gray-700">
          <div
            class="bg-blue-600 w-8 h-8 flex items-center justify-center rounded-md"
          >
            <span class="font-bold">F</span>
          </div>
          <div>
            <h2 class="font-semibold text-sm">Firm Inc</h2>
            <p class="text-xs text-gray-400">Enterprise</p>
          </div>
        </div>

        <nav class="flex flex-col p-4 space-y-3 text-sm">
          <RouterLink
            v-for="item in activeNavItems"
            :key="item.name"
            :to="`${basePath}/${item.to}`"
            class="relative flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-800 transition"
            :class="{ 'bg-gray-800': isActive(`${basePath}/${item.to}`) }"
          >
            <component :is="item.icon" class="w-4 h-4" />
            <span class="flex-1">{{ item.name }}</span>

            <span
              v-if="item.name === 'Communication' && item.count > 0"
              class="flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm animate-pulse"
            >
              {{ item.count > 99 ? "99+" : item.count }}
            </span>
          </RouterLink>
        </nav>
      </div>

      <div class="border-t border-gray-700 p-4 relative">
        <div
          class="flex items-center justify-between cursor-pointer"
          @click="toggleDropdown"
        >
          <div class="flex items-center gap-2">
            <img
              v-if="authStore.user?.profile_image"
              :src="authStore.user.profile_image"
              alt="Profile"
              class="w-8 h-8 rounded-full object-cover"
            />
            <div
              v-else
              class="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-xs"
            >
              CN
            </div>
            <div>
              <p class="text-xs font-medium truncate w-28">
                {{ authStore.user?.first_name }}
                {{ authStore.user?.middle_name }}
                {{ authStore.user?.last_name }}
              </p>
              <p class="text-[11px] text-gray-400 truncate w-28">
                {{ authStore.user?.email }}
              </p>
            </div>
          </div>

          <button
            class="text-gray-400 hover:text-white transition-transform"
            :class="{ 'rotate-180': dropdownOpen }"
          >
            ▼
          </button>
        </div>

        <transition name="fade">
          <div
            v-if="dropdownOpen"
            class="absolute bottom-16 left-0 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg overflow-hidden z-10"
          >
            <button
              @click="goToUpdateProfile"
              class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
            >
              Update Profile
            </button>
            <button
              @click="goToChangePassword"
              class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
            >
              Change Password
            </button>
            <button
              @click="logout"
              class="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        </transition>
      </div>
    </aside>

    <div class="flex-1 flex flex-col">
      <header
        class="h-14 bg-gray-900 text-white flex items-center justify-between px-4 border-b border-gray-700"
      >
        <div class="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            class="bg-gray-800 rounded-md px-3 py-1 text-sm focus:outline-none"
          />
        </div>
        <button
          class="p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition"
          title="Toggle Theme"
        >
          ☀️
        </button>
      </header>

      <main class="flex-1 overflow-y-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute, RouterLink, RouterView } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { useSocketStore } from "../../stores/socket";
import {
  LayoutDashboard,
  FileText,
  File,
  ClipboardList,
  FileSignature,
} from "lucide-vue-next";

import api from "../../services/auth.js";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const socketStore = useSocketStore();

// const totalUnreadCount = ref(0);
const basePath = computed(() => `/${route.path.split("/")[1]}`);
const dropdownOpen = ref(false);

// --- API Logic (Sirf Ek Baar Rakhein) ---
const fetchUnreadCount = async () => {
  try {
    const response = await api.get(
      "/api/chat/firm-chat/get-genral-unread-count/",
    );
    if (response.data.status) {
      socketStore.setUnreadCount(response.data.total_unread_count);
      // totalUnreadCount.value = response.data.total_unread_count;
    }
  } catch (error) {
    console.error("Error fetching unread count:", error);
  }
};

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

const navItems = {
  "Super Admin": [
    { name: "Dashboard", to: "dashboard", icon: LayoutDashboard },
    { name: "Communication", to: "communication", icon: LayoutDashboard },
    { name: "Firm", to: "firm", icon: FileText },
    { name: "Analytics", to: "analytics", icon: ClipboardList },
    { name: "Packages", to: "packages", icon: FileSignature },
    { name: "Settings", to: "settings", icon: File },
  ],
  "Law Firm": [
    { name: "Dashboard", to: "dashboard", icon: LayoutDashboard },
    { name: "Communication", to: "communication", icon: LayoutDashboard },
    { name: "Subscription", to: "subscription", icon: FileText },
    { name: "Lawyer", to: "lawyer", icon: File },
    { name: "Account", to: "account", icon: ClipboardList },
    { name: "Matters", to: "matters", icon: FileSignature },
    { name: "Tasks", to: "tasks", icon: File },
    { name: "Bills", to: "bills", icon: ClipboardList },
    { name: "Clients", to: "clients", icon: FileSignature },
  ],
  Lawyer: [
    { name: "Dashboard", to: "dashboard", icon: LayoutDashboard },
    { name: "Communication", to: "communication", icon: LayoutDashboard },
    { name: "Matters", to: "matters", icon: FileText },
    { name: "Documents", to: "documents", icon: File },
    { name: "Tasks", to: "tasks", icon: ClipboardList },
    { name: "Cover Letter", to: "cover-letter", icon: FileSignature },
  ],
};

const activeNavItems = computed(() => {
  const role = authStore.userRole;
  const items = navItems[role] || [];

  return items.map((item) => {
    if (item.name === "Communication") {
      return { ...item, count: socketStore.unreadCount };
    }
    return item;
  });
});

function isActive(path) {
  return route.path === path;
}

function logout() {
  dropdownOpen.value = false;
  authStore.logout();
  router.push("/login");
}

function goToChangePassword() {
  dropdownOpen.value = false;
  const role = authStore.userRole;
  const pathMap = {
    "Super Admin": "/super-admin/change-password",
    "Law Firm": "/firm/change-password",
    Lawyer: "/lawyer/change-password",
  };
  router.push(pathMap[role] || "/login");
}

function goToUpdateProfile() {
  dropdownOpen.value = false;
  const role = authStore.userRole;
  const pathMap = {
    "Super Admin": "/super-admin/update-profile",
    "Law Firm": "/firm/update-profile",
    Lawyer: "/lawyer/update-profile",
  };
  router.push(pathMap[role] || "/login");
}

onMounted(async () => {
  authStore.initializeAuth(); // Ye socket connect kar dega agar token hoga
  await authStore.getProfile();
  fetchUnreadCount(); // Initial value laane ke liye
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}
</style>
