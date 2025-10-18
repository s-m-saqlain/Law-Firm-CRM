<template>
  <div>
    <LoadingSpinner :is-loading="loading" />
    <h1 class="text-2xl font-bold text-zinc-800">Add Matter</h1>
    <div class="border-b border-zinc-200 my-3"></div>

    <main class="min-h-screen bg-zinc-50 text-zinc-900 rounded-lg">
      <section class="mx-auto w-full max-w-6xl px-4 py-2">
        <div class="mt-4 grid grid-cols-1 gap-5 md:grid-cols-[280px,1fr]">
          <aside
            class="relative rounded-xl bg-zinc-800 p-6 text-zinc-200 shadow"
          >
            {{ currentStepIndex + 1 }}/7
            <div
              aria-hidden="true"
              class="pointer-events-none absolute left-7 top-16 bottom-6 w-px bg-zinc-600"
            />
            <ul class="mt-6 space-y-6">
              <li
                v-for="(item, index) in steps"
                :key="item"
                class="relative pl-10"
              >
                <span
                  class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full"
                  :class="
                    index <= currentStepIndex
                      ? 'border-2 border-white bg-white'
                      : 'bg-zinc-500'
                  "
                />
                <span
                  :class="
                    index <= currentStepIndex ? 'text-white' : 'text-zinc-300'
                  "
                  >{{ item }}</span
                >
              </li>
            </ul>
          </aside>

          <section
            class="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <div v-if="currentStep === 'Matter Details'">
              <h2 class="mb-4 text-lg font-semibold text-zinc-800">
                Matter Details
              </h2>
              <form
                @submit.prevent="submitMatter"
                class="grid grid-cols-1 gap-5"
              >
                <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div class="relative">
                    <label class="mb-1 block text-sm text-zinc-600"
                      >Client *</label
                    >
                    <div
                      @click="toggleClientDropdown"
                      class="flex items-center justify-between h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800 cursor-pointer"
                      :class="{ 'border-red-500': errors.contact }"
                    >
                      <span>{{
                        selectedClient?.fullName || "Select client"
                      }}</span>
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
                    <span
                      v-if="errors.contact"
                      class="text-red-500 text-xs mt-1"
                      >{{ errors.contact }}</span
                    >
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
                            {{ client.fullName.charAt(0).toUpperCase() }}
                          </div>
                          <div>
                            <div class="text-sm font-medium text-zinc-800">
                              {{ client.fullName }}
                              <span class="text-zinc-500 text-xs"
                                >({{ client.type }})</span
                              >
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
                      >Practicing Area *</label
                    >
                    <div
                      @click="toggleAreaDropdown"
                      class="flex items-center justify-between h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800 cursor-pointer"
                      :class="{ 'border-red-500': errors.practicing_area }"
                    >
                      <span>{{ selectedArea?.title || "Select area" }}</span>
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
                    <span
                      v-if="errors.practicing_area"
                      class="text-red-500 text-xs mt-1"
                      >{{ errors.practicing_area }}</span
                    >
                    <div
                      v-if="areaOpen"
                      class="absolute z-10 mt-1 w-full rounded-md border border-zinc-200 bg-white shadow-lg"
                    >
                      <ul class="max-h-56 overflow-y-auto">
                        <li
                          v-for="area in areas"
                          :key="area.id"
                          @click="selectArea(area)"
                          class="p-2 text-sm cursor-pointer hover:bg-zinc-100 text-zinc-800"
                        >
                          {{ area.title }}
                        </li>
                      </ul>
                      <div
                        @click="openNewMatterTypeModal"
                        class="flex items-center justify-center border-t border-zinc-200 p-2 text-sm text-zinc-700 cursor-pointer hover:bg-zinc-100"
                      >
                        + New Matter Type
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="mb-1 block text-sm text-zinc-600"
                    >Case Title *</label
                  >
                  <input
                    v-model="form.title"
                    type="text"
                    placeholder="Enter case title"
                    class="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm placeholder-zinc-400 outline-none focus:border-zinc-400"
                    :class="{ 'border-red-500': errors.title }"
                    @input="validateField('title')"
                  />
                  <span v-if="errors.title" class="text-red-500 text-xs mt-1">{{
                    errors.title
                  }}</span>
                </div>

                <div>
                  <label class="mb-1 block text-sm text-zinc-600"
                    >Summary *</label
                  >
                  <textarea
                    v-model="form.summary"
                    rows="4"
                    placeholder="Case summary"
                    class="w-full rounded-md border border-zinc-300 bg-white p-3 text-sm placeholder-zinc-400 outline-none focus:border-zinc-400"
                    :class="{ 'border-red-500': errors.summary }"
                    @input="validateField('summary')"
                  />
                  <span
                    v-if="errors.summary"
                    class="text-red-500 text-xs mt-1"
                    >{{ errors.summary }}</span
                  >
                </div>

                <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label class="mb-1 block text-sm text-zinc-600"
                      >Trial Count *</label
                    >
                    <input
                      v-model.number="form.trialCount"
                      type="number"
                      class="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-400"
                      :class="{ 'border-red-500': errors.trialCount }"
                      @input="validateField('trialCount')"
                    />
                    <span
                      v-if="errors.trialCount"
                      class="text-red-500 text-xs mt-1"
                      >{{ errors.trialCount }}</span
                    >
                  </div>
                  <div>
                    <label class="mb-1 block text-sm text-zinc-600"
                      >Stage *</label
                    >
                    <input
                      v-model="form.stage"
                      type="text"
                      placeholder="e.g., In Court"
                      class="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm placeholder-zinc-400 outline-none focus:border-zinc-400"
                      :class="{ 'border-red-500': errors.stage }"
                      @input="validateField('stage')"
                    />
                    <span
                      v-if="errors.stage"
                      class="text-red-500 text-xs mt-1"
                      >{{ errors.stage }}</span
                    >
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label class="mb-1 block text-sm text-zinc-600"
                      >Priority *</label
                    >
                    <select
                      v-model="form.priority"
                      class="block h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800 outline-none focus:border-zinc-400"
                      :class="{ 'border-red-500': errors.priority }"
                      @change="validateField('priority')"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                    <span
                      v-if="errors.priority"
                      class="text-red-500 text-xs mt-1"
                      >{{ errors.priority }}</span
                    >
                  </div>
                  <div>
                    <label class="mb-1 block text-sm text-zinc-600"
                      >Start Date *</label
                    >
                    <input
                      v-model="form.startDate"
                      type="date"
                      placeholder="mm/dd/yyyy"
                      class="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm placeholder-zinc-400 outline-none focus:border-zinc-400"
                      :class="{ 'border-red-500': errors.startDate }"
                      @input="validateField('startDate')"
                    />
                    <span
                      v-if="errors.startDate"
                      class="text-red-500 text-xs mt-1"
                      >{{ errors.startDate }}</span
                    >
                  </div>
                </div>

                <div class="mt-1 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    class="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-zinc-800"
                  >
                    {{ matterId ? "Save & Update" : "Save & Next" }}
                  </button>
                </div>
              </form>
            </div>

            <AssignLawyer
              v-if="currentStep === 'Assign Lawyer'"
              :matter-id="matterId"
              @go-back="goBack"
              @save-and-next="goToAssignLawyerNext"
            />
            <MatterNotification
              v-if="currentStep === 'Matter Notification'"
              :matter-id="matterId"
              @go-back="goBackFromNotification"
              @save-and-next="goToRelatedContacts"
            />
            <RelatedContacts
              v-if="currentStep === 'Related Contacts'"
              :matter-id="matterId"
              @go-back="goBackFromRelatedContacts"
              @save-and-next="goToBillingPreference"
              @open-new-contact="openNewContactModal"
              ref="relatedContacts"
            />
            <BillingPreference
              v-if="currentStep === 'Billing Preference'"
              :matter-id="matterId"
              @go-back="goBackFromBillingPreference"
              @save-and-next="goToTaskLists"
            />
            <TaskLists
              v-if="currentStep === 'Task Lists'"
              :matter-id="matterId"
              @go-back="goBackFromTaskLists"
              @save-and-next="goToDocumentFolders"
            />
            <DocumentFolders
              v-if="currentStep === 'Document Folders'"
              :matter-id="matterId"
              @go-back="goBackFromDocumentFolders"
              @save-and-next="goToComplete"
            />
          </section>
        </div>
      </section>

      <NewContactModal
        :is-open="isNewContactModalOpen"
        @close="closeNewContactModal"
        @contact-added="handleContactAdded"
      />
      <NewMatterTypeModal
        :is-open="isNewMatterTypeModalOpen"
        @close="closeNewMatterTypeModal"
        @matter-type-added="handleMatterTypeAdded"
      />
    </main>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2";
