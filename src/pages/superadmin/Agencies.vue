<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Agencies</h1>

    <div class="flex justify-between items-center mb-3">
      <input
        v-model="search"
        type="text"
        placeholder="Search..."
        class="border rounded-md px-3 py-2 w-64 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <div class="flex items-center space-x-2">
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          + Add Agency
        </button>
        <button
          class="border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-100"
        >
          Columns ▼
        </button>
        <button
          class="border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-100"
        >
          Rows Per Page ▼
        </button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full border border-gray-200 text-sm text-left">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 border text-center">#</th>
            <th class="px-4 py-2 border text-center">First Name</th>
            <th class="px-4 py-2 border text-center">Last Name</th>
            <th class="px-4 py-2 border text-center">Email</th>
            <th class="px-4 py-2 border text-center">Firm Name</th>
            <th class="px-4 py-2 border text-center">Website</th>
            <th class="px-4 py-2 border text-center">Established</th>
            <th class="px-4 py-2 border text-center">Active</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="loading">
            <td colspan="8" class="text-center py-6">
              <div class="flex justify-center items-center space-x-2">
                <svg
                  class="animate-spin h-5 w-5 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                <span>Loading agencies...</span>
              </div>
            </td>
          </tr>

          <tr
            v-for="(agency, index) in filteredAgencies"
            :key="agency.id"
            class="hover:bg-gray-50"
            v-if="!loading"
          >
            <td class="px-4 py-2 border text-center">{{ index + 1 }}</td>
            <td class="px-4 py-2 border font-medium text-center">
              {{ agency.first_name }}
            </td>
            <td class="px-4 py-2 border text-center">
              {{ agency.last_name || "N/A" }}
            </td>
            <td class="px-4 py-2 border text-center">{{ agency.email }}</td>
            <td class="px-4 py-2 border text-center">
              {{ agency.firm_name || "N/A" }}
            </td>
            <td class="px-4 py-2 border text-center">
              {{ agency.website || "N/A" }}
            </td>
            <td class="px-4 py-2 border text-center">
              {{ agency.established_date || "N/A" }}
            </td>
            <td class="px-4 py-2 border text-center font-semibold">
              <span
                :class="agency.is_active ? 'text-green-600' : 'text-red-600'"
              >
                {{ agency.is_active ? "Yes" : "No" }}
              </span>
            </td>
          </tr>

          <tr v-if="!loading && filteredAgencies.length === 0">
            <td colspan="8" class="text-center text-gray-500 py-4">
              No agencies found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex justify-between items-center text-sm text-gray-500 mt-3">
      <p>0 of {{ agencies.length }} row(s) selected.</p>
      <div>
        <button
          class="border rounded-md px-3 py-1 mr-2 hover:bg-gray-100"
          disabled
        >
          Previous
        </button>
        <button class="border rounded-md px-3 py-1 hover:bg-gray-100" disabled>
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Swal from "sweetalert2";
import api from "../../services/auth.js";

const agencies = ref([]);
const search = ref("");
const loading = ref(false);

const fetchAgencies = async () => {
  loading.value = true;
  try {
    const response = await api.get(
      "/api/admin_side/firm_manage/get_all_firms/?page=1&page_size=10"
    );

    if (response.data?.status && Array.isArray(response.data.data)) {
      agencies.value = response.data.data;
    } else {
      agencies.value = [];
    }
  } catch (error) {
    console.error("Error fetching agencies:", error);
    Swal.fire("Error", "Failed to load agencies.", "error");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAgencies();
});

const filteredAgencies = computed(() => {
  return agencies.value.filter((agency) =>
    `${agency.first_name} ${agency.last_name} ${agency.email}`
      .toLowerCase()
      .includes(search.value.toLowerCase())
  );
});

</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}
</style>
