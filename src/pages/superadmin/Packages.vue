<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Packages</h1>

    <div class="flex justify-between items-center mb-3">
      <input
        v-model="search"
        type="text"
        placeholder="Filter tasks..."
        class="border rounded-md px-3 py-2 w-64 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <div>
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mr-2"
        >
          + Add Package
        </button>
        <button
          class="border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-100"
        >
          Columns ▼
        </button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full border border-gray-200 text-sm text-left">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 border text-center">#</th>
            <th class="px-4 py-2 border text-center">Package Name</th>
            <th class="px-4 py-2 border text-center">Duration</th>
            <th class="px-4 py-2 border text-center">Price</th>
            <th class="px-4 py-2 border text-center">No. of Agents</th>
            <th class="px-4 py-2 border text-center">Cases per Agent</th>
            <th class="px-4 py-2 border text-center">Active/Deactivate</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="loading">
            <td colspan="7" class="text-center py-6">
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
                <span>Loading packages...</span>
              </div>
            </td>
          </tr>

          <tr
            v-for="(pkg, index) in filteredPackages"
            :key="pkg.id"
            class="hover:bg-gray-50"
            v-if="!loading"
          >
            <td class="px-4 py-2 border text-center">{{ index + 1 }}</td>
            <td class="px-4 py-2 border font-medium text-center">
              {{ pkg.name }}
            </td>
            <td class="px-4 py-2 border text-center">
              {{ pkg.duration_value }} {{ pkg.duration_unit }}
            </td>
            <td class="px-4 py-2 border text-center">${{ pkg.price }}</td>
            <td class="px-4 py-2 border text-center">
              {{ pkg.no_of_lawyers }}
            </td>
            <td class="px-4 py-2 border text-center">
              {{ pkg.no_of_case_per_lawyer }}
            </td>

            <td class="px-4 py-2 border text-center flex justify-center">
              <div
                @click="toggleStatus(pkg)"
                class="relative w-12 h-6 rounded-full cursor-pointer transition-colors duration-300"
                :class="
                  pkg.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'
                "
              >
                <div
                  class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300"
                  :class="
                    pkg.status === 'Active' ? 'translate-x-6' : 'translate-x-0'
                  "
                ></div>
              </div>
            </td>
          </tr>

          <tr v-if="!loading && filteredPackages.length === 0">
            <td colspan="7" class="text-center text-gray-500 py-4">
              No packages found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex justify-between items-center text-sm text-gray-500 mt-3">
      <p>0 of {{ packages.length }} row(s) selected.</p>
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

const packages = ref([]);
const search = ref("");
const loading = ref(false);

const fetchPackages = async () => {
  loading.value = true;
  try {
    const response = await api.get(
      "/api/admin_side/package_manage/get_packages/"
    );
    if (response.data?.status && Array.isArray(response.data.data)) {
      packages.value = response.data.data;
    } else {
      packages.value = [];
    }
  } catch (error) {
    console.error("Error fetching packages:", error);
    Swal.fire("Error", "Failed to load packages.", "error");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPackages();
});

const filteredPackages = computed(() => {
  return packages.value.filter((pkg) =>
    pkg.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const toggleStatus = async (pkg) => {
  const newStatus = pkg.status === "Active" ? 0 : 1;
  try {
    const response = await api.patch(
      "/api/admin_side/package_manage/toggle_status/",
      {
        id: pkg.id,
        status: newStatus,
      }
    );

    if (response.data?.status) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Package ${
          newStatus === 1 ? "activated" : "deactivated"
        } successfully!`,
        timer: 1500,
        showConfirmButton: false,
      });

      await fetchPackages();
    } else {
      Swal.fire("Error", "Failed to update package status.", "error");
    }
  } catch (error) {
    console.error("Error toggling status:", error);
    Swal.fire("Error", "An error occurred while updating status.", "error");
  }
};
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}
</style>
