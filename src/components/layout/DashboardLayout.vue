<template>
  <div class="flex h-screen bg-gray-100">
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
            class="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-800 transition"
            :class="{ 'bg-gray-800': isActive(`${basePath}/${item.to}`) }"
          >
            <component :is="item.icon" class="w-4 h-4" />
            <span>{{ item.name }}</span>
          </RouterLink>
        </nav>
      </div>

      <div
        class="border-t border-gray-700 p-4 flex items-center justify-between"
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
            <p class="text-xs font-medium">
              {{ authStore.user?.first_name }}
              {{ authStore.user?.middle_name }}
              {{ authStore.user?.last_name }}
            </p>
            <p class="text-[11px] text-gray-400">{{ authStore.user?.email }}</p>
          </div>
        </div>

        <button
          @click="logout"
          class="text-gray-400 hover:text-red-400 text-sm"
        >
          ⎋
        </button>
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
import { computed, onMounted } from "vue";
import { useRouter, useRoute, RouterLink, RouterView } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import {
  LayoutDashboard,
  FileText,
  File,
  ClipboardList,
  FileSignature,
} from "lucide-vue-next";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const basePath = computed(() => `/${route.path.split("/")[1]}`);

const navItems = {
  "Super Admin": [
    { name: "Dashboard", to: "dashboard", icon: LayoutDashboard },
    { name: "Matters", to: "matters", icon: FileText },
    { name: "Documents", to: "documents", icon: File },
    { name: "Tasks", to: "tasks", icon: ClipboardList },
    { name: "Cover Letter", to: "cover-letter", icon: FileSignature },
  ],
  "Law Firm": [
    { name: "Dashboard", to: "dashboard", icon: LayoutDashboard },
    { name: "Matters", to: "matters", icon: FileText },
    { name: "Documents", to: "documents", icon: File },
    { name: "Tasks", to: "tasks", icon: ClipboardList },
    { name: "Cover Letter", to: "cover-letter", icon: FileSignature },
  ],
  Lawyer: [
    { name: "Dashboard", to: "dashboard", icon: LayoutDashboard },
    { name: "Matters", to: "matters", icon: FileText },
    { name: "Documents", to: "documents", icon: File },
    { name: "Tasks", to: "tasks", icon: ClipboardList },
    { name: "Cover Letter", to: "cover-letter", icon: FileSignature },
  ],
};

const activeNavItems = computed(() => {
  const role = authStore.userRole;
  return navItems[role] || [];
});

function isActive(path) {
  return route.path === path;
}

function logout() {
  authStore.logout();
  router.push("/login");
}

onMounted(async () => {
  authStore.initializeAuth();
  await authStore.getProfile();
});
</script>
