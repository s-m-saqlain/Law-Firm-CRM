<template>
  <main class="p-4 md:p-6">
    <header class="mb-4 md:mb-6 flex items-center justify-between">
      <h1
        class="flex items-center gap-2 text-xl md:text-2xl font-semibold text-gray-900"
      >
        <span class="text-pretty">Matters</span>
      </h1>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
        @click="onAddMatter"
      >
        <Plus class="h-4 w-4" aria-hidden="true" />
        Add Matter
      </button>
    </header>

    <section class="rounded-lg border border-gray-200 bg-white">
      <div
        class="flex flex-col gap-3 p-3 md:flex-row md:items-center md:justify-between"
      >
        <div class="flex items-center gap-2">
          <button
            v-for="tab in tabs"
            :key="tab"
            type="button"
            class="rounded-md px-3 py-1.5 text-sm border"
            :class="
              selectedTab === tab
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            "
            @click="selectedTab = tab"
          >
            {{ tab }}
          </button>
        </div>

        <div class="flex items-center gap-2">
          <div class="relative w-full md:w-80">
            <Search
              class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
            />
            <input
              v-model="query"
              @input="fetchMatters"
              type="text"
              placeholder="Search matters..."
              class="w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Search matters"
            />
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full border-t border-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr class="text-left text-gray-600">
              <th scope="col" class="px-4 py-3 font-medium w-36">Actions</th>
              <th scope="col" class="px-4 py-3 font-medium">Title</th>
              <th scope="col" class="px-4 py-3 font-medium">Client</th>
              <th scope="col" class="px-4 py-3 font-medium">
                Responsible Solicitor
              </th>
              <th scope="col" class="px-4 py-3 font-medium">
                Originating Solicitor
              </th>
              <th scope="col" class="px-4 py-3 font-medium">
                Responsible Staff
              </th>
              <th scope="col" class="px-4 py-3 font-medium">
                Matter Notification
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="loading">
              <td colspan="7" class="text-center py-8">
                <div
                  class="flex justify-center items-center gap-2 text-gray-500 text-sm"
                >
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
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                    ></path>
                  </svg>
                  Loading matters...
                </div>
              </td>
            </tr>

            <tr
              v-for="row in matters"
              :key="row.id"
              class="border-t border-gray-200 hover:bg-gray-50"
            >
              <td class="px-4 py-3">
                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-gray-700 hover:bg-gray-100"
                >
                  Edit
                </button>
              </td>
              <td class="px-4 py-3 text-gray-900 font-medium">
                {{ row.title }}
              </td>
              <td class="px-4 py-3 text-gray-900">
                {{ row.contact_info?.full_name || "N/A" }}
              </td>
              <td class="px-4 py-3 text-gray-900">
                {{ row.responsible_solicitor_info?.lawyer_full_name || "N/A" }}
              </td>
              <td class="px-4 py-3 text-gray-900">
                {{ row.originating_solicitor_info?.lawyer_full_name || "N/A" }}
              </td>
              <td class="px-4 py-3 text-gray-900">
                <span v-if="row.responsible_staff_info?.length">
                  {{
                    row.responsible_staff_info
                      .map((s) => s.lawyer_full_name)
                      .join(", ")
                  }}
                </span>
                <span v-else>N/A</span>
              </td>
              <td class="px-4 py-3 text-gray-900">
                <span v-if="row.staff_notification?.length">
                  {{
                    row.staff_notification
                      .map((n) => n.lawyer_full_name)
                      .join(", ")
                  }}
                </span>
                <span v-else>N/A</span>
              </td>
            </tr>

            <!-- No Data -->
            <tr v-if="!loading && matters.length === 0">
              <td colspan="7" class="px-4 py-10 text-center text-gray-600">
                No matters found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Plus, Search } from "lucide-vue-next";
import Swal from "sweetalert2";
import api from "../../services/auth.js";

const tabs = ["All", "Open", "Pending", "Closed"];
const selectedTab = ref("All");
const query = ref("");
const loading = ref(false);
const matters = ref([]);

const fetchMatters = async () => {
  loading.value = true;
  try {
    const response = await api.get(
      `/api/firm_side/matter/dashboard/filter-matters-display?page=1&page_size=10`,
      {
        params: query.value ? { title: query.value } : {},
      }
    );

    if (response.data?.status && Array.isArray(response.data.data)) {
      matters.value = response.data.data;
    } else {
      matters.value = [];
      Swal.fire("Info", "No matters found.", "info");
    }
  } catch (error) {
    Swal.fire("Error", "Failed to fetch matters.", "error");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchMatters();
});

function onAddMatter() {
  Swal.fire("Info", "Add Matter functionality coming soon!", "info");
}
</script>
