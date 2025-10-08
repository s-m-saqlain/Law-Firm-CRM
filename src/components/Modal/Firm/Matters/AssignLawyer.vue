<template>
  <div>
    <h2 class="mb-4 text-lg font-semibold text-zinc-800">Assign Lawyer</h2>
    <form @submit.prevent="handleSubmit" class="grid grid-cols-1 gap-5">
      <div class="relative">
        <label class="mb-1 block text-sm text-zinc-600"
          >Responsible Solicitor *</label
        >
        <div
          @click="toggleDropdown('responsibleSolicitor')"
          class="flex items-center justify-between h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800 cursor-pointer"
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
              :class="{ 'bg-blue-100': isSelected(lawyer, 'responsibleStaff') }"
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
          @click="emitGoBack"
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
import { defineProps, defineEmits, reactive } from "vue";

const props = defineProps({
  filteredLawyers: {
    type: Array,
    required: true,
  },
  selectedResponsibleSolicitor: {
    type: Object,
    default: null,
  },
  selectedResponsibleStaff: {
    type: Object,
    default: null,
  },
  selectedOriginatingSolicitor: {
    type: Object,
    default: null,
  },
  dropdownOpen: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits([
  "go-back",
  "submit",
  "select-lawyer",
  "update:dropdown-open",
]);

const toggleDropdown = (type) => {
  const newDropdownOpen = {
    responsibleSolicitor: false,
    responsibleStaff: false,
    originatingSolicitor: false,
    [type]: !props.dropdownOpen[type],
  };
  emit("update:dropdown-open", newDropdownOpen);
};

const selectLawyer = (lawyer, type) => {
  emit("select-lawyer", { lawyer, type });
  const newDropdownOpen = {
    responsibleSolicitor: false,
    responsibleStaff: false,
    originatingSolicitor: false,
  };
  emit("update:dropdown-open", newDropdownOpen);
};

const isSelected = (lawyer, type) => {
  if (type === "responsibleSolicitor" && props.selectedResponsibleSolicitor) {
    return lawyer.lawyer_id === props.selectedResponsibleSolicitor.lawyer_id;
  }
  if (type === "responsibleStaff" && props.selectedResponsibleStaff) {
    return lawyer.lawyer_id === props.selectedResponsibleStaff.lawyer_id;
  }
  if (type === "originatingSolicitor" && props.selectedOriginatingSolicitor) {
    return lawyer.lawyer_id === props.selectedOriginatingSolicitor.lawyer_id;
  }
  return false;
};

const emitGoBack = () => {
  emit("go-back");
};

const handleSubmit = () => {
  emit("submit");
};
</script>
