<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Lawyer Dashboard</h1>

    <div v-if="loading" class="text-gray-500">Loading stats...</div>

    <div v-else class="grid grid-cols-3 gap-4">
      <div class="bg-white p-6 shadow rounded-lg">
        <p class="text-sm text-gray-500">Total Assign Matter</p>
        <h2 class="text-2xl font-bold">{{ stats.total_assign_matters }}</h2>
      </div>
      <div class="bg-white p-6 shadow rounded-lg">
        <p class="text-sm text-gray-500">Incomplete Task</p>
        <h2 class="text-2xl font-bold">{{ stats.in_complete_task }}</h2>
      </div>
      <div class="bg-white p-6 shadow rounded-lg">
        <p class="text-sm text-gray-500">Completed Task</p>
        <h2 class="text-2xl font-bold">{{ stats.completed_task }}</h2>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/auth.js";

const stats = ref({});
const loading = ref(true);

async function fetchDashboardStats() {
  try {
    const res = await api.get("/api/lawyer_side/analytics/dashboard_stats/");
    console.log(res.data);
    if (res.data) {
      stats.value = res.data.data;
    } else {
      console.error("Error fetching stats:", res.data);
    }
  } catch (err) {
    console.error("API error:", err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchDashboardStats();
});
</script>
