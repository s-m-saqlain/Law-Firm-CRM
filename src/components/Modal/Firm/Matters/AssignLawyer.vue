<template>
  <div>
    <h2 class="mb-4 text-lg font-semibold text-zinc-800">Assign Lawyer</h2>
    <form @submit.prevent="submitAssignLawyer" class="grid grid-cols-1 gap-5">
      <div class="relative">
        <label class="mb-1 block text-sm text-zinc-600"
          >Responsible Solicitor *</label
        >
        <div
          @click="toggleDropdown('responsibleSolicitor')"
          class="flex items-center justify-between h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800 cursor-pointer"
          :class="{ 'border-red-500': errors.responsibleSolicitor }"
        >
          <span>{{
            selectedResponsibleSolicitor?.full_name ||
            "Select responsible solicitor"
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
          v-if="errors.responsibleSolicitor"
          class="text-red-500 text-xs mt-1"
          >{{ errors.responsibleSolicitor }}</span
        >
        <div
          v-if="dropdownOpen.responsibleSolicitor"
          class="absolute z-10 mt-1 w-full rounded-md border border-zinc-200 bg-white shadow-lg"
        >
          <ul class="max-h-56 overflow-y-auto">
            <li
              v-for="lawyer in filteredLawyers"
              :key="lawyer.id"
              @click="selectLawyer(lawyer, 'responsibleSolicitor')"
              class="p-2 text-sm cursor-pointer hover:bg-zinc-100 text-zinc-800"
              :class="{
                'bg-blue-100': isSelected(lawyer, 'responsibleSolicitor'),
              }"
            >
              {{ lawyer.full_name || "Unnamed Lawyer" }}
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

      <div class="relative">
        <label class="mb-1 block text-sm text-zinc-600"
          >Responsible Staff</label
        >
        <div
          @click="toggleDropdown('responsibleStaff')"
          class="flex items-center justify-between h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800 cursor-pointer"
        >
          <span>{{
            selectedResponsibleStaff?.full_name || "Select responsible staff"
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
        <div
          v-if="dropdownOpen.responsibleStaff"
          class="absolute z-10 mt-1 w-full rounded-md border border-zinc-200 bg-white shadow-lg"
        >
          <ul class="max-h-56 overflow-y-auto">
            <li
              v-for="lawyer in filteredLawyers"
              :key="lawyer.id"
              @click="selectLawyer(lawyer, 'responsibleStaff')"
              class="p-2 text-sm cursor-pointer hover:bg-zinc-100 text-zinc-800"
              :class="{
                'bg-blue-100': isSelected(lawyer, 'responsibleStaff'),
              }"
            >
              {{ lawyer.full_name || "Unnamed Lawyer" }}
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

      <div class="relative">
        <label class="mb-1 block text-sm text-zinc-600"
          >Originating Solicitor</label
        >
        <div
          @click="toggleDropdown('originatingSolicitor')"
          class="flex items-center justify-between h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800 cursor-pointer"
        >
          <span>{{
            selectedOriginatingSolicitor?.full_name ||
            "Select originating solicitor"
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
        <div
          v-if="dropdownOpen.originatingSolicitor"
          class="absolute z-10 mt-1 w-full rounded-md border border-zinc-200 bg-white shadow-lg"
        >
          <ul class="max-h-56 overflow-y-auto">
            <li
              v-for="lawyer in filteredLawyers"
              :key="lawyer.id"
              @click="selectLawyer(lawyer, 'originatingSolicitor')"
              class="p-2 text-sm cursor-pointer hover:bg-zinc-100 text-zinc-800"
              :class="{
                'bg-blue-100': isSelected(lawyer, 'originatingSolicitor'),
              }"
            >
              {{ lawyer.full_name || "Unnamed Lawyer" }}
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
          type="submit"
          class="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-zinc-800"
        >
          Save & Next
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import api from "../../../../services/auth";

const props = defineProps({
  matterId: {
    type: [Number, String],
    required: true,
  },
});

const emit = defineEmits(["go-back", "save-and-next"]);

const form = reactive({
  responsibleSolicitor_id: null,
  responsibleStaff_id: null,
  originatingSolicitor_id: null,
});

const errors = reactive({
  responsibleSolicitor: "",
});

const dropdownOpen = reactive({
  responsibleSolicitor: false,
  responsibleStaff: false,
  originatingSolicitor: false,
});

const selectedResponsibleSolicitor = ref(null);
const selectedResponsibleStaff = ref(null);
const selectedOriginatingSolicitor = ref(null);
const lawyers = ref([]);

const filteredLawyers = computed(() => lawyers.value);

const toggleDropdown = (type) => {
  const newDropdownOpen = {
    responsibleSolicitor: false,
    responsibleStaff: false,
    originatingSolicitor: false,
    [type]: !dropdownOpen[type],
  };
  Object.assign(dropdownOpen, newDropdownOpen);
};

const selectLawyer = (lawyer, type) => {
  if (type === "responsibleSolicitor") {
    selectedResponsibleSolicitor.value = lawyer;
    form.responsibleSolicitor_id = lawyer.lawyer_id;
  } else if (type === "responsibleStaff") {
    selectedResponsibleStaff.value = lawyer;
    form.responsibleStaff_id = lawyer.lawyer_id;
  } else if (type === "originatingSolicitor") {
    selectedOriginatingSolicitor.value = lawyer;
    form.originatingSolicitor_id = lawyer.lawyer_id;
  }
  const newDropdownOpen = {
    responsibleSolicitor: false,
    responsibleStaff: false,
    originatingSolicitor: false,
  };
  Object.assign(dropdownOpen, newDropdownOpen);
  validateField(type);
};

const isSelected = (lawyer, type) => {
  if (type === "responsibleSolicitor" && selectedResponsibleSolicitor.value) {
    return lawyer.lawyer_id === selectedResponsibleSolicitor.value.lawyer_id;
  }
  if (type === "responsibleStaff" && selectedResponsibleStaff.value) {
    return lawyer.lawyer_id === selectedResponsibleStaff.value.lawyer_id;
  }
  if (type === "originatingSolicitor" && selectedOriginatingSolicitor.value) {
    return lawyer.lawyer_id === selectedOriginatingSolicitor.value.lawyer_id;
  }
  return false;
};

const fetchLawyers = async () => {
  try {
    const response = await api.get(
      "/api/firm_side/lawyer_manage/get_my_lawyers/"
    );
    if (response.data.status) {
      lawyers.value = response.data.data.map((lawyer) => ({
        id: lawyer.id,
        lawyer_id: lawyer.lawyer_id,
        full_name: lawyer.full_name,
        email: lawyer.email,
        mobile_number: lawyer.mobile_number,
        role_name: lawyer.role_name,
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
  }
};

const fetchAssignedLawyers = async () => {
  try {
    const response = await api.get(
      `/api/firm_side/matter/creation/retrieve-assigned-lawyers/?matter_id=${props.matterId}`
    );
    if (response.data.status) {
      const assignedLawyers = response.data.data;
      assignedLawyers.forEach((lawyer) => {
        const lawyerData = lawyers.value.find(
          (l) => l.lawyer_id === lawyer.lawyer
        ) || {
          id: lawyer.lawyer_info.id,
          lawyer_id: lawyer.lawyer_info.lawyer_id,
          full_name: lawyer.lawyer_info.full_name,
          email: lawyer.lawyer_info.email,
          mobile_number: lawyer.lawyer_info.mobile_number,
          role_name: lawyer.lawyer_info.role_name,
        };
        if (lawyer.role_name === "RESPONSIBLE_SOLICITOR") {
          selectedResponsibleSolicitor.value = lawyerData;
          form.responsibleSolicitor_id = lawyerData.lawyer_id;
        } else if (lawyer.role_name === "RESPONSIBLE_STAFF") {
          selectedResponsibleStaff.value = lawyerData;
          form.responsibleStaff_id = lawyerData.lawyer_id;
        } else if (lawyer.role_name === "ORIGINATING_SOLICITOR") {
          selectedOriginatingSolicitor.value = lawyerData;
          form.originatingSolicitor_id = lawyerData.lawyer_id;
        }
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
  }
};

const validateField = (field) => {
  if (field === "responsibleSolicitor") {
    errors.responsibleSolicitor = form.responsibleSolicitor_id
      ? ""
      : "Responsible solicitor is required";
  }
};

const submitAssignLawyer = async () => {
  validateField("responsibleSolicitor");
  if (errors.responsibleSolicitor) {
    Swal.fire({
      text: errors.responsibleSolicitor,
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

  try {
    const assignLawyers = [];
    if (form.responsibleSolicitor_id) {
      assignLawyers.push({
        lawyer: form.responsibleSolicitor_id,
        role: "RESPONSIBLE_SOLICITOR",
      });
    }
    if (form.responsibleStaff_id) {
      assignLawyers.push({
        lawyer: form.responsibleStaff_id,
        role: "RESPONSIBLE_STAFF",
      });
    }
    if (form.originatingSolicitor_id) {
      assignLawyers.push({
        lawyer: form.originatingSolicitor_id,
        role: "ORIGINATING_SOLICITOR",
      });
    }

    const payload = {
      matter_id: props.matterId,
      assign_lawyers: assignLawyers,
    };

    const response = await api.post(
      "/api/firm_side/matter/creation/assign-lawyers/",
      payload
    );

    if (response.data.status) {
      Swal.fire({
        text: "Lawyers assigned successfully!",
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
  }
};

onMounted(async () => {
  await fetchLawyers();
  if (props.matterId) {
    await fetchAssignedLawyers();
  }
});
</script>
