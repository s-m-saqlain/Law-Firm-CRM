<template>
  <h1 class="text-xl text-center font-semibold text-slate-800 mb-2">
    OTP Verification
  </h1>
  <p class="text-gray-500 text-center text-sm mb-6">
    <span class="font-medium">{{ email }}</span>
  </p>

  <form @submit.prevent="verifyOtp" class="space-y-4">
    <input
      v-model="otp"
      type="text"
      maxlength="6"
      inputmode="numeric"
      placeholder="Enter OTP"
      class="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-800 placeholder:text-slate-400"
    />

    <button
      type="submit"
      :disabled="!otp.trim() || loading"
      class="w-full bg-[#3C4758] text-white font-semibold py-2 rounded-md hover:bg-[#4A5568] active:bg-[#2D3748] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {{ loading ? "Verifying..." : "Verify" }}
    </button>
  </form>

  <p v-if="error" class="text-red-500 text-sm mt-4">{{ error }}</p>
</template>

<script setup>
import { ref } from "vue";
import api from "../../services/auth.js";
import Swal from "sweetalert2";

const props = defineProps({
  email: String,
});
const emit = defineEmits(["otp-verified"]);

const otp = ref("");
const loading = ref(false);
const error = ref("");

async function verifyOtp() {
  if (!otp.value.trim()) return;
  loading.value = true;
  error.value = "";

  try {
    const res = await api.post("/api/auth/forget-password/verify_otp/", {
      email: props.email,
      otp: otp.value,
    });

    if (res.data.status) {
      await Swal.fire({
        icon: "success",
        title: "OTP Verified!",
        text: "You can now reset your password.",
        confirmButtonText: "Continue",
      });
      emit("otp-verified");
    } else {
      error.value = res.data.message || "Invalid OTP, please try again.";
    }
  } catch (err) {
    error.value = err.response?.data?.message || "Something went wrong!";
  } finally {
    loading.value = false;
  }
}
</script>
