<template>
  <div>
    <LoadingSpinner :is-loading="loading" />
    <h2 class="mb-4 text-lg font-bold text-zinc-800">Matter Notification</h2>
    <div class="grid grid-cols-1 gap-5">
      <p
        class="text-sm text-[#1C5DBD] font-normal border border-[#8EC5FF] rounded-lg bg-[#EFF6FF] py-3 px-4"
      >
        Firm users that you select will receive notifications when the status of
        this matter changes or the matter is deleted. They will also be notified
        when documents are uploaded by clients and related contacts.
      </p>
      <h2 class="mb-4 text-md font-semibold text-zinc-800">
        Firm users (access)
      </h2>

      <div class="relative">
        <label class="mb-1 block text-sm text-zinc-600"
          >Select Firm Users *</label
        >
        <div
          @click="toggleDropdown"
          class="flex flex-wrap items-center gap-2 h-auto min-h-11 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 cursor-pointer"
          :class="{ 'border-red-500': errors.firmUsers }"
        >
          <template v-if="selectedLawyers.length > 0">
            <div
              v-for="lawyer in selectedLawyers"
              :key="lawyer.lawyer_id"
              class="flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-sm text-zinc-800"
            >
              <span>{{ lawyer.full_name }}</span>
              <svg
                @click.stop="removeLawyer(lawyer)"
                class="h-4 w-4 text-red-500 cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </template>
          <span v-else>Select firm users</span>
          <svg
            class="h-4 w-4 text-zinc-600 ml-auto"
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
        <span v-if="errors.firmUsers" class="text-red-500 text-xs mt-1">{{
          errors.firmUsers
        }}</span>
        <div
          v-if="dropdownOpen"
          class="absolute z-10 mt-1 w-full rounded-md border border-zinc-200 bg-white shadow-lg"
        >
          <div class="p-2 border-b border-zinc-200">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search users..."
              class="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm outline-none focus:border-zinc-400"
              @input="searchLawyers"
            />
          </div>
          <ul class="max-h-56 overflow-y-auto">
            <li
              v-for="lawyer in filteredLawyers"
              :key="lawyer.lawyer_id"
              @click="toggleLawyerSelection(lawyer)"
              class="flex items-center justify-between p-2 text-sm cursor-pointer hover:bg-zinc-100 text-zinc-800"
              :class="{ 'bg-blue-100': isSelected(lawyer) }"
            >
              <span>{{ lawyer.full_name || "Unnamed Lawyer" }}</span>
              <svg
                v-if="isSelected(lawyer)"
                @click.stop="removeLawyer(lawyer)"
                class="h-4 w-4 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </li>
            <li
              v-if="filteredLawyers.length === 0"
              class="p-3 text-sm text-center text-zinc-500"
            >
              No result found
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-1 flex items-center justify-end gap-3">
        <button
          type="button"
          @click="$emit('go-back')"
          class="rounded-md bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-300"
        >
          Back
        </button>
        <button
          type="button"
          @click="submitFirmUsers"
          class="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-zinc-800"
        >
          Save & Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import api from "../../../../services/auth";
import LoadingSpinner from "../../../../components/LoadingSpinner.vue";

const props = defineProps({
  matterId: {
    type: [Number, String],
    required: true,
  },
});

const emit = defineEmits(["go-back", "save-and-next"]);
const loading = ref(false);

const dropdownOpen = ref(false);
const searchQuery = ref("");
const lawyers = ref([]);
const selectedLawyers = ref([]);
const errors = ref({ firmUsers: "" });

const fetchLawyers = async () => {
  loading.value = true;
  try {
    const response = await api.get(
      "/api/firm_side/lawyer_manage/get_my_lawyers/"
    );
    if (response.data.status) {
      lawyers.value = response.data.data.map((lawyer) => ({
        id: lawyer.id,
        lawyer_id: lawyer.lawyer_id,
        full_name: lawyer.full_name,
        first_name: lawyer.first_name,
        last_name: lawyer.last_name,
        email: lawyer.email,
        mobile_number: lawyer.mobile_number,
        role_name: lawyer.role_name || "Unknown Role",
      }));
    } else {
      Swal.fire({
        text: response.data.message || "Something went wrong.",
        icon: "error",
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "white",
        color: "black",
      });
    }
  } catch (error) {
    Swal.fire({
      text: error.message || "Network error occurred.",
      icon: "error",
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "white",
      color: "black",
    });
  } finally {
    loading.value = false;
  }
};

