<template>
  <main class="min-h-screen bg-[#3C4758] flex items-center justify-center p-4">
    <section class="w-full max-w-md">
      <div
        class="bg-white backdrop-blur rounded-xl shadow-lg border border-slate-200 p-8 md:p-6"
      >
        <div v-if="!showOtp && !showReset">
          <h1 class="text-center text-2xl font-bold text-slate-800 mb-8">
            Forgot Password
          </h1>

          <form @submit.prevent="sendOtp" class="grid gap-6" novalidate>
            <div class="grid gap-2">
              <label class="text-gray-400 font-semibold text-sm"
                >Email Address</label
              >
              <input
                v-model="email"
                type="email"
                required
                class="w-full bg-transparent rounded-md border border-slate-300 focus:border-slate-600 focus:outline-none px-2 py-1 text-slate-800 placeholder:text-slate-400"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              :disabled="!email.trim() || loading"
              class="inline-flex items-center justify-center gap-2 border border-slate-300 rounded-md px-4 py-1 text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span class="font-semibold">
                {{ loading ? "Sending..." : "Send Reset Link" }}
              </span>
            </button>
          </form>
        </div>

        <div v-else-if="showOtp && !showReset" class="space-y-4">
          <OtpVerification :email="email" @otp-verified="showReset = true" />

          <div class="mt-4 text-center">
            <button
              @click="resendOtp"
              :disabled="resendTimer > 0 || resendLoading"
              class="text-sm font-semibold text-slate-700 border border-slate-300 rounded-md px-4 py-1 bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <template v-if="resendTimer > 0">
                Resend in {{ resendTimer }}s
              </template>
              <template v-else>
                {{ resendLoading ? "Resending..." : "Resend OTP" }}
              </template>
            </button>
          </div>
        </div>

        <div v-else-if="showReset">
          <ResetPassword :email="email" />
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
import api from "../services/auth.js";
import Swal from "sweetalert2";
import OtpVerification from "../components/OTPVerification/OtpVerification.vue";
import ResetPassword from "../components/OTPVerification/ResetPassword.vue";

const email = ref("");
const loading = ref(false);
const showOtp = ref(false);
const showReset = ref(false);

const resendTimer = ref(0);
const resendLoading = ref(false);
let interval = null;

function startResendTimer() {
  resendTimer.value = 30;
  clearInterval(interval);
  interval = setInterval(() => {
    resendTimer.value--;
    if (resendTimer.value <= 0) clearInterval(interval);
  }, 1000);
}

onUnmounted(() => {
  if (interval) clearInterval(interval);
});

async function sendOtp() {
  if (!email.value.trim()) return;
  loading.value = true;
  try {
    const res = await api.post("/api/auth/forget-password/request_otp/", {
      email: email.value,
    });

    if (res.data.status) {
      await Swal.fire({
        icon: "success",
        title: "Email Sent Successfully!",
        text: "Please check your inbox for the OTP code.",
        confirmButtonText: "OK",
      });
      showOtp.value = true;
      startResendTimer();
    } else {
      Swal.fire({
        icon: "error",
        title: res.data.message || "Failed to send reset link",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error sending reset link",
      text: error.response?.data?.message || "Something went wrong!",
    });
  } finally {
    loading.value = false;
  }
}

async function resendOtp() {
  if (resendTimer.value > 0 || resendLoading.value) return;
  resendLoading.value = true;
  try {
    const res = await api.post("/api/auth/forget-password/request_otp/", {
      email: email.value,
    });

    if (res.data.status) {
      Swal.fire({
        icon: "success",
        title: "OTP Resent!",
        text: "Please check your inbox again.",
        confirmButtonText: "OK",
      });
      startResendTimer();
    } else {
      Swal.fire({
        icon: "error",
        title: res.data.message || "Failed to resend OTP",
      });
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error resending OTP",
      text: err.response?.data?.message || "Something went wrong!",
    });
  } finally {
    resendLoading.value = false;
  }
}
</script>
