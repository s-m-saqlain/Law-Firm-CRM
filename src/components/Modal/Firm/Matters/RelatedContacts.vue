<template>
  <div>
    <LoadingSpinner :is-loading="loading" />
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-bold text-zinc-800">Related Contacts</h2>
      <div class="flex justify-between items-center gap-3">
        <button
          type="button"
          @click="addContact"
          class="flex items-center gap-2 px-4 py-2 rounded text-[#2e2b2e] hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-plus"
          >
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg>
          Add Another Contact
        </button>
      </div>
    </div>
    <div class="grid grid-cols-1 gap-5">
      <p
        class="text-sm text-[#1C5DBD] font-normal border border-[#8EC5FF] rounded-lg bg-[#EFF6FF] py-3 px-4"
      >
        Select related contacts for this matter.
      </p>
      <div
        v-for="(contact, index) in contacts"
        :key="index"
        class="grid grid-cols-1 gap-4 bg-[#F9FAFB] p-8"
      >
        <button
          type="button"
          @click="removeContact(index)"
          class="ml-auto flex items-center justify-center text-red-600 hover:bg-red-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-x"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
        <div class="relative">
          <label class="mb-1 block text-sm text-zinc-600">Contact *</label>
          <div
            @click="toggleDropdown(index)"
            class="flex items-center justify-between h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800 cursor-pointer"
            :class="{ 'border-red-500': errors[index]?.contact }"
          >
            <span>{{ selectedContacts[index]?.name || "Select contact" }}</span>
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
          <span
            v-if="errors[index]?.contact"
            class="text-red-500 text-xs mt-1"
            >{{ errors[index].contact }}</span
          >
          <div
            v-if="dropdownOpen[index]"
            class="absolute z-10 mt-1 w-full rounded-md border border-zinc-200 bg-white shadow-lg"
          >
            <div class="p-2 border-b border-zinc-200">
              <input
                v-model="searchQueries[index]"
                type="text"
                placeholder="Search contacts..."
                class="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm outline-none focus:border-zinc-400"
                @input="searchContacts(index)"
              />
            </div>
            <ul class="max-h-56 overflow-y-auto">
              <li
                v-for="contact in filteredContacts[index]"
                :key="contact.id"
                @click="selectContact(contact, index)"
                class="flex items-center gap-3 p-2 text-sm text-zinc-800"
                :class="{
                  'cursor-pointer hover:bg-zinc-100':
                    !contact.is_primary_contact,
                  'bg-gray-100 opacity-50 cursor-not-allowed':
                    contact.is_primary_contact,
                }"
              >
                <div
                  class="flex h-8 w-8 items-center justify-center rounded-full text-white font-medium"
                  :class="contact.color"
                >
                  {{ contact.name.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="text-sm font-medium text-zinc-800">
                    {{ contact.name }}
                    <span class="text-zinc-500 text-xs"
                      >({{ contact.get_role_display }})</span
                    >
                  </div>
                  <div class="text-xs text-zinc-500">
                    {{ contact.email }}
                  </div>
                </div>
              </li>
              <li
                v-if="filteredContacts[index]?.length === 0"
                class="p-3 text-sm text-center text-zinc-500"
              >
                No result found
              </li>
              <div class="border-t border-gray-200 my-1"></div>
              <div
                class="flex items-center justify-center border-t border-zinc-200 p-2 text-sm text-zinc-700 cursor-pointer hover:bg-zinc-100"
                @click="handleNewContact(index)"
              >
                + New Contact
              </div>
            </ul>
          </div>
        </div>
        <div>
          <label class="mb-1 block text-sm text-zinc-600">Relationship</label>
          <input
            v-model="contacts[index].relationship"
            type="text"
            placeholder="Enter relationship"
            class="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm placeholder-zinc-400 outline-none focus:border-zinc-400"
          />
        </div>
        <div class="flex items-center gap-2">
          <input
            v-model="contacts[index].bill_recipient"
            type="checkbox"
            class="h-4 w-4 text-zinc-600"
          />
          <label class="text-sm text-zinc-600">Bill Recipient</label>
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
import LoadingSpinner from "../../../../components/LoadingSpinner.vue";

const props = defineProps({
  matterId: {
    type: [Number, String],
    required: true,
  },
});

const emit = defineEmits(["go-back", "save-and-next", "open-new-contact"]);
const loading = ref(false);

const contacts = ref([]);
const contactOptions = ref([]);
const selectedContacts = ref([]);
const dropdownOpen = ref([]);
const searchQueries = ref([]);
const errors = ref([]);
const newContactIndex = ref(null);

const getRandomColor = () => {
  const colors = [
    "bg-orange-500",
    "bg-neutral-800",
    "bg-amber-500",
    "bg-blue-500",
    "bg-green-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const fetchContacts = async (query = "", index) => {
  loading.value = true;
  try {
    const url = `/api/firm_side/matter/creation/search-contacts-with-matter-info?matter_id=${
      props.matterId
    }${query ? `&query=${encodeURIComponent(query)}` : ""}`;

    const response = await api.get(url);
    if (response.data.status) {
      const rawData = response.data.data;

      contactOptions.value = rawData.map((contact) => ({
        id: contact.id,
        name: `${contact.first_name || ""} ${contact.last_name || ""}`.trim(),
        get_role_display: contact.get_role_display || "Person",
        email: contact.email || "",
        phone_number: contact.phone_number || "",
        is_primary_contact: contact.is_primary_contact || false,
        is_related_contact: contact.is_related_contact || false,
        color: getRandomColor(),
      }));
    } else {
      contactOptions.value = [];
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
    contactOptions.value = [];
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
  } finally {
    loading.value = false;
  }
};

const fetchRelatedContacts = async () => {
  loading.value = true;
  try {
    const response = await api.get(
      `/api/firm_side/matter/creation/retrieve-related-contact/?matter_id=${props.matterId}`
    );
    if (response.data.status) {
      contacts.value = response.data.data.map((contact) => ({
        contact_id: contact.contact,
        relationship: contact.relationship || "",
        bill_recipient: contact.bill_recipient || false,
      }));

      selectedContacts.value = response.data.data.map((contact) => {
        const info = contact.contact_info;
        return {
          id: info.id,
          name: `${info.first_name || ""} ${info.last_name || ""}`.trim(),
          get_role_display: info.get_role_display || "Person",
          email: info.email || "",
          phone_number: info.phone_number || "",
          is_primary_contact: info.is_primary_contact || false,
          is_related_contact: info.is_related_contact || false,
          color: getRandomColor(),
        };
      });

      dropdownOpen.value = contacts.value.map(() => false);
      searchQueries.value = contacts.value.map(() => "");
      errors.value = contacts.value.map(() => ({ contact: "" }));
    } else {
      if (contacts.value.length === 0) {
        addContact();
      }
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
    if (contacts.value.length === 0) {
      addContact();
    }
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
  } finally {
    loading.value = false;
  }
};

const toggleDropdown = (index) => {
  const newDropdownOpen = [...dropdownOpen.value];
  newDropdownOpen[index] = !newDropdownOpen[index];
  dropdownOpen.value = newDropdownOpen;

  if (newDropdownOpen[index]) {
    searchQueries.value[index] = "";
    fetchContacts("", index);
  }
};

const searchContacts = (index) => {
  fetchContacts(searchQueries.value[index], index);
};

const filteredContacts = computed(() => {
  return contacts.value.map((_, index) => {
    if (!searchQueries.value[index]) return contactOptions.value;
    return contactOptions.value.filter(
      (contact) =>
        contact.name
          .toLowerCase()
          .includes(searchQueries.value[index].toLowerCase()) ||
        contact.email
          .toLowerCase()
          .includes(searchQueries.value[index].toLowerCase())
    );
  });
});

const selectContact = (contact, index) => {
  if (contact.is_primary_contact) return;
  selectedContacts.value[index] = contact;
  contacts.value[index].contact_id = contact.id;
  dropdownOpen.value[index] = false;
  validateField(index);
};

const addContact = () => {
  contacts.value.push({
    contact_id: "",
    relationship: "",
    bill_recipient: false,
  });
  selectedContacts.value.push(null);
  dropdownOpen.value.push(false);
  searchQueries.value.push("");
  errors.value.push({ contact: "" });
};

const removeContact = (index) => {
  contacts.value.splice(index, 1);
  selectedContacts.value.splice(index, 1);
  dropdownOpen.value.splice(index, 1);
  searchQueries.value.splice(index, 1);
  errors.value.splice(index, 1);
};

const handleNewContact = (index) => {
  newContactIndex.value = index;
  dropdownOpen.value[index] = false;
  emit("open-new-contact");
};

const handleContactAdded = async (newContact) => {
  const contact = {
    id: newContact.id,
    name: `${newContact.first_name || ""} ${newContact.last_name || ""}`.trim(),
    get_role_display: newContact.get_role_display || "Person",
    email: newContact.email || "",
    phone_number: newContact.phone_number || "",
    is_primary_contact: false,
    is_related_contact: false,
    color: getRandomColor(),
  };
  contactOptions.value.push(contact);
  // if (newContactIndex.value !== null) {
  //   selectedContacts.value[newContactIndex.value] = contact;
  //   contacts.value[newContactIndex.value].contact_id = contact.id;
  //   validateField(newContactIndex.value);
  // }
  await fetchContacts("", newContactIndex.value);
  newContactIndex.value = null;
};

const validateField = (index) => {
  const newErrors = [...errors.value];
  newErrors[index] = newErrors[index] || {};
  newErrors[index].contact = contacts.value[index].contact_id
    ? ""
    : "Contact is required";
  errors.value = newErrors;
};

const validateForm = () => {
  errors.value = contacts.value.map((contact) => ({
    contact: contact.contact_id ? "" : "Contact is required",
  }));
  return errors.value.every((error) => error.contact === "");
};

const saveAndNext = async () => {
  if (!validateForm()) {
    Swal.fire({
      text: "Please select a contact for each entry.",
      icon: "error",
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "white",
      color: "black",
    });
    return;
  }
  loading.value = true;
  try {
    const payload = {
      matter_id: props.matterId,
      contacts: contacts.value.map((contact) => ({
        contact: contact.contact_id,
        relationship: contact.relationship,
        bill_recipient: contact.bill_recipient,
      })),
    };

    const response = await api.post(
      "/api/firm_side/matter/creation/set-related-contact/",
      payload
    );

    if (response.data.status) {
      Swal.fire({
        text: "Related contacts saved successfully!",
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
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchContacts();
  if (props.matterId) {
    await fetchRelatedContacts();
  } else {
    addContact();
  }
});

defineExpose({ handleContactAdded });
</script>
