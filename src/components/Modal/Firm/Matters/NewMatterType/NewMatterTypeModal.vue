<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <LoadingSpinner :is-loading="loading" />
    <div class="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-zinc-800 p-4">
          Add New Matter Type
        </h2>
        <button
          @click="$emit('close')"
          class="text-zinc-600 hover:text-zinc-800 px-4"
        >
          <svg
            class="h-6 w-6"
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
        </button>
      </div>

      <form
        @submit.prevent="submitMatterType"
        class="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-400 scrollbar-track-zinc-100"
      >
        <div class="mb-4">
          <label class="mb-1 block text-sm text-zinc-600">Name *</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Enter matter type name"
            class="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm placeholder-zinc-400 outline-none focus:border-zinc-400"
            :class="{ 'border-red-500': errors.name }"
            @input="validateField('name')"
          />
          <span v-if="errors.name" class="text-red-500 text-xs mt-1">{{
            errors.name
          }}</span>
        </div>

        <div
          class="flex justify-end gap-3 p-4 border-t bg-white sticky -bottom-4"
        >
          <button
            type="button"
            @click="$emit('close')"
            class="rounded-md bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            :disabled="!isFormValid"
          >
            Save Matter Type
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import Swal from "sweetalert2";
import api from "../../../../../services/auth";
import LoadingSpinner from "../../../../../components/LoadingSpinner.vue";

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close", "matter-type-added"]);
const loading = ref(false);

const form = reactive({
  name: "",
});

const errors = reactive({
  name: "",
});

const isFormValid = computed(() => {
  return form.name && !errors.name;
});

const validateField = (field) => {
  if (field === "name") {
    errors.name = form.name ? "" : "Name is required";
  }
};

const validateForm = () => {
  validateField("name");
  return isFormValid.value;
};

const submitMatterType = async () => {
  if (!validateForm()) {
    return;
  }
  loading.value = true;

  try {
    const payload = {
      title: form.name,
    };

    const response = await api.post(
      "/api/firm_side/matter/dashboard/create_practicing_area/",
      payload
    );

    if (response.data.status) {
      Swal.fire({
        title: "Success",
        text: "Matter type added successfully!",
        icon: "success",
        confirmButtonColor: "#18181b",
      });
      const newMatterType = {
        id: response.data.data.id || Date.now().toString(),
        title: form.name,
      };
      emit("matter-type-added", newMatterType);
      resetForm();
      emit("close");
    } else {
      Swal.fire({
        title: "Failed to Add Matter Type",
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

const resetForm = () => {
  form.name = "";
  errors.name = "";
};
</script>
