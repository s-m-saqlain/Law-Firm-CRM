<template>
  <main class="min-h-screen bg-slate-700 flex items-center justify-center p-4">
    <section class="w-full max-w-md">
      <div
        class="bg-white/95 backdrop-blur rounded-xl shadow-lg border border-slate-200 p-8 md:p-10"
        role="region"
        aria-labelledby="login-title"
      >
        <h1
          id="login-title"
          class="text-center text-3xl font-bold text-slate-800 mb-8"
        >
          Login
        </h1>

        <form @submit.prevent="onSubmit" class="grid gap-6" novalidate>
          <div class="grid gap-2">
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              class="w-full bg-transparent border-0 border-b border-slate-300 focus:border-b-2 focus:border-slate-600 focus:outline-none px-0 py-2 text-slate-800 placeholder:text-slate-400"
              placeholder="Email address"
            />
          </div>

          <div class="grid gap-2">
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                class="w-full bg-transparent border-0 border-b border-slate-300 focus:border-b-2 focus:border-slate-600 focus:outline-none px-0 py-2 text-slate-800 placeholder:text-slate-400"
                placeholder="Password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                class="absolute right-0 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                <Eye v-if="!showPassword" class="w-5 h-5" />
                <EyeOff v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div class="flex justify-end">
            <a
              href="#"
              class="text-sm text-slate-600 hover:text-slate-800 underline-offset-4 hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            class="inline-flex items-center justify-center gap-2 border border-slate-300 rounded-md px-4 py-1 text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <LogIn class="w-4 h-4" />
            <span>Sign In</span>
          </button>
        </form>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { Eye, EyeOff, LogIn } from "lucide-vue-next";
import { useAuthStore } from "../../stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const showPassword = ref(false);

async function onSubmit() {
  const success = await authStore.login(email.value, password.value);
  if (success) {
    const role = authStore.userRole;
    if (role === "Lawyer") {
      router.push("/lawyer/dashboard");
    } else if (role === "Law Firm") {
      router.push("/firm/dashboard");
    } else if (role === "Super Admin") {
      router.push("/super-admin/dashboard");
    } else {
      alert("Unknown User");
    }
  } else {
    alert("Please check your credentials.");
  }
}
</script>
