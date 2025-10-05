<template>
  <h1 class="text-xl text-center font-semibold text-slate-800 mb-4">
    Reset Password
  </h1>
  <p class="text-gray-500 text-center text-sm mb-6">
    <span class="font-medium">{{ email }}</span>
  </p>

  <form @submit.prevent="resetPassword" class="space-y-4">
    <input
      v-model="password"
      type="password"
      placeholder="New Password"
      class="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-800 placeholder:text-slate-400"
    />

    <input
      v-model="confirmPassword"
      type="password"
      placeholder="Confirm Password"
      class="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-800 placeholder:text-slate-400"
    />

    <button
      type="submit"
      :disabled="!password.trim() || !confirmPassword.trim() || loading"
      class="w-full bg-[#3C4758] text-white font-semibold py-2 rounded-md hover:bg-[#4A5568] active:bg-[#2D3748] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {{ loading ? "Resetting..." : "Reset Password" }}
    </button>
  </form>
</template>

<script setup>
import { ref } from "vue";
import api from "../../services/auth.js";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

const props = defineProps({
  email: {
    type: String,
    required: true,
  },
});

const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);

const router = useRouter();

async function resetPassword() {
  if (password.value !== confirmPassword.value) {
    Swal.fire({
      icon: "warning",
      title: "Passwords do not match!",
      text: "Please make sure both passwords are the same.",
    });
    return;
  }

  if (!password.value.trim()) return;
  loading.value = true;

  try {
    const res = await api.post("/api/auth/forget-password/reset_password/", {
      email: props.email,
      new_password: password.value,
    });

    if (res.data.status) {
      await Swal.fire({
        icon: "success",
        title: "Password Reset Successful!",
        text: "You can now log in with your new password.",
        confirmButtonText: "OK",
      });
      router.push("/login");
    } else {
      Swal.fire({
        icon: "error",
        title: res.data.message || "Failed to reset password",
      });
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error resetting password",
      text: err.response?.data?.message || "Something went wrong!",
    });
  } finally {
    loading.value = false;
  }
}
</script>