import api from "../../services/auth.js";
import NewContactModal from "../../components/Modal/Firm/Matters/NewContact/NewContactModal.vue";
import NewMatterTypeModal from "../../components/Modal/Firm/Matters/NewMatterType/NewMatterTypeModal.vue";
import MatterNotification from "../../components/Modal/Firm/Matters/MatterNotification.vue";
import RelatedContacts from "../../components/Modal/Firm/Matters/RelatedContacts.vue";
import AssignLawyer from "../../components/Modal/Firm/Matters/AssignLawyer.vue";
import BillingPreference from "../../components/Modal/Firm/Matters/BillingPreference.vue";
import TaskLists from "../../components/Modal/Firm/Matters/TaskLists.vue";
import DocumentFolders from "../../components/Modal/Firm/Matters/DocumentFolders.vue";
import LoadingSpinner from "../../components/LoadingSpinner.vue";

const router = useRouter();
const route = useRoute();

const loading = ref(false);

const steps = [
  "Matter Details",
  "Assign Lawyer",
  "Matter Notification",
  "Related Contacts",
  "Billing Preference",
  "Task Lists",
  "Document Folders",
];

const currentStep = ref("Matter Details");
const currentStepIndex = computed(() => steps.indexOf(currentStep.value));
const matterId = ref(null);

