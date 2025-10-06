<!-- pages/firm/AddMatter.vue -->
<template>
  <div>
    <h1 class="text-2xl font-bold text-zinc-800">Add Matter</h1>
    <div class="border-b border-zinc-200"></div>

    <main class="min-h-screen bg-zinc-50 text-zinc-900 rounded-lg mt-12">
      <section class="mx-auto w-full max-w-6xl px-4 py-2">
        <div class="mt-4 grid grid-cols-1 gap-5 md:grid-cols-[280px,1fr]">
          <aside
            class="relative rounded-xl bg-zinc-800 p-6 text-zinc-200 shadow"
          >
            1/7
            <div
              aria-hidden="true"
              class="pointer-events-none absolute left-7 top-16 bottom-6 w-px bg-zinc-600"
            />
            <ul class="mt-6 space-y-6">
              <li class="relative pl-10">
                <span
                  class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full border-2 border-white bg-white"
                />
                <span class="text-white">Matter Details</span>
              </li>
              <li v-for="item in otherSteps" :key="item" class="relative pl-10">
                <span
                  class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-zinc-500"
                />
                <span class="text-zinc-300">{{ item }}</span>
              </li>
            </ul>
          </aside>

          <section
            class="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <h2 class="mb-4 text-lg font-semibold text-zinc-800">
              Matter Details
            </h2>

            <form @submit.prevent class="grid grid-cols-1 gap-5">
              <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div class="relative">
                  <label class="mb-1 block text-sm text-zinc-600">Client</label>
                  <div
                    @click="toggleClientDropdown"
                    class="flex items-center justify-between h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800 cursor-pointer"
                  >
                    <span>{{ selectedClient?.name || "Select client" }}</span>
                    <svg
                      class="h-4 w-4 text-zinc-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  <div
                    v-if="clientOpen"
                    class="absolute z-10 mt-1 w-full rounded-md border border-zinc-200 bg-white shadow-lg"
                  >
                    <div class="p-2 border-b border-zinc-200">
                      <input
                        v-model="clientSearch"
                        type="text"
                        placeholder="Search client..."
                        class="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm outline-none focus:border-zinc-400"
                        @input="searchClients"
                      />
                    </div>

                    <ul class="max-h-56 overflow-y-auto">
                      <li
                        v-for="client in filteredClients"
                        :key="client.email"
                        @click="selectClient(client)"
                        class="flex items-center gap-3 p-2 cursor-pointer hover:bg-zinc-100"
                      >
                        <div
                          class="flex h-8 w-8 items-center justify-center rounded-full text-white font-medium"
                          :class="client.color"
                        >
                          {{ client.name.charAt(0).toUpperCase() }}
                        </div>
                        <div>
                          <div class="text-sm font-medium text-zinc-800">
                            {{ client.name }}
                            <span class="text-zinc-500 text-xs">
                              ({{ client.type }})
                            </span>
                          </div>
                          <div class="text-xs text-zinc-500">
                            {{ client.email }}
                          </div>
                        </div>
                      </li>
                      <li
                        v-if="filteredClients.length === 0"
                        class="p-3 text-sm text-center text-zinc-500"
                      >
                        No result found
                      </li>
                    </ul>

                    <div
                      @click="openNewContactModal"
                      class="flex items-center justify-center border-t border-zinc-200 p-2 text-sm text-zinc-700 cursor-pointer hover:bg-zinc-100"
                    >
                      + New Contact
                    </div>
                  </div>
                </div>

                <div class="relative">
                  <label class="mb-1 block text-sm text-zinc-600"
                    >Practicing Area</label
                  >
                  <div
                    @click="toggleAreaDropdown"
                    class="flex items-center justify-between h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800 cursor-pointer"
                  >
                    <span>{{ selectedArea || "Select area" }}</span>
                    <svg
                      class="h-4 w-4 text-zinc-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  <div
                    v-if="areaOpen"
                    class="absolute z-10 mt-1 w-full rounded-md border border-zinc-200 bg-white shadow-lg"
                  >
                    <ul class="max-h-56 overflow-y-auto">
                      <li
                        v-for="area in areas"
                        :key="area"
                        @click="selectArea(area)"
                        class="p-2 text-sm cursor-pointer hover:bg-zinc-100 text-zinc-800"
                      >
                        {{ area }}
                      </li>
                    </ul>
                    <div
                      @click="addNewArea"
                      class="flex items-center justify-center border-t border-zinc-200 p-2 text-sm text-zinc-700 cursor-pointer hover:bg-zinc-100"
                    >
                      + New Matter Type
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label class="mb-1 block text-sm text-zinc-600"
                  >Case Title</label
                >
                <input
                  v-model="form.title"
                  type="text"
                  placeholder="Enter case title"
                  class="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm placeholder-zinc-400 outline-none focus:border-zinc-400"
                />
              </div>

              <div>
                <label class="mb-1 block text-sm text-zinc-600">Summary</label>
                <textarea
                  v-model="form.summary"
                  rows="4"
                  placeholder="Case summary"
                  class="w-full rounded-md border border-zinc-300 bg-white p-3 text-sm placeholder-zinc-400 outline-none focus:border-zinc-400"
                />
              </div>

              <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label class="mb-1 block text-sm text-zinc-600"
                    >Trial Count</label
                  >
                  <input
                    v-model.number="form.trialCount"
                    type="number"
                    class="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-400"
                  />
                </div>
                <div>
                  <label class="mb-1 block text-sm text-zinc-600">Stage</label>
                  <input
                    v-model="form.stage"
                    type="text"
                    placeholder="e.g., In Court"
                    class="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm placeholder-zinc-400 outline-none focus:border-zinc-400"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label class="mb-1 block text-sm text-zinc-600"
                    >Priority</label
                  >
                  <select
                    v-model="form.priority"
                    class="block h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800 outline-none focus:border-zinc-400"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div>
                  <label class="mb-1 block text-sm text-zinc-600"
                    >Start Date</label
                  >
                  <input
                    v-model="form.startDate"
                    type="date"
                    placeholder="mm/dd/yyyy"
                    class="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm placeholder-zinc-400 outline-none focus:border-zinc-400"
                  />
                </div>
              </div>

              <div class="mt-1 flex items-center justify-end">
                <button
                  type="button"
                  class="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-zinc-800"
                >
                  Save &amp; Next
                </button>
              </div>
            </form>
          </section>
        </div>
      </section>

      <NewContactModal
        :is-open="isNewContactModalOpen"
        @close="closeNewContactModal"
        @contact-added="handleContactAdded"
      />
    </main>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import api from "../../services/auth.js";
