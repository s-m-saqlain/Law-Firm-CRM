<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Tasks</h2>
      <div class="flex space-x-2">
        <button class="bg-black text-white px-4 py-2 rounded">Tasks</button>
        <button class="bg-gray-200 text-black px-4 py-2 rounded">
          Task types
        </button>
        <button class="bg-gray-200 text-black px-4 py-2 rounded">
          Task lists
        </button>
        <button class="bg-gray-200 text-black px-4 py-2 rounded">
          New task
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-20">
      <div
        class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"
      ></div>
    </div>

    <div v-else class="overflow-x-auto bg-white rounded shadow">
      <table class="min-w-full border">
        <thead class="bg-gray-100">
          <tr class="text-left text-sm font-semibold text-gray-600">
            <th class="p-3 border">Action</th>
            <th class="p-3 border">Due Date</th>
            <th class="p-3 border">Name & Description</th>
            <th class="p-3 border">Matter</th>
            <th class="p-3 border">Assigned Lawyer</th>
            <th class="p-3 border">Status</th>
            <th class="p-3 border">Priority</th>
            <th class="p-3 border">Total Time (hr)</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(task, index) in tasks"
            :key="index"
            class="text-sm hover:bg-gray-50"
          >
            <td class="p-3 border">
              <button class="border border-gray-300 rounded px-2 py-1 text-sm">
                Mark complete
              </button>
            </td>
            <td class="p-3 border text-red-500 font-semibold">
              {{ formatDate(task.deadline) }}
            </td>
            <td class="p-3 border">
              <div>
                <a href="#" class="text-blue-600 hover:underline font-medium">
                  {{ task.title }}
                </a>
                <div class="text-gray-500 text-xs">{{ task.description }}</div>
              </div>
            </td>
            <td class="p-3 border text-blue-600 hover:underline">
              {{ task.matter_info.title }}
              <div class="text-xs text-gray-500">
                Stage: {{ task.matter_info.stage }}
              </div>
            </td>
            <td class="p-3 border">
              {{ task.assigned_lawyer_info.lawyer_name }}
            </td>
            <td class="p-3 border flex items-center space-x-1 text-yellow-600">
              <span>🕒</span>
              <span>{{ task.get_status_display }}</span>
            </td>
            <td class="p-3 border text-gray-500">
              {{ task.get_priority_display }}
            </td>
            <td class="p-3 border">
              <button
                class="border border-blue-500 text-blue-500 rounded px-2 py-1 text-sm"
              >
                + Add Time
              </button>
            </td>
          </tr>

          <tr v-if="tasks.length === 0">
            <td colspan="8" class="text-center text-gray-500 p-6">
              No tasks found.
            </td>
          </tr>
        </tbody>
      </table>

      <div class="p-4 flex justify-center items-center space-x-4">
        <button
          class="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
          :disabled="currentPage === 1"
          @click="prevPage"
        >
          ←
        </button>
        <span class="text-sm text-gray-600"> Page {{ currentPage }} </span>
        <button
          class="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
          @click="nextPage"
        >
          →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import api from "../../services/auth";

const tasks = ref([]);
const loading = ref(false);
const currentPage = ref(1);

const Toast = Swal.mixin({
  toast: true,
  position: "bottom-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: "#fff",
  color: "#000",
  showClass: {
    popup: "swal2-noanimation",
    backdrop: "swal2-noanimation",
  },
  hideClass: {
    popup: "",
    backdrop: "",
  },
});

const fetchTasks = async () => {
  loading.value = true;
  try {
    const res = await api.get(
      `/api/firm_side/lawyer/matter_task/filtered_list/?page=${currentPage.value}`
    );

    if (res.data.status) {
      tasks.value = res.data.data.results || res.data.data;
      Toast.fire({
        icon: "success",
        title: "Tasks loaded successfully!",
      });
    } else {
      tasks.value = [];
      Toast.fire({
        icon: "warning",
        title: "No tasks found!",
      });
    }
  } catch (err) {
    console.error("API error:", err);
    tasks.value = [];
    Toast.fire({
      icon: "error",
      title: "Failed to load tasks!",
    });
  } finally {
    loading.value = false;
  }
};

const nextPage = () => {
  currentPage.value += 1;
  fetchTasks();
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
    fetchTasks();
  }
};

const formatDate = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

onMounted(() => {
  fetchTasks();
});
</script>

<style scoped>
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