const form = reactive({
  contact_id: null,
  practicing_area_id: null,
  title: "",
  summary: "",
  trialCount: null,
  stage: "",
  priority: "Low",
  startDate: "",
});

const errors = reactive({
  contact: "",
  practicing_area: "",
  title: "",
  summary: "",
  trialCount: "",
  stage: "",
  priority: "",
  startDate: "",
});

const clientOpen = ref(false);
const clientSearch = ref("");
const selectedClient = ref(null);
const clients = ref([]);
const isNewContactModalOpen = ref(false);
const isNewMatterTypeModalOpen = ref(false);

const areaOpen = ref(false);
const selectedArea = ref(null);
const areas = ref([]);

const fetchClients = async (query = "") => {
  loading.value = true;
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
        first_name: client.first_name,
        last_name: client.last_name,
        fullName: `${client.first_name} ${client.last_name}`.trim(),
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
      clients.value = [];
    }
  } catch (error) {
    Swal.fire({
      title: "Error Fetching Clients",
      text: error.message || "Network error occurred.",
      icon: "error",
      confirmButtonColor: "#18181b",
    });
    clients.value = [];
  } finally {
    loading.value = false;
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

const fetchPracticingAreas = async () => {
  loading.value = true;
  try {
    const response = await api.get(
      "/api/firm_side/matter/dashboard/get_practicing_area/"
    );
    if (response.data.status) {
      areas.value = response.data.data;
    } else {
      Swal.fire({
        title: "Failed to Fetch Practicing Areas",
        text: response.data.message || "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#18181b",
      });
    }
  } catch (error) {
    Swal.fire({
      title: "Error Fetching Practicing Areas",
      text: error.message || "Network error occurred.",
      icon: "error",
      confirmButtonColor: "#18181b",
    });
  } finally {
    loading.value = false;
  }
};

const fetchMatterDetails = async (id) => {
  loading.value = true;
  try {
    const response = await api.get(
      `/api/firm_side/matter/creation/retrieve-matter-info/?matter_id=${id}`
    );
    if (response.data.status) {
      const data = response.data.data;
      form.contact_id = data.contact;
      form.practicing_area_id = data.practicing_area;
      form.title = data.title;
      form.summary = data.case_summary;
      form.trialCount = parseInt(data.trial_count);
      form.stage = data.stage;
      form.priority =
        data.priority_name.charAt(0).toUpperCase() +
        data.priority_name.slice(1).toLowerCase();
      form.startDate = data.started_at.split("T")[0];
      selectedClient.value = {
        id: data.contact_info.id,
        first_name: data.contact_info.first_name,
        last_name: data.contact_info.last_name,
        fullName:
          `${data.contact_info.first_name} ${data.contact_info.last_name}`.trim(),
        type: data.contact_info.get_role_display,
        email: data.contact_info.email,
        phone_number: data.contact_info.phone_number,
        color: getRandomColor(),
      };
      selectedArea.value = {
        id: data.practiceing_area_info.id,
        title: data.practiceing_area_info.title,
      };
    } else {
      Swal.fire({
        title: "Failed to Fetch Matter Details",
        text: response.data.message || "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#18181b",
      });
    }
  } catch (error) {
    Swal.fire({
      title: "Error Fetching Matter Details",
      text: error.message || "Network error occurred.",
      icon: "error",
      confirmButtonColor: "#18181b",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchClients();
  await fetchPracticingAreas();
  if (route.query.matterId) {
    matterId.value = route.query.matterId;
    await fetchMatterDetails(matterId.value);
    currentStep.value = "Matter Details";
  }
});

const toggleClientDropdown = () => {
  clientOpen.value = !clientOpen.value;
  if (clientOpen.value) {
    clientSearch.value = "";
    fetchClients();
  }
};

const searchClients = () => {
  fetchClients(clientSearch.value);
};

const filteredClients = computed(() => {
  if (!clientSearch.value) return clients.value;
  return clients.value.filter(
    (client) =>
      client.fullName
        .toLowerCase()
        .includes(clientSearch.value.toLowerCase()) ||
      client.email.toLowerCase().includes(clientSearch.value.toLowerCase())
  );
});

const selectClient = (client) => {
  selectedClient.value = {
    id: client.id,
    first_name: client.first_name,
    last_name: client.last_name,
    fullName: client.fullName,
    type: client.type,
    email: client.email,
    phone_number: client.phone_number,
    color: client.color,
  };
  form.contact_id = client.id;
  clientOpen.value = false;
  validateField("contact");
};

const openNewContactModal = () => {
  clientOpen.value = false;
  isNewContactModalOpen.value = true;
};

const closeNewContactModal = () => {
  isNewContactModalOpen.value = false;
};

const relatedContacts = ref(null);

const handleContactAdded = (newContact) => {
  const formattedContact = {
    id: newContact.id,
    first_name: newContact.first_name,
    last_name: newContact.last_name,
    fullName: `${newContact.first_name} ${newContact.last_name}`.trim(),
    type: newContact.type,
    email: newContact.email,
    phone_number: newContact.phone_number,
    color: getRandomColor(),
  };

  clients.value.push(formattedContact);
  if (currentStep.value === "Related Contacts" && relatedContacts.value) {
    relatedContacts.value.handleContactAdded(formattedContact);
  }
  isNewContactModalOpen.value = false;
};

const toggleAreaDropdown = () => {
  areaOpen.value = !areaOpen.value;
};

const selectArea = (area) => {
  selectedArea.value = area;
  form.practicing_area_id = area.id;
  areaOpen.value = false;
  validateField("practicing_area");
};

const openNewMatterTypeModal = () => {
  areaOpen.value = false;
  isNewMatterTypeModalOpen.value = true;
};

const closeNewMatterTypeModal = () => {
  isNewMatterTypeModalOpen.value = false;
};

const handleMatterTypeAdded = (newMatterType) => {
  areas.value.push(newMatterType);
  selectArea(newMatterType);
  isNewMatterTypeModalOpen.value = false;
};

const validateField = (field) => {
  switch (field) {
    case "contact":
      errors.contact = form.contact_id ? "" : "Client is required";
      break;
    case "practicing_area":
      errors.practicing_area = form.practicing_area_id
        ? ""
        : "Practicing area is required";
      break;
    case "title":
      errors.title = form.title ? "" : "Case title is required";
      break;
    case "summary":
      errors.summary = form.summary ? "" : "Summary is required";
      break;
    case "trialCount":
      errors.trialCount =
        form.trialCount !== null && form.trialCount >= 0
          ? ""
          : "Trial count is required and must be a non-negative number";
      break;
    case "stage":
      errors.stage = form.stage ? "" : "Stage is required";
      break;
    case "priority":
      errors.priority = form.priority ? "" : "Priority is required";
      break;
    case "startDate":
      errors.startDate = form.startDate ? "" : "Start date is required";
      break;
  }
};

const validateForm = () => {
  validateField("contact");
  validateField("practicing_area");
  validateField("title");
  validateField("summary");
  validateField("trialCount");
  validateField("stage");
  validateField("priority");
  validateField("startDate");
  return Object.values(errors).every((error) => error === "");
};

const submitMatter = async () => {
  if (!validateForm()) {
    return;
  }
  loading.value = true;

  try {
    const payload = {
      practicing_area: form.practicing_area_id,
      contact: form.contact_id,
      title: form.title,
      case_summary: form.summary,
      trial_count: form.trialCount,
      stage: form.stage,
      priority: form.priority.toUpperCase(),
      started_at: form.startDate,
    };

    if (matterId.value) {
      payload.matter_id = matterId.value;
    }

    let response;

    if (matterId.value) {
      response = await api.patch(
        `/api/firm_side/matter/creation/update-matter-info/?matter_id=${matterId.value}`,
        payload
      );
    } else {
      response = await api.post(
        "/api/firm_side/matter/creation/create-matter-info/",
        payload
      );
    }

    if (response.data.status) {
      Swal.fire({
        text: "Matter details saved successfully!",
        icon: "success",
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "white",
        color: "black",
      });
      if (!matterId.value) {
        matterId.value = response.data.data.id;
      }
      router.push({
        path: "/firm/add-matter",
        query: { matterId: matterId.value },
      });
      currentStep.value = "Assign Lawyer";
    } else {
      Swal.fire({
        title: "Failed to Save Matter",
        text: response.data.message || "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#18181b",
      });
    }
  } catch (error) {
    Swal.fire({
      title: "Error",
      text:
        error.response?.data?.message ||
        error.message ||
        "Network error occurred.",
      icon: "error",
      confirmButtonColor: "#18181b",
    });
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  if (currentStep.value === "Assign Lawyer") {
    currentStep.value = "Matter Details";
    router.push({
      path: "/firm/add-matter",
      query: { matterId: matterId.value },
    });
    if (matterId.value) {
      fetchMatterDetails(matterId.value);
    }
  }
};

const goToRelatedContacts = () => {
  currentStep.value = "Related Contacts";
  router.push({
    path: "/firm/add-matter",
    query: { matterId: matterId.value },
  });
};

const goBackFromNotification = () => {
  if (currentStep.value === "Matter Notification") {
    currentStep.value = "Assign Lawyer";
    router.push({
      path: "/firm/add-matter",
      query: { matterId: matterId.value },
    });
    if (matterId.value) {
      fetchMatterDetails(matterId.value);
    }
  }
};

const goBackFromRelatedContacts = () => {
  currentStep.value = "Matter Notification";
  router.push({
    path: "/firm/add-matter",
    query: { matterId: matterId.value },
  });
};

const goBackFromBillingPreference = () => {
  currentStep.value = "Related Contacts";
  router.push({
    path: "/firm/add-matter",
    query: { matterId: matterId.value },
  });
};

const goToAssignLawyerNext = () => {
  currentStep.value = "Matter Notification";
  router.push({
    path: "/firm/add-matter",
    query: { matterId: matterId.value },
  });
  if (matterId.value) {
    fetchMatterDetails(matterId.value);
  }
};

const goToBillingPreference = () => {
  currentStep.value = "Billing Preference";
  router.push({
    path: "/firm/add-matter",
    query: { matterId: matterId.value },
  });
};

const goToTaskLists = () => {
  currentStep.value = "Task Lists";
  router.push({
    path: "/firm/add-matter",
    query: { matterId: matterId.value },
  });
};

const goBackFromTaskLists = () => {
  currentStep.value = "Billing Preference";
  router.push({
    path: "/firm/add-matter",
    query: { matterId: matterId.value },
  });
};

const goToDocumentFolders = () => {
  currentStep.value = "Document Folders";
  router.push({
    path: "/firm/add-matter",
    query: { matterId: matterId.value },
  });
};

const goBackFromDocumentFolders = () => {
  currentStep.value = "Task Lists";
  router.push({
    path: "/firm/add-matter",
    query: { matterId: matterId.value },
  });
};

const goToComplete = () => {
  Swal.fire({
    text: "Matter creation completed successfully!",
    icon: "success",
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: "white",
    color: "black",
  });
  router.push({
    path: "/firm/matters",
  });
};
</script>