import NewContactModal from "../../components/Modal/Firm/Matters/NewContact/NewContactModal.vue";

const otherSteps = [
  "Assign Lawyer",
  "Matter Notification",
  "Related Contacts",
  "Billing Preference",
  "Task Lists",
  "Document Folders",
];

const form = reactive({
  client: "",
  area: "",
  title: "",
  summary: "",
  trialCount: "",
  stage: "",
  priority: "Low",
  startDate: "",
});

const clientOpen = ref(false);
const clientSearch = ref("");
const selectedClient = ref(null);
const clients = ref([]);
const isNewContactModalOpen = ref(false);

const fetchClients = async (query = "") => {
  try {
    const url = query
      ? `/api/firm_side/contact-manage/search-contact/?query=${encodeURIComponent(
          query
        )}`
      : "/api/firm_side/contact-manage/search-contact/";
    const response = await api.get(url);
    if (response.data.status) {
      clients.value = response.data.data.map((client) => ({
        id: client.id,
        name: `${client.first_name} ${client.last_name}`.trim(),
        type: client.get_role_display,
        email: client.email,
        phone_number: client.phone_number,
        color: getRandomColor(),
      }));
    } else {
      Swal.fire({
        title: "Failed to Fetch Clients",
        text: response.data.message || "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#18181b",
      });
    }
  } catch (error) {
    Swal.fire({
      title: "Error Fetching Clients",
      text: error.message || "Network error occurred.",
      icon: "error",
      confirmButtonColor: "#18181b",
    });
  }
};

const getRandomColor = () => {
  const colors = [
    "bg-orange-500",
    "bg-neutral-800",
    "bg-amber-500",
    "bg-blue-500",
    "bg-green-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const searchClients = () => {
  fetchClients(clientSearch.value);
};

onMounted(() => {
  fetchClients();
});

const toggleClientDropdown = () => {
  clientOpen.value = !clientOpen.value;
  if (clientOpen.value) {
    clientSearch.value = "";
    fetchClients();
  }
};

const filteredClients = computed(() => {
  return clients.value;
});

const selectClient = (client) => {
  selectedClient.value = client;
  form.client = client.name;
  clientOpen.value = false;
};

const openNewContactModal = () => {
  clientOpen.value = false;
  isNewContactModalOpen.value = true;
};

const closeNewContactModal = () => {
  isNewContactModalOpen.value = false;
};

const handleContactAdded = (newContact) => {
  clients.value.push({
    ...newContact,
    color: getRandomColor(),
  });
  selectClient(newContact);
  isNewContactModalOpen.value = false;
};

const areaOpen = ref(false);
const selectedArea = ref("");
const areas = ref(["Area 1", "Area 2"]);

const toggleAreaDropdown = () => {
  areaOpen.value = !areaOpen.value;
};

const selectArea = (area) => {
  selectedArea.value = area;
  form.area = area;
  areaOpen.value = false;
};

const addNewArea = () => {
  areaOpen.value = false;
  Swal.fire({
    title: "Add New Matter Type",
    text: "Open new matter type form here.",
    icon: "info",
    confirmButtonText: "OK",
    confirmButtonColor: "#18181b",
  });
};
</script>