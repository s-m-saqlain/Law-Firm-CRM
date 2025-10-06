<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-zinc-800 p-4">Add New Contact</h2>
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
        @submit.prevent="submitContact"
        class="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-400 scrollbar-track-zinc-100"
      >
        <div class="mb-4">
          <label class="mb-2 block text-sm text-zinc-600">
            Is this contact a person or a company?
          </label>
          <div class="flex gap-4">
            <label class="flex items-center gap-2">
              <input
                type="radio"
                v-model="form.contactType"
                value="Person"
                class="text-zinc-900 focus:ring-zinc-400"
                required
                @change="validateField('contactType')"
              />
              <span class="text-sm text-zinc-600">Person</span>
            </label>
            <label class="flex items-center gap-2">
              <input
                type="radio"
                v-model="form.contactType"
                value="Company"
                class="text-zinc-900 focus:ring-zinc-400"
                required
                @change="validateField('contactType')"
              />
              <span class="text-sm text-zinc-600">Company</span>
            </label>
          </div>
          <span v-if="errors.contactType" class="text-red-500 text-xs mt-1">{{
            errors.contactType
          }}</span>
        </div>

        <div v-if="form.contactType === 'Person'" class="mb-4">
          <label class="mb-1 block text-sm text-zinc-600">First Name *</label>
          <input
            v-model="form.firstName"
            type="text"
            placeholder="Enter first name"
            class="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm placeholder-zinc-400 outline-none focus:border-zinc-400"
            :class="{ 'border-red-500': errors.firstName }"
            @input="validateField('firstName')"
          />
          <span v-if="errors.firstName" class="text-red-500 text-xs mt-1">{{
            errors.firstName
          }}</span>
        </div>

        <div v-if="form.contactType === 'Person'" class="mb-4">
          <label class="mb-1 block text-sm text-zinc-600"
            >Middle Name (Optional)</label
          >
          <input
            v-model="form.middleName"
            type="text"
            placeholder="Enter middle name"
            class="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm placeholder-zinc-400 outline-none focus:border-zinc-400"
          />
        </div>

        <div v-if="form.contactType === 'Person'" class="mb-4">
          <label class="mb-1 block text-sm text-zinc-600"
            >Last Name (Optional)</label
          >
          <input
            v-model="form.lastName"
            type="text"
            placeholder="Enter last name"
            class="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm placeholder-zinc-400 outline-none focus:border-zinc-400"
          />
        </div>

        <div v-if="form.contactType === 'Company'" class="mb-4">
          <label class="mb-1 block text-sm text-zinc-600">Company Name *</label>
          <input
            v-model="form.companyName"
            type="text"
            placeholder="Enter company name"
            class="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm placeholder-zinc-400 outline-none focus:border-zinc-400"
            :class="{ 'border-red-500': errors.companyName }"
            @input="validateField('companyName')"
          />
          <span v-if="errors.companyName" class="text-red-500 text-xs mt-1">{{
            errors.companyName
          }}</span>
        </div>

        <div class="mb-4">
          <label class="mb-1 block text-sm text-zinc-600">Email *</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="Enter email address"
            class="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm placeholder-zinc-400 outline-none focus:border-zinc-400"
            :class="{ 'border-red-500': errors.email }"
            @input="validateField('email')"
          />
          <span v-if="errors.email" class="text-red-500 text-xs mt-1">{{
            errors.email
          }}</span>
        </div>

        <div class="mb-4">
          <label class="mb-1 block text-sm text-zinc-600">Phone Number *</label>
          <input
            v-model="form.phoneNumber"
            type="tel"
            placeholder="03001234567"
            class="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm placeholder-zinc-400 outline-none focus:border-zinc-400"
            :class="{ 'border-red-500': errors.phoneNumber }"
            @input="validateField('phoneNumber')"
          />
          <span v-if="errors.phoneNumber" class="text-red-500 text-xs mt-1">{{
            errors.phoneNumber
          }}</span>
        </div>

        <div class="mb-4">
          <label class="mb-1 block text-sm text-zinc-600">Address *</label>
          <input
            v-model="form.address.street"
            type="text"
            placeholder="Street"
            class="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm placeholder-zinc-400 outline-none focus:border-zinc-400 mb-2"
            :class="{ 'border-red-500': errors.street }"
            @input="validateField('street')"
          />
          <span v-if="errors.street" class="text-red-500 text-xs mt-1">{{
            errors.street
          }}</span>
          <input
            v-model="form.address.city"
            type="text"
            placeholder="City"
            class="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm placeholder-zinc-400 outline-none focus:border-zinc-400 mb-2"
            :class="{ 'border-red-500': errors.city }"
            @input="validateField('city')"
          />
          <span v-if="errors.city" class="text-red-500 text-xs mt-1">{{
            errors.city
          }}</span>
          <input
            v-model="form.address.state"
            type="text"
            placeholder="State/Province"
            class="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm placeholder-zinc-400 outline-none focus:border-zinc-400 mb-2"
            :class="{ 'border-red-500': errors.state }"
            @input="validateField('state')"
          />
          <span v-if="errors.state" class="text-red-500 text-xs mt-1">{{
            errors.state
          }}</span>
          <input
            v-model="form.address.postal_code"
            type="text"
            placeholder="Postal Code"
            class="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm placeholder-zinc-400 outline-none focus:border-zinc-400 mb-2"
            :class="{ 'border-red-500': errors.postal_code }"
            @input="validateField('postal_code')"
          />
          <span v-if="errors.postal_code" class="text-red-500 text-xs mt-1">{{
            errors.postal_code
          }}</span>
          <input
            v-model="form.address.country"
            type="text"
            placeholder="Country"
            class="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm placeholder-zinc-400 outline-none focus:border-zinc-400"
            :class="{ 'border-red-500': errors.country }"
            @input="validateField('country')"
          />
          <span v-if="errors.country" class="text-red-500 text-xs mt-1">{{
            errors.country
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
            Save Contact
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";
import Swal from "sweetalert2";
import api from "../../../../../services/auth";

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close", "contact-added"]);

const form = reactive({
  contactType: "Person",
  firstName: "",
  middleName: "",
  lastName: "",
  companyName: "",
  email: "",
  phoneNumber: "",
  address: {
    street: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  },
});

const errors = reactive({
  contactType: "",
  firstName: "",
  companyName: "",
  email: "",
  phoneNumber: "",
  street: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",
});

const isFormValid = computed(() => {
  return (
    form.contactType &&
    (form.contactType === "Person" ? form.firstName : form.companyName) &&
    form.email &&
    form.phoneNumber &&
    form.address.street &&
    form.address.city &&
    form.address.state &&
    form.address.postal_code &&
    form.address.country &&
    !errors.contactType &&
    !errors.firstName &&
    !errors.companyName &&
    !errors.email &&
    !errors.phoneNumber &&
    !errors.street &&
    !errors.city &&
    !errors.state &&
    !errors.postal_code &&
    !errors.country
  );
});

const validateField = (field) => {
  switch (field) {
    case "contactType":
      errors.contactType = form.contactType ? "" : "Contact type is required";
      break;
    case "firstName":
      errors.firstName =
        form.contactType === "Person" && !form.firstName
          ? "First name is required"
          : "";
      break;
    case "companyName":
      errors.companyName =
        form.contactType === "Company" && !form.companyName
          ? "Company name is required"
          : "";
      break;
    case "email":
      errors.email = !form.email
        ? "Email is required"
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
        ? "Invalid email format"
        : "";
      break;
    case "phoneNumber":
      errors.phoneNumber = !form.phoneNumber
        ? "Phone number is required"
        : !/^\+?\d{10,15}$/.test(form.phoneNumber)
        ? "Invalid phone number format"
        : "";
      break;
    case "street":
      errors.street = form.address.street ? "" : "Street is required";
      break;
    case "city":
      errors.city = form.address.city ? "" : "City is required";
      break;
    case "state":
      errors.state = form.address.state ? "" : "State is required";
      break;
    case "postal_code":
      errors.postal_code = form.address.postal_code
        ? ""
        : "Postal code is required";
      break;
    case "country":
      errors.country = form.address.country ? "" : "Country is required";
      break;
  }
};

const validateForm = () => {
  validateField("contactType");
  validateField("firstName");
  validateField("companyName");
  validateField("email");
  validateField("phoneNumber");
  validateField("street");
  validateField("city");
  validateField("state");
  validateField("postal_code");
  validateField("country");
  return isFormValid.value;
};

const submitContact = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    const payload = {
      email: form.email,
      first_name: form.contactType === "Person" ? form.firstName : "",
      middle_name: form.contactType === "Person" ? form.middleName || "" : "",
      last_name: form.contactType === "Person" ? form.lastName || "" : "",
      phone_number: form.phoneNumber,
      role: form.contactType === "Person" ? "PERSON" : "COMPANY",
      address: {
        street: form.address.street,
        city: form.address.city,
        state: form.address.state,
        postal_code: form.address.postal_code,
        country: form.address.country,
      },
    };

    if (form.contactType === "Company") {
      payload.first_name = form.companyName;
    }

    const response = await api.post(
      "/api/firm_side/contact-manage/create-contact/",
      payload
    );

    if (response.data.status) {
      Swal.fire({
        title: "Success",
        text: "Contact added successfully!",
        icon: "success",
        confirmButtonColor: "#18181b",
      });
      const newContact = {
        name:
          form.contactType === "Person"
            ? `${form.firstName} ${form.middleName} ${form.lastName}`.trim()
            : form.companyName,
        type: form.contactType === "Person" ? "PERSON" : "COMPANY",
        email: form.email,
        phone_number: form.phoneNumber,
      };
      emit("contact-added", newContact);
      resetForm();
      emit("close");
    } else {
      Swal.fire({
        title: "Failed to Add Contact",
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
  }
};

const resetForm = () => {
  form.contactType = "Person";
  form.firstName = "";
  form.middleName = "";
  form.lastName = "";
  form.companyName = "";
  form.email = "";
  form.phoneNumber = "";
  form.address.street = "";
  form.address.city = "";
  form.address.state = "";
  form.address.postal_code = "";
  form.address.country = "";
  errors.contactType = "";
  errors.firstName = "";
  errors.companyName = "";
  errors.email = "";
  errors.phoneNumber = "";
  errors.street = "";
  errors.city = "";
  errors.state = "";
  errors.postal_code = "";
  errors.country = "";
};
</script>
