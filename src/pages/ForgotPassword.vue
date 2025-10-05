<template>
  <main class="min-h-screen bg-[#3C4758] flex items-center justify-center p-4">
    <section class="w-full max-w-md">
      <div
        class="bg-white backdrop-blur rounded-xl shadow-lg border border-slate-200 p-8 md:p-6"
        role="region"
        aria-labelledby="login-title"
      >
        <h1
          id="login-title"
          class="text-center text-2xl font-bold text-slate-800 mb-8"
        >
          Forgot Password
        </h1>

        <form class="grid gap-6" novalidate>
          <div class="grid gap-2">
            <label class="text-gray-400 font-semibold text-sm"
              >Email Address</label
            >
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              class="w-full bg-transparent rounded-md border border-b border-slate-300 focus:border focus:border-slate-600 focus:outline-none px-2 py-1 text-slate-800 placeholder:text-slate-400"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="inline-flex items-center justify-center gap-2 border border-slate-300 rounded-md px-4 py-1 text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors disabled:opacity-60"
          >
            <LogIn class="w-4 h-4" />
            <span class="font-semibold">Send Reset Link</span>
          </button>
        </form>
      </div>
    </section>
  </main>
</template>
