<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div
      class="bg-white rounded-lg px-6 pt-6 w-full max-w-md relative max-h-[80vh] overflow-y-auto"
    >
      <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
        <span>➕</span> Add New Lawyer
      </h2>

      <form @submit.prevent="handleSubmit" novalidate>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700"
            >First Name <span class="text-red-500">*</span></label
          >
          <input
            v-model.trim="form.first_name"
            type="text"
            class="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter first name"
          />
          <p v-if="errors.first_name" class="text-red-500 text-xs mt-1">
            {{ errors.first_name }}
          </p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700"
            >Last Name <span class="text-red-500">*</span></label
          >
          <input
            v-model.trim="form.last_name"
            type="text"
            class="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter last name"
          />
          <p v-if="errors.last_name" class="text-red-500 text-xs mt-1">
            {{ errors.last_name }}
          </p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700"
            >Email <span class="text-red-500">*</span></label
          >
          <input
            v-model.trim="form.email"
            type="email"
            required
            class="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter email"
          />
          <p v-if="errors.email" class="text-red-500 text-xs mt-1">
            {{ errors.email }}
          </p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700"
            >Mobile Number <span class="text-red-500">*</span></label
          >
          <input
            v-model.trim="form.mobile_number"
            type="tel"
            class="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter mobile number"
          />
          <p v-if="errors.mobile_number" class="text-red-500 text-xs mt-1">
            {{ errors.mobile_number }}
          </p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700"
            >Specialization <span class="text-red-500">*</span></label
          >
          <input
            v-model.trim="form.specialization"
            type="text"
            class="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter specialization"
          />
          <p v-if="errors.specialization" class="text-red-500 text-xs mt-1">
            {{ errors.specialization }}
          </p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700"
            >Experience (Years) <span class="text-red-500">*</span></label
          >
          <input
            v-model.number="form.experience_years"
            type="number"
            min="0"
            class="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter years of experience"
          />
          <p v-if="errors.experience_years" class="text-red-500 text-xs mt-1">
            {{ errors.experience_years }}
          </p>
        </div>
        <div class="sticky bottom-0 bg-white -mx-6 px-6 border-t">
          <div class="flex justify-end gap-2 mt-2">
            <button
              type="button"
              @click="closeModal"
              class="border border-gray-300 rounded-md px-4 py-2 mb-2 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mb-2 rounded-md"
            >
              Save
            </button>
          </div>
        </div>
      </form>

      <button
        @click="closeModal"
        class="absolute top-3 right-4 text-gray-500 hover:text-gray-800"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";
import api from "../../services/auth.js";

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(["close", "saved"]);

const form = ref({
  first_name: "",
  last_name: "",
  email: "",
  mobile_number: "",
  specialization: "",
  experience_years: null,
});

const errors = ref({});

const validateForm = () => {
  const err = {};

  if (!form.value.first_name) {
    err.first_name = "First name is required.";
  } else if (form.value.first_name.length < 4) {
    err.first_name = "First name must be at least 4 characters.";
  }

  if (!form.value.last_name) {
    err.last_name = "Last name is required.";
  } else if (form.value.last_name.length < 4) {
    err.last_name = "Last name must be at least 4 characters.";
  }

  if (!form.value.email) {
    err.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    err.email = "Please enter a valid email address.";
  }

  if (!form.value.mobile_number) {
    err.mobile_number = "Mobile number is required.";
  } else if (!/^\+?\d{10,15}$/.test(form.value.mobile_number)) {
    err.mobile_number = "Please enter a valid mobile number (10-15 digits).";
  }

  if (!form.value.specialization) {
    err.specialization = "Specialization is required.";
  }

  if (
    form.value.experience_years === null ||
    form.value.experience_years === ""
  ) {
    err.experience_years = "Experience years is required.";
  } else if (form.value.experience_years < 0) {
    err.experience_years = "Experience years cannot be negative.";
  }

  errors.value = err;
  return Object.keys(err).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    Swal.fire(
      "Validation Error",
      "Please fix the errors in the form.",
      "warning"
    );
    return;
  }

  try {
    const payload = {
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      email: form.value.email,
      mobile_number: form.value.mobile_number,
      specialization: form.value.specialization,
      experience_years: form.value.experience_years,
    };

    const res = await api.post(
      "/api/firm_side/lawyer_manage/create_lawyer/",
      payload
    );

    if (res.data?.status) {
      Swal.fire("Success", "Lawyer added successfully!", "success");
      emit("saved");
      closeModal();
    } else {
      Swal.fire("Error", res.data?.message || "Failed to add lawyer.", "error");
      console.log(res);
    }
  } catch (error) {
    Swal.fire(
      "Error",
      error?.response?.data?.message || "Failed to add lawyer.",
      "error"
    );
  }
};

const closeModal = () => {
  form.value = {
    first_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    specialization: "",
    experience_years: null,
  };
  errors.value = {};
  emit("close");
};
</script>
