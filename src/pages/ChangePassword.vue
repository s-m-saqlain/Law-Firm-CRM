<template>
  <div>
    <div>
      <h1 class="text-2xl font-bold">Change Password</h1>
      <p class="border-[#D1D6E0] border-b pt-1"></p>
    </div>
    <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow mt-14">
      <h1 class="text-2xl font-bold mb-4 text-center text-gray-800">
        Change Password
      </h1>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <input
            v-model="oldPassword"
            type="password"
            placeholder="Old Password"
            required
            class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <input
            v-model="newPassword"
            type="password"
            placeholder="New Password"
            required
            class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm New Password"
            required
            class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <button type="submit" class="w-full border py-2 rounded transition">
          Submit
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from "../services/auth.js";

const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

async function onSubmit() {
  if (newPassword.value !== confirmPassword.value) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const res = await api.put("/api/auth/session/change_password/", {
      old_password: oldPassword.value,
      new_password: newPassword.value,
      confirm_new_password: confirmPassword.value,
    });
    if (res.data.status) {
      alert("Password updated successfully!");
      oldPassword.value = "";
      newPassword.value = "";
      confirmPassword.value = "";
    } else {
      alert(res.data.message || "Failed to update password.");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  }
}
</script>