const fetchAssignedLawyerAccess = async () => {
  loading.value = true;
  try {
    const response = await api.get(
      `/api/firm_side/matter/creation/retrieve-lawyer-access/?matter_id=${props.matterId}`
    );
    if (response.data.status) {
      const allLawyers =
        lawyers.value.length > 0
          ? lawyers.value
          : (await fetchLawyers(), lawyers.value);
      selectedLawyers.value = response.data.data
        .filter((lawyer) => lawyer.receive_notifications)
        .map((accessLawyer) => {
          const matchedLawyer = allLawyers.find(
            (l) => l.lawyer_id === accessLawyer.lawyer
          );
          return {
            id: accessLawyer.lawyer_info.id,
            lawyer_id: accessLawyer.lawyer_info.lawyer_id,
            full_name: matchedLawyer
              ? `${matchedLawyer.first_name} ${matchedLawyer.last_name}`
              : accessLawyer.lawyer_info.full_name,
            email: accessLawyer.lawyer_info.email,
            mobile_number: accessLawyer.lawyer_info.mobile_number,
            role_name: accessLawyer.lawyer_info.role_name || "Unknown Role",
          };
        });
    } else {
      Swal.fire({
        text: response.data.message || "Something went wrong.",
        icon: "error",
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "white",
        color: "black",
      });
    }
  } catch (error) {
    Swal.fire({
      text: error.message || "Network error occurred.",
      icon: "error",
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "white",
      color: "black",
    });
  } finally {
    loading.value = false;
  }
};

const searchLawyers = () => {};

const filteredLawyers = computed(() => {
  if (!searchQuery.value) return lawyers.value;
  return lawyers.value.filter((lawyer) =>
    lawyer.full_name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const isSelected = (lawyer) => {
  return selectedLawyers.value.some(
    (selected) => selected.lawyer_id === lawyer.lawyer_id
  );
};

const toggleLawyerSelection = (lawyer) => {
  if (isSelected(lawyer)) {
    removeLawyer(lawyer);
  } else {
    selectedLawyers.value.push({
      id: lawyer.id,
      lawyer_id: lawyer.lawyer_id,
      full_name: `${lawyer.first_name} ${lawyer.last_name}`,
      email: lawyer.email,
      mobile_number: lawyer.mobile_number,
      role_name: lawyer.role_name || "Unknown Role",
    });
  }
  validateField();
};

const removeLawyer = (lawyer) => {
  selectedLawyers.value = selectedLawyers.value.filter(
    (selected) => selected.lawyer_id !== lawyer.lawyer_id
  );
  validateField();
};

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
  if (dropdownOpen.value) {
    searchQuery.value = "";
  }
};

const validateField = () => {
  errors.value.firmUsers =
    selectedLawyers.value.length > 0
      ? ""
      : "At least one firm user is required";
};

const submitFirmUsers = async () => {
  validateField();
  if (errors.value.firmUsers) {
    Swal.fire({
      text: errors.value.firmUsers,
      icon: "error",
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "white",
      color: "black",
    });
    return;
  }
  loading.value = true;
  try {
    const payload = {
      matter_id: props.matterId,
      access_list: selectedLawyers.value.map((lawyer) => ({
        lawyer: lawyer.lawyer_id,
        receive_notifications: true,
      })),
    };

    const response = await api.post(
      "/api/firm_side/matter/creation/set-lawyer-access/",
      payload
    );

    if (response.data.status) {
      Swal.fire({
        text: "Firm users assigned successfully!",
        icon: "success",
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "white",
        color: "black",
      });
      emit("save-and-next");
    } else {
      Swal.fire({
        text: response.data.message || "Something went wrong.",
        icon: "error",
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "white",
        color: "black",
      });
    }
  } catch (error) {
    Swal.fire({
      text:
        error.response?.data?.message ||
        error.message ||
        "Network error occurred.",
      icon: "error",
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "white",
      color: "black",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchLawyers();
  if (props.matterId) {
    await fetchAssignedLawyerAccess();
  }
});
</script>

<style scoped>
.flex.flex-wrap.items-center {
  min-height: 2.75rem;
  padding: 0.5rem;
  gap: 0.5rem;
}

.bg-blue-100 {
  display: flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
}

.ml-auto {
  margin-left: auto;
}
</style>
