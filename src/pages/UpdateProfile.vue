<template>
  <div>
    <h1 class="text-2xl font-bold">Update Profile</h1>
    <p class="border-b pt-2"></p>

    <div class="mt-6 flex flex-col items-center">
      <img
        v-if="profileImage"
        :src="profileImage"
        alt="Profile Image"
        class="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
      />
      <label
        class="mt-3 text-sm text-blue-600 cursor-pointer hover:underline"
        for="imageUpload"
      >
        Change Profile Image
      </label>
      <input
        id="imageUpload"
        type="file"
        class="hidden"
        accept="image/*"
        @change="onFileChange"
      />
    </div>

    <form @submit.prevent="updateProfile" class="space-y-4 mt-8">
      <div>
        <input
          v-model="firstName"
          type="text"
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="First Name"
          required
        />
      </div>

      <div>
        <input
          v-model="middleName"
          type="text"
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Middle Name"
        />
      </div>

      <div>
        <input
          v-model="lastName"
          type="text"
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Last Name"
          required
        />
      </div>

      <div>
        <input
          v-model="mobileNumber"
          type="text"
          maxlength="10"
          inputmode="numeric"
          pattern="[0-9]*"
          @input="filterMobile"
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Mobile Number (10 digits)"
          required
        />
      </div>

      <button type="submit" class="w-full border py-2 rounded-md transition">
        Update Profile
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/auth.js";
import Swal from "sweetalert2";

const firstName = ref("");
const middleName = ref("");
const lastName = ref("");
const mobileNumber = ref("");
const profileImage = ref(null);
const selectedFile = ref(null);

onMounted(async () => {
  await getProfile();
});

async function getProfile() {
  try {
    const res = await api.get("/api/auth/session/get_profile/");
    if (res.data.status) {
      const data = res.data.data;
      firstName.value = data.first_name || "";
      middleName.value = data.middle_name || "";
      lastName.value = data.last_name || "";
      mobileNumber.value = data.mobile_number || "";
      profileImage.value = data.profile_image || null;
    } else {
      Swal.fire({
        icon: "error",
        title: "Failed to load profile",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error loading profile",
      text: error.response?.data?.message || "Something went wrong!",
    });
  }
}

function filterMobile(e) {
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
  mobileNumber.value = e.target.value;
}

async function updateProfile() {
  if (!/^\d{10}$/.test(mobileNumber.value)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Mobile Number",
      text: "Please enter a valid 10-digit mobile number.",
    });
    return;
  }

  const formData = new FormData();
  formData.append("first_name", firstName.value);
  formData.append("middle_name", middleName.value);
  formData.append("last_name", lastName.value);
  formData.append("mobile_number", mobileNumber.value);

  if (selectedFile.value) {
    formData.append("profile_image", selectedFile.value);
  }

  try {
    const res = await api.patch("/api/auth/session/update_profile/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.data.status) {
      Swal.fire({
        icon: "success",
        title: "Profile Updated Successfully!",
      });
      await getProfile();
    } else {
      Swal.fire({
        icon: "error",
        title: res.data.message || "Failed to update profile",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error updating profile",
      text: error.response?.data?.message || "Something went wrong!",
    });
  }
}

function onFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    profileImage.value = URL.createObjectURL(file);
  }
}
</script>
