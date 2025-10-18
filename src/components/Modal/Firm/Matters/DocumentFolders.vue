<template>
  <div>
    <div class="flex justify-between items-center">
      <h2 class="mb-4 text-lg font-bold text-zinc-800">Document Folders</h2>
      <div>
        <button
          @click="addFolderRow"
          class="rounded-md bg-[#E2F3FF] px-4 py-2 text-sm text-[#0761CA]"
        >
          + Add a document folder
        </button>
      </div>
    </div>
    <div class="grid grid-cols-1 gap-5 mt-8">
      <p
        class="text-sm font-normal border border-[#8EC5FF] rounded-lg bg-[#EFF6FF] py-3 px-4"
      >
        Create folders within this matter to keep incoming files organized.
        <a href="" class="border-[#1C5DBD] border-b text-[#1C5DBD]"
          >Learn more about Clio Documents</a
        >
      </p>

      <div
        v-for="(row, index) in enabledRows"
        :key="'enabled-' + index"
        class="grid grid-cols-2 gap-4"
      >
        <div>
          <label class="mb-1 block text-sm text-zinc-600">Folder Name *</label>
          <input
            v-model="row.folderName"
            type="text"
            placeholder="Enter folder name"
            class="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-800 outline-none focus:border-zinc-400"
            :disabled="row.isDisabled"
          />
        </div>

        <div class="relative">
          <label class="mb-1 block text-sm text-zinc-600">Category *</label>
          <div
            @click="toggleCategoryDropdown(index, true)"
            class="flex items-center justify-between h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800 cursor-pointer"
            :class="{ 'pointer-events-none opacity-50': row.isDisabled }"
          >
            <span>{{ row.selectedCategory?.name || "Select category" }}</span>
            <svg
              class="h-4 w-4 text-zinc-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <div
            v-if="row.isOpen && !row.isDisabled"
            class="absolute z-10 mt-1 w-full rounded-md border border-zinc-200 bg-white shadow-lg"
          >
            <ul class="max-h-56 overflow-y-auto">
              <li
                v-for="category in row.categories"
                :key="category.id"
                @click="selectCategory(index, category, true)"
                class="p-2 text-sm cursor-pointer hover:bg-zinc-100 text-zinc-800"
              >
                {{ category.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        v-for="(row, index) in disabledRows"
        :key="'disabled-' + index"
        class="grid grid-cols-2 gap-4"
      >
        <div>
          <label class="mb-1 block text-sm text-zinc-600">Folder Name *</label>
          <input
            v-model="row.folderName"
            type="text"
            placeholder="Enter folder name"
            class="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-800 outline-none focus:border-zinc-400"
            :disabled="row.isDisabled"
          />
        </div>

        <div class="relative">
          <label class="mb-1 block text-sm text-zinc-600">Category *</label>
          <div
            @click="toggleCategoryDropdown(index, false)"
            class="flex items-center justify-between h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800 cursor-pointer"
            :class="{ 'pointer-events-none opacity-50': row.isDisabled }"
          >
            <span>{{ row.selectedCategory?.name || "Select category" }}</span>
            <svg
              class="h-4 w-4 text-zinc-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <div
            v-if="row.isOpen && !row.isDisabled"
            class="absolute z-10 mt-1 w-full rounded-md border border-zinc-200 bg-white shadow-lg"
          >
            <ul class="max-h-56 overflow-y-auto">
              <li
                v-for="category in row.categories"
                :key="category.id"
                @click="selectCategory(index, category, false)"
                class="p-2 text-sm cursor-pointer hover:bg-zinc-100 text-zinc-800"
              >
                {{ category.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mt-1 flex items-center justify-end gap-3">
        <button
          type="button"
          @click="$emit('go-back')"
          class="rounded-md bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-300"
        >
          Back
        </button>
        <button
          type="button"
          @click="saveAndNext"
          class="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-zinc-800"
        >
          Save & Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import api from "../../../../services/auth";

const props = defineProps({
  matterId: {
    type: [Number, String],
    required: true,
  },
});

const emit = defineEmits(["go-back", "save-and-next"]);

const folderRows = ref([]);

const enabledRows = computed(() =>
  folderRows.value.filter((row) => !row.isDisabled)
);
const disabledRows = computed(() =>
  folderRows.value.filter((row) => row.isDisabled)
);

const fetchCategories = async () => {
  try {
    const response = await api.get(
      "/api/firm_side/matter/document-folders/retrieve-folder-category/"
    );
    if (response.data.status) {
      return response.data.data;
    } else {
      Swal.fire({
        text: response.data.message || "Something went wrong.",
        icon: "error",
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "white",
        color: "black",
      });
      return [];
    }
  } catch (error) {
    Swal.fire({
      text: error.message || "Network error occurred.",
      icon: "error",
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "white",
      color: "black",
    });
    return [];
  }
};

const fetchExistingFolders = async () => {
  try {
    const response = await api.get(
      `/api/firm_side/matter/creation/retrieve-document-folder/?matter_id=${props.matterId}`
    );
    if (response.data.status) {
      const existingFolders = response.data.data.map((folder) => ({
        folderName: folder.name,
        isOpen: false,
        categories: folderRows.value[0]?.categories || [],
        selectedCategory: { id: null, name: folder.category },
        isDisabled: true,
      }));
      folderRows.value = [...enabledRows.value, ...existingFolders];
    }
  } catch (error) {
    Swal.fire({
      text: error.message || "Network error occurred.",
      icon: "error",
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "white",
      color: "black",
    });
  }
};

const toggleCategoryDropdown = (index, isEnabled) => {
  const rows = isEnabled ? enabledRows.value : disabledRows.value;
  const globalIndex = isEnabled ? index : enabledRows.value.length + index;
  if (!folderRows.value[globalIndex].isDisabled) {
    folderRows.value[globalIndex].isOpen =
      !folderRows.value[globalIndex].isOpen;
  }
};

const selectCategory = (index, category, isEnabled) => {
  const globalIndex = isEnabled ? index : enabledRows.value.length + index;
  folderRows.value[globalIndex].selectedCategory = category;
  folderRows.value[globalIndex].isOpen = false;
};

const addFolderRow = () => {
  folderRows.value.unshift({
    folderName: "",
    isOpen: false,
    categories: folderRows.value[0]?.categories || [],
    selectedCategory: null,
    isDisabled: false,
  });
};

const saveAndNext = async () => {
  const validRows = enabledRows.value.filter(
    (row) => row.folderName.trim() && row.selectedCategory
  );

  try {
    const payload = {
      matter: props.matterId,
      folders:
        validRows.map((row) => ({
          name: row.folderName,
          category: row.selectedCategory.id,
        })) || [],
    };

    const response = await api.post(
      "/api/firm_side/matter/creation/create-document-folder/",
      payload
    );

    if (response.data.status) {
      Swal.fire({
        text: "Document folders assigned successfully!",
        icon: "success",
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "white",
        color: "black",
      });

      await fetchExistingFolders();
      emit("save-and-next");
    } else {
      Swal.fire({
        text: response.data.message || "Something went wrong.",
        icon: "error",
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "white",
        color: "black",
      });
    }
  } catch (error) {
    Swal.fire({
      text:
        error.response?.data?.message ||
        error.message ||
        "Network error occurred.",
      icon: "error",
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "white",
      color: "black",
    });
  }
};

onMounted(async () => {
  const categories = await fetchCategories();
  folderRows.value = [
    {
      folderName: "",
      isOpen: false,
      categories: categories,
      selectedCategory: null,
      isDisabled: false,
    },
  ];
  if (props.matterId) {
    await fetchExistingFolders();
  }
});
</script>
