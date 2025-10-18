<template>
  <div>
    <h2 class="mb-4 text-lg font-bold text-zinc-800">Task Lists</h2>
    <div class="grid grid-cols-1 gap-5">
      <p
        class="text-sm text-[#1C5DBD] font-normal border border-[#8EC5FF] rounded-lg bg-[#EFF6FF] py-3 px-4"
      >
        Configure task lists for this matter.
      </p>

      <div>
        <button
          @click="addTaskListDropdown"
          class="rounded-md bg-zinc-700 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-600"
        >
          + Add Task List
        </button>
      </div>

      <div
        v-for="(dropdown, index) in taskListDropdowns"
        :key="index"
        class="relative"
      >
        <label class="mb-1 block text-sm text-zinc-600">Task List *</label>
        <div
          @click="toggleTaskListDropdown(index)"
          class="flex items-center justify-between h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800 cursor-pointer"
          :class="{ 'pointer-events-none opacity-50': dropdown.isDisabled }"
        >
          <span>{{ dropdown.selected?.title || "Select task list" }}</span>
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
          v-if="dropdown.isOpen && !dropdown.isDisabled"
          class="absolute z-10 mt-1 w-full rounded-md border border-zinc-200 bg-white shadow-lg"
        >
          <div class="p-2 border-b border-zinc-200">
            <input
              v-model="dropdown.search"
              type="text"
              placeholder="Search task list..."
              class="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm outline-none focus:border-zinc-400"
              @input="searchTaskLists(index)"
            />
          </div>
          <ul class="max-h-56 overflow-y-auto">
            <li
              v-for="taskList in dropdown.filteredTaskLists"
              :key="taskList.id"
              @click="selectTaskList(index, taskList)"
              class="p-2 text-sm cursor-pointer hover:bg-zinc-100 text-zinc-800"
            >
              {{ taskList.title }}
            </li>
            <li
              v-if="dropdown.search && dropdown.filteredTaskLists.length === 0"
              class="p-3 text-sm text-center text-zinc-500"
            >
              No result found
            </li>
          </ul>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <input
          v-model="isNotifyAssignees"
          type="checkbox"
          class="h-4 w-4 text-zinc-600 border-zinc-300 rounded focus:ring-zinc-400"
        />
        <label class="text-sm text-zinc-600"
          >Notify assignees when these tasks are created</label
        >
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
import { ref, onMounted } from "vue";
import api from "../../../../services/auth";
import Swal from "sweetalert2";

const props = defineProps({
  matterId: {
    type: [Number, String],
    required: true,
  },
});

const emit = defineEmits(["go-back", "save-and-next"]);

const taskListDropdowns = ref([]);
const isNotifyAssignees = ref(false);

const fetchTaskLists = async (index, query = "") => {
  try {
    const url = `/api/firm_side/task/list-manage/filter?page=1&page_size=10${
      query ? `&title=${encodeURIComponent(query)}` : ""
    }`;
    const response = await api.get(url);
    if (response.data.status) {
      taskListDropdowns.value[index].taskLists = response.data.data;
      taskListDropdowns.value[index].filteredTaskLists = response.data.data;
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
      taskListDropdowns.value[index].taskLists = [];
      taskListDropdowns.value[index].filteredTaskLists = [];
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
    taskListDropdowns.value[index].taskLists = [];
    taskListDropdowns.value[index].filteredTaskLists = [];
  }
};

const fetchAssignedTaskLists = async () => {
  try {
    const response = await api.get(
      `/api/firm_side/matter/creation/retrieve-task-list/?matter_id=${props.matterId}`
    );
    taskListDropdowns.value = [];
    taskListDropdowns.value.push({
      isOpen: false,
      search: "",
      taskLists: [],
      filteredTaskLists: [],
      selected: null,
      isDisabled: false,
    });
    if (response.data.status && response.data.data.length > 0) {
      taskListDropdowns.value.push(
        ...response.data.data.map((taskList) => ({
          isOpen: false,
          search: "",
          taskLists: [],
          filteredTaskLists: [],
          selected: taskList,
          isDisabled: true,
        }))
      );
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
    taskListDropdowns.value = [
      {
        isOpen: false,
        search: "",
        taskLists: [],
        filteredTaskLists: [],
        selected: null,
        isDisabled: false,
      },
    ];
  }
};

const toggleTaskListDropdown = (index) => {
  if (!taskListDropdowns.value[index].isDisabled) {
    taskListDropdowns.value[index].isOpen =
      !taskListDropdowns.value[index].isOpen;
    if (taskListDropdowns.value[index].isOpen) {
      taskListDropdowns.value[index].search = "";
      fetchTaskLists(index);
    }
  }
};

const searchTaskLists = (index) => {
  const query = taskListDropdowns.value[index].search.trim();
  fetchTaskLists(index, query);
};

const selectTaskList = (index, taskList) => {
  taskListDropdowns.value[index].selected = taskList;
  taskListDropdowns.value[index].isOpen = false;
};

const addTaskListDropdown = () => {
  taskListDropdowns.value.unshift({
    isOpen: false,
    search: "",
    taskLists: [],
    filteredTaskLists: [],
    selected: null,
    isDisabled: false,
  });
};

const saveAndNext = async () => {
  const taskListIds = taskListDropdowns.value
    .filter((dropdown) => dropdown.selected && !dropdown.isDisabled)
    .map((dropdown) => dropdown.selected.id);

  // if (taskListIds.length === 0) {
  //   Swal.fire({
  //     text: "Please select at least one task list.",
  //     icon: "error",
  //     toast: true,
  //     position: "bottom-end",
  //     showConfirmButton: false,
  //     timer: 3000,
  //     timerProgressBar: true,
  //     background: "white",
  //     color: "black",
  //   });
  //   return;
  // }

  try {
    const payload = {
      matter_id: props.matterId,
      is_notify_assignes: isNotifyAssignees.value,
      task_list: taskListIds,
    };
    const response = await api.post(
      "/api/firm_side/matter/creation/assign-task-list/",
      payload
    );
    if (response.data.status) {
      Swal.fire({
        text: "Task lists assigned successfully!",
        icon: "success",
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "white",
        color: "black",
      });
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

onMounted(() => {
  fetchAssignedTaskLists();
});
</script>
