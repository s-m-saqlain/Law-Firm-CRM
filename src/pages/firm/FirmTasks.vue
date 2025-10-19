<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h2
        class="text-[14px] font-semibold Ascending (1, 2, 3, 4, 5, 6, 7, 8) [font-semibold text-[#155DFC]"
      >
        Tasks
      </h2>
      <div class="flex space-x-2">
        <button class="bg-black text-white px-4 py-2 rounded">Tasks</button>
        <button class="bg-gray-100 text-black px-4 py-2 rounded border">
          Task types
        </button>
        <button class="bg-gray-100 text-black px-4 py-2 rounded border">
          Task lists
        </button>
        <button class="bg-gray-100 text-black px-4 py-2 rounded border">
          New task
        </button>
      </div>
    </div>

    <div
      class="flex flex-wrap items-center gap-2 mb-4 bg-white p-3 rounded-md border"
    >
      <div class="flex space-x-2 bg-gray-100 p-1 rounded-md">
        <button
          class="px-3 py-1 rounded-md text-sm font-medium"
          :class="
            activeTab === 'outstanding'
              ? 'bg-white shadow text-black'
              : 'text-gray-600 hover:text-black'
          "
          @click="activeTab = 'outstanding'"
        >
          Outstanding
        </button>
        <button
          class="px-3 py-1 rounded-md text-sm font-medium"
          :class="
            activeTab === 'completed'
              ? 'bg-white shadow text-black'
              : 'text-gray-600 hover:text-black'
          "
          @click="activeTab = 'completed'"
        >
          Completed
        </button>
      </div>

      <div class="relative flex items-center">
        <input
          type="date"
          class="border rounded-md px-2 py-1 text-sm"
          placeholder="From date"
          v-model="fromDate"
        />
        <button
          class="ml-2 text-gray-500"
          :disabled="!fromDate"
          @click="clearFromDate"
          :class="{
            'opacity-50 cursor-not-allowed': !fromDate,
            'hover:text-red-500': fromDate,
          }"
        >
          🗑️
        </button>
      </div>

      <div class="relative flex items-center">
        <input
          type="date"
          class="border rounded-md px-2 py-1 text-sm"
          placeholder="To date"
          v-model="toDate"
        />
        <button
          class="ml-2 text-gray-500"
          :disabled="!toDate"
          @click="clearToDate"
          :class="{
            'opacity-50 cursor-not-allowed': !toDate,
            'hover:text-red-500': toDate,
          }"
        >
          🗑️
        </button>
      </div>

      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search"
          class="border rounded-md px-3 py-1 text-sm w-44"
        />
        <span
          class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
        >
          🔍
        </span>
      </div>
      <select
        class="border rounded-md px-2 py-1 text-sm text-gray-700"
        v-model="selectedPriority"
      >
        <option>All Priorities</option>
        <option>HIGH</option>
        <option>MEDIUM</option>
        <option>LOW</option>
      </select>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-20">
      <div
        class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"
      ></div>
    </div>

    <div v-else class="overflow-x-auto bg-white rounded-lg border shadow-sm">
      <table class="min-w-full text-sm border-collapse">
        <thead class="bg-gray-50 text-gray-700 border-b text-left">
          <tr>
            <th class="p-3 border-r">Action</th>
            <th class="p-3 border-r">Due Date</th>
            <th class="p-3 border-r">Name & Description</th>
            <th class="p-3 border-r">Matter</th>
            <th class="p-3 border-r">Assigned Lawyer</th>
            <th class="p-3 border-r">Status</th>
            <th class="p-3 border-r">Priority</th>
            <th class="p-3">Total Time (hr)</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(task, index) in tasks"
            :key="index"
            class="hover:bg-gray-50 border-b"
          >
            <td class="p-3">
              <button
                class="px-3 py-1 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition"
              >
                Mark complete
              </button>
            </td>

            <td class="p-3 text-red-500 font-semibold">
              {{ formatDate(task.deadline) }}
            </td>

            <td class="p-3">
              <a href="#" class="text-blue-600 font-medium hover:underline">
                {{ task.title }}
              </a>
              <div class="text-gray-500 text-xs">
                {{ task.description }}
              </div>
            </td>

            <td class="p-3 text-blue-600 hover:underline">
              {{ task.matter_info.title }}
              <div class="text-xs text-gray-500">
                Stage: {{ task.matter_info.stage }}
              </div>
            </td>

            <td class="p-3">
              {{ task.assigned_lawyer_info.lawyer_name }}
            </td>

            <td class="p-3 text-yellow-600 flex items-center space-x-1">
              <span>🕒</span>
              <span>{{ task.get_status_display }}</span>
            </td>

            <td class="p-3 text-gray-600">
              {{ task.get_priority_display }}
            </td>

            <td class="p-3">
              <button
                class="px-3 py-1 text-sm border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
              >
                + Add Time
              </button>
            </td>
          </tr>

          <tr v-if="tasks.length === 0">
            <td colspan="8" class="text-center text-gray-500 py-6">
              No tasks found.
            </td>
          </tr>
        </tbody>
      </table>

      <div
        class="p-4 flex justify-between items-center text-sm text-gray-600 border-t bg-gray-50 rounded-b-lg"
      >
        <div class="flex space-x-2">
          <button
            class="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
            :disabled="currentPage === 1"
            @click="prevPage"
          >
            ←
          </button>
          <button
            class="px-3 py-1 border rounded bg-white hover:bg-gray-100"
            @click="nextPage"
          >
            →
          </button>
        </div>
        <div>Page {{ currentPage }} of — Showing {{ tasks.length }} tasks</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import Swal from "sweetalert2";
import api from "../../services/auth";

const tasks = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const selectedPriority = ref("All Priorities");
const activeTab = ref("outstanding");
const fromDate = ref("");
const toDate = ref("");
const searchQuery = ref("");

const Toast = Swal.mixin({
  toast: true,
  position: "bottom-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: "#fff",
  color: "#000",
});

const fetchTasks = async () => {
  loading.value = true;
  try {
    const status =
      activeTab.value === "outstanding" ? "OUTSTANDING" : "COMPLETED";
    let url = `/api/firm_side/lawyer/matter_task/filtered_list/?page=${currentPage.value}&status_display=${status}`;

    if (fromDate.value) {
      url += `&from_date=${fromDate.value}`;
    }
    if (toDate.value) {
      url += `&to_date=${toDate.value}`;
    }
    if (searchQuery.value) {
      url += `&status=${encodeURIComponent(searchQuery.value)}`;
    }
    if (selectedPriority.value !== "All Priorities") {
      url += `&priority=${encodeURIComponent(selectedPriority.value)}`;
    }

    const res = await api.get(url);

    if (res.data.status) {
      tasks.value = res.data.data.results || res.data.data;
      console.log(tasks);
    } else {
      tasks.value = [];
      Toast.fire({
        icon: "warning",
        title: "No tasks found!",
      });
    }
  } catch (err) {
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

const clearFromDate = () => {
  fromDate.value = "";
};

const clearToDate = () => {
  toDate.value = "";
};

watch([activeTab, fromDate, toDate, searchQuery, selectedPriority], () => {
  currentPage.value = 1;
  fetchTasks();
});

onMounted(() => {
  fetchTasks();
});
</script>
