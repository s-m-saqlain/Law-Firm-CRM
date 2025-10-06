<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4 flex items-center gap-2">
      <span>🎓</span> Lawyers
    </h1>

    <div class="flex justify-between items-center mb-3">
      <input
        v-model="search"
        type="text"
        placeholder="Search..."
        class="border rounded-md px-3 py-2 w-64 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <div class="flex gap-2">
        <button
          @click="isModalOpen = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-1"
        >
          <span>➕</span> Add Lawyer
        </button>
        <button
          class="border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-100"
        >
          Columns ▼
        </button>
      </div>
    </div>

    <div class="overflow-x-auto border rounded-lg">
      <table class="min-w-full border-collapse text-sm text-left">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 border text-center">#</th>
            <th class="px-4 py-2 border">Lawyer Name</th>
            <th class="px-4 py-2 border">Email</th>
            <th class="px-4 py-2 border">Specialization</th>
            <th class="px-4 py-2 border">Mobile Number</th>
            <th class="px-4 py-2 border text-center"></th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="loading">
            <td colspan="6" class="text-center py-6">
              <div
                class="flex items-center justify-center gap-2 text-gray-500 text-sm"
              >
                <svg
                  class="animate-spin h-5 w-5 text-blue-500"
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
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                  ></path>
                </svg>
                Loading lawyers...
              </div>
            </td>
          </tr>

          <tr
            v-for="(lawyer, index) in filteredLawyers"
            :key="lawyer.id"
            class="hover:bg-gray-50"
          >
            <td class="px-4 py-2 border text-center">{{ index + 1 }}</td>
            <td class="px-4 py-2 border font-medium">
              {{ lawyer.full_name }}
            </td>
            <td class="px-4 py-2 border">{{ lawyer.email }}</td>
            <td class="px-4 py-2 border">
              {{ lawyer.specialization ? lawyer.specialization : "N/A" }}
            </td>
            <td class="px-4 py-2 border">
              {{ lawyer.mobile_number ? lawyer.mobile_number : "N/A" }}
            </td>
            <td class="px-4 py-2 border text-center">
              <button
                class="p-2 border rounded-md hover:bg-gray-100 transition"
                title="Actions"
              >
                ⋮
              </button>
            </td>
          </tr>

          <tr v-if="!loading && filteredLawyers.length === 0">
            <td colspan="6" class="text-center text-gray-500 py-6">
              No lawyers found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex justify-between items-center text-sm text-gray-500 mt-3">
      <p>0 of {{ lawyers.length }} row(s) selected.</p>
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

    <AddLawyerModal
      :isOpen="isModalOpen"
      @close="isModalOpen = false"
      @saved="fetchLawyers"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Swal from "sweetalert2";
import api from "../../services/auth.js";
import AddLawyerModal from "../../components/Modal/AddLawyerModal.vue";

const lawyers = ref([]);
const search = ref("");
const loading = ref(false);
const isModalOpen = ref(false);

const fetchLawyers = async () => {
  loading.value = true;
  try {
    const response = await api.get(
      "/api/firm_side/lawyer_manage/get_my_lawyers/"
    );

    if (response.data?.status && Array.isArray(response.data.data)) {
      lawyers.value = response.data.data;
    } else {
      lawyers.value = [];
      Swal.fire("No Data", "No lawyers found.", "info");
    }
  } catch (error) {
    Swal.fire("Error", "Failed to fetch lawyers.", "error");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchLawyers();
});

const filteredLawyers = computed(() => {
  return lawyers.value.filter((lawyer) =>
    lawyer.full_name?.toLowerCase().includes(search.value.toLowerCase())
  );
});
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}
</style>
