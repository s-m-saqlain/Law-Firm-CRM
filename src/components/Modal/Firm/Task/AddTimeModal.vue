<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
  >
    <div class="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
      <button
        class="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
        @click="$emit('close')"
      >
        ×
      </button>

      <h2 class="text-lg font-semibold mb-4">Add Time Entry for:</h2>
      <input
        type="text"
        class="w-full border rounded-md px-3 py-2 text-sm mb-3"
        placeholder="1h 12m, 1:12..."
      />

      <div class="space-y-4">
        <div class="flex space-x-2">
          <input
            type="date"
            class="border rounded-md px-3 py-2 text-sm w-1/2"
            v-model="form.date1"
          />
          <input
            type="number"
            class="border rounded-md px-3 py-2 text-sm w-1/2"
            v-model="form.hours1"
            placeholder="Hours"
          />
        </div>
        <textarea
          class="border rounded-md px-3 py-2 w-full text-sm"
          rows="3"
          placeholder="Enter details about this time entry"
          v-model="form.details1"
        ></textarea>

        <select
          v-model="form.selectedLawyer"
          class="border rounded-md px-3 py-2 text-sm w-full"
        >
          <option disabled value="">Select a lawyer</option>
          <option v-for="lawyer in lawyers" :key="lawyer.id" :value="lawyer.id">
            {{ lawyer.name }}
          </option>
        </select>

        <div class="flex items-center justify-between mt-2">
          <div class="flex items-center space-x-3">
            <label class="flex items-center space-x-1 text-sm">
              <input type="checkbox" v-model="form.nonBillable" />
              <span>Non-billable</span>
            </label>
            <label class="flex items-center space-x-1 text-sm">
              <input type="checkbox" v-model="form.writtenOff" />
              <span>Written-off</span>
            </label>
            <label class="flex items-center space-x-1 text-sm">
              <input type="checkbox" v-model="form.showOnBill" />
              <span>Show this entry on the bill</span>
            </label>
          </div>
        </div>

        <div class="flex justify-end space-x-2 mt-5">
          <button
            class="bg-[#312F31] text-white font-semibold text-sm px-3 py-1 rounded-md hover:bg-gray-800"
            @click="handleSave"
          >
            Save Entry
          </button>
          <button
            class="bg-[#D1D5DC] border text-gray-900 text-sm px-3 py-1 rounded-md"
            @click="$emit('close')"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";

interface Lawyer {
  id: number;
  name: string;
}

const props = defineProps<{
  show: boolean;
  lawyers?: Lawyer[];
}>();

const emits = defineEmits(["close", "save"]);

const form = reactive({
  date1: "",
  hours1: 1,
  details1: "",
  date2: "",
  hours2: 1,
  details2: "",
  selectedLawyer: "",
  nonBillable: false,
  writtenOff: false,
  showOnBill: false,
});

const handleSave = () => {
  emits("save", { ...form });
};
</script>
