<template>
  <div>
    <h2 class="mb-4 text-lg font-semibold text-zinc-800">
      Matter Notification
    </h2>
    <div class="grid grid-cols-1 gap-5">
      <p class="text-sm text-zinc-600">
        Configure notifications for this matter (placeholder).
      </p>
      <div class="mt-1 flex items-center justify-end gap-3">
        <button
          type="button"
          @click="emitGoBack"
          class="rounded-md bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-300"
        >
          Back
        </button>
        <button
          type="button"
          @click="emitSaveAndNext"
          class="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-zinc-800"
        >
          Save & Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from "vue";

const emit = defineEmits(["go-back", "save-and-next"]);

const emitGoBack = () => {
  emit("go-back");
};

const emitSaveAndNext = () => {
  emit("save-and-next");
};
</script>
