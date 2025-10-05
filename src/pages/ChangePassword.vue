<template>
  <div class="max-w-md mx-auto bg-white p-6 shadow rounded-lg">
    <h1 class="text-2xl font-bold mb-4">Change Password</h1>

    <form @submit.prevent="onChangePassword" class="space-y-4">
      <div>
        <label class="block text-sm text-gray-700 mb-1">Current Password</label>
        <input
          v-model="oldPassword"
          type="password"
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label class="block text-sm text-gray-700 mb-1">New Password</label>
        <input
          v-model="newPassword"
          type="password"
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label class="block text-sm text-gray-700 mb-1">Confirm Password</label>
        <input
          v-model="confirmPassword"
          type="password"
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        Change Password
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";
import api from "../services/auth.js";

const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

async function onChangePassword() {
  if (newPassword.value !== confirmPassword.value) {
    Swal.fire({
      icon: "error",
      title: "Passwords do not match",
    });
    return;
  }

  try {
    const res = await api.post("/api/auth/session/change_password/", {
      old_password: oldPassword.value,
      new_password: newPassword.value,
      confirm_password: confirmPassword.value,
    });

    if (res.data.status) {
      Swal.fire({
        icon: "success",
        title: res.data.message || "Password changed successfully!",
      });
      oldPassword.value = "";
      newPassword.value = "";
      confirmPassword.value = "";
    } else {
      Swal.fire({
        icon: "error",
        title: res.data.message || "Failed to change password.",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: error.response?.data?.message || "Something went wrong!",
    });
  }
}
</script>
