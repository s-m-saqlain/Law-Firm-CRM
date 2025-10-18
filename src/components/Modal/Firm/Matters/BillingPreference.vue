<template>
  <div>
    <h2 class="mb-4 text-lg font-bold text-zinc-800">Billing Preference</h2>
    <div class="grid grid-cols-1 gap-5">
      <p
        class="text-sm text-[#1C5DBD] font-normal border border-[#8EC5FF] rounded-lg bg-[#EFF6FF] py-3 px-4"
      >
        Configure billing preferences for this matter.
      </p>

      <div class="relative">
        <label class="mb-1 block text-sm text-zinc-600">Billing Method *</label>
        <div
          @click="toggleBillingMethodDropdown"
          class="flex items-center justify-between h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800 cursor-pointer"
        >
          <span>{{ selectedBillingMethod || "Select billing method" }}</span>
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
          v-if="billingMethodOpen"
          class="absolute z-10 mt-1 w-full rounded-md border border-zinc-200 bg-white shadow-lg"
        >
          <ul class="max-h-56 overflow-y-auto">
            <li
              v-for="method in billingMethods"
              :key="method"
              @click="selectBillingMethod(method)"
              class="p-2 text-sm cursor-pointer hover:bg-zinc-100 text-zinc-800"
            >
              {{ method }}
            </li>
          </ul>
        </div>
        <span v-if="errors.billingMethod" class="text-red-500 text-xs mt-1">{{
          errors.billingMethod
        }}</span>
      </div>

      <div v-if="selectedBillingMethod === 'Fixed Fee'">
        <label class="mb-1 block text-sm text-zinc-600">Final Amount *</label>
        <input
          v-model.number="form.finalAmount"
          type="number"
          placeholder="Enter final amount"
          class="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm placeholder-zinc-400 outline-none focus:border-zinc-400"
          :class="{ 'border-red-500': errors.finalAmount }"
          @input="validateField('finalAmount')"
        />
        <span v-if="errors.finalAmount" class="text-red-500 text-xs mt-1">{{
          errors.finalAmount
        }}</span>
      </div>

      <div v-else>
        <label class="flex items-center gap-2 text-sm text-zinc-600">
          <input
            v-model="form.includeBudget"
            type="checkbox"
            class="h-4 w-4 rounded border-zinc-300 text-zinc-600 focus:ring-zinc-400"
            @change="validateField('budgetAmount')"
          />
          Include budget
        </label>
        <div v-if="form.includeBudget" class="mt-4">
          <label class="mb-1 block text-sm text-zinc-600"
            >Budget Amount *</label
          >
          <input
            v-model.number="form.budgetAmount"
            type="number"
            placeholder="Enter budget amount"
            class="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm placeholder-zinc-400 outline-none focus:border-zinc-400"
            :class="{ 'border-red-500': errors.budgetAmount }"
            @input="validateField('budgetAmount')"
          />
          <span v-if="errors.budgetAmount" class="text-red-500 text-xs mt-1">{{
            errors.budgetAmount
          }}</span>
        </div>

        <div v-if="form.includeBudget" class="mt-4">
          <label class="flex items-center gap-2 text-sm text-zinc-600">
            <input
              v-model="form.includeExpenseInBudget"
              type="checkbox"
              class="h-4 w-4 rounded border-zinc-300 text-zinc-600 focus:ring-zinc-400"
            />
            Include expense in budget
          </label>
        </div>
      </div>

      <div>
        <label class="flex items-center gap-2 text-sm text-zinc-600">
          <input
            v-model="form.isSplitInvoice"
            type="checkbox"
            class="h-4 w-4 rounded border-zinc-300 text-zinc-600 focus:ring-zinc-400"
            @change="validateForm"
          />
          Split the invoices for this matter
        </label>
        <div v-if="form.isSplitInvoice" class="mt-4 space-y-4">
          <div
            v-for="(payer, index) in form.payers"
            :key="index"
            class="grid grid-cols-2 gap-4"
          >
            <div class="relative">
              <label class="mb-1 block text-sm text-zinc-600"
                >Select Client *</label
              >
              <div
                @click="toggleClientDropdown(index)"
                class="flex items-center justify-between h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800 cursor-pointer"
                :class="{ 'border-red-500': errors.payers[index]?.client }"
              >
                <span>{{ payer.selectedClient?.name || "Select client" }}</span>
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
                v-if="errors.payers[index]?.client"
                class="text-red-500 text-xs mt-1"
                >{{ errors.payers[index].client }}</span
              >
              <div
                v-if="payer.clientOpen"
                class="absolute z-10 mt-1 w-full rounded-md border border-zinc-200 bg-white shadow-lg"
              >
                <div class="p-2 border-b border-zinc-200">
                  <input
                    v-model="payer.clientSearch"
                    type="text"
                    placeholder="Search client..."
                    class="w-full rounded-md border border-zinc-300 px-2 py-1 text-sm outline-none focus:border-zinc-400"
                    @input="searchClients(index)"
                  />
                </div>
                <ul class="max-h-56 overflow-y-auto">
                  <li
                    v-for="client in payer.filteredClients"
                    :key="client.email || client.id"
                    @click="selectClient(index, client)"
                    class="flex items-center gap-3 p-2 cursor-pointer hover:bg-zinc-100"
                  >
                    <div
                      class="flex h-8 w-8 items-center justify-center rounded-full text-white font-medium"
                      :class="client.color"
                    >
                      {{
                        client.name ? client.name.charAt(0).toUpperCase() : "?"
                      }}
                    </div>
                    <div>
                      <div class="text-sm font-medium text-zinc-800">
                        {{ client.name || "Unnamed Client" }}
                        <span class="text-zinc-500 text-xs"
                          >({{ client.type || "Unknown" }})</span
                        >
                      </div>
                      <div class="text-xs text-zinc-500">
                        {{ client.email || "No email" }}
                      </div>
                    </div>
                  </li>
                  <li
                    v-if="payer.filteredClients.length === 0"
                    class="p-3 text-sm text-center text-zinc-500"
                  >
                    No result found
                  </li>
                </ul>
                <div
                  @click="openNewContactModal(index)"
                  class="flex items-center justify-center border-t border-zinc-200 p-2 text-sm text-zinc-700 cursor-pointer hover:bg-zinc-100"
                >
                  + New Contact
                </div>
              </div>
            </div>

            <div>
              <label class="mb-1 block text-sm text-zinc-600"
                >Invoice Portion *</label
              >
              <input
                v-model.number="payer.invoicePortion"
                type="number"
                placeholder="Enter portion"
                class="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm placeholder-zinc-400 outline-none focus:border-zinc-400"
                :class="{
                  'border-red-500': errors.payers[index]?.invoicePortion,
                }"
                @input="validatePayerField(index, 'invoicePortion')"
              />
              <span
                v-if="errors.payers[index]?.invoicePortion"
                class="text-red-500 text-xs mt-1"
                >{{ errors.payers[index].invoicePortion }}</span
              >
            </div>
          </div>

          <div>
            <button
              @click="addPayer"
              class="rounded-md bg-[#E2F3FF] px-4 py-2 text-sm text-[#0761CA]"
            >
              + Add payer
            </button>
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

      <NewContactModal
        :is-open="isNewContactModalOpen"
        @close="closeNewContactModal"
        @contact-added="handleContactAdded"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import Swal from "sweetalert2";
import api from "../../../../services/auth";
import NewContactModal from "../../../../components/Modal/Firm/Matters/NewContact/NewContactModal.vue";

const props = defineProps({
  matterId: {
    type: [Number, String],
    required: true,
  },
});

const emit = defineEmits(["go-back", "save-and-next"]);

const form = reactive({
  billingMethod: null,
  includeBudget: false,
  budgetAmount: null,
  includeExpenseInBudget: false,
  isSplitInvoice: false,
  payers: [],
  finalAmount: null,
});

const errors = reactive({
  billingMethod: "",
  budgetAmount: "",
  finalAmount: "",
  payers: [],
});

const billingMethodOpen = ref(false);
const selectedBillingMethod = ref(null);
const billingMethods = ref(["Hourly", "Fixed Fee", "Contingency Fee"]);
const clients = ref([]);
const isNewContactModalOpen = ref(false);
const activePayerIndex = ref(null);

const fetchBillingPreferences = async () => {
  try {
    const billingResponse = await api.get(
      `/api/firm_side/matter/creation/retrieve-billing-preference/?matter_id=${props.matterId}`
    );

    if (billingResponse.data.status) {
      const data = billingResponse.data.data;

      let contacts = [];
      try {
        const contactsResponse = await api.get(
          `/api/firm_side/matter/creation/search-contacts-with-matter-info/?matter_id=${props.matterId}`
        );
        if (contactsResponse.data.status) {
          contacts = contactsResponse.data.data;
        } else {
          Swal.fire({
            title: "Failed to Fetch Contacts",
            text: contactsResponse.data.message || "Unable to fetch contacts.",
            icon: "error",
            confirmButtonColor: "#18181b",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error Fetching Contacts",
          text:
            error.response?.data?.message ||
            error.message ||
            "Network error occurred.",
          icon: "error",
          confirmButtonColor: "#18181b",
        });
      }

      form.billingMethod = data.billing_method_name || null;
      selectedBillingMethod.value = mapBillingMethodToDisplay(
        data.billing_method_name || null
      );
      form.includeBudget = !!data.budget_amount;
      form.budgetAmount = data.budget_amount
        ? Number(data.budget_amount)
        : null;
      form.finalAmount = data.fixed_fee_amount
        ? Number(data.fixed_fee_amount)
        : null;
      form.includeExpenseInBudget = data.include_expense_in_budget || false;
      form.isSplitInvoice = data.is_split_invoice || false;

      form.payers = Array.isArray(data.recipients)
        ? data.recipients.map((recipient, index) => {
            const contact =
              contacts.find((c) => c.id === recipient.contact_id) || {};
            const firstName = contact.first_name || "";
            const lastName = contact.last_name || "";
            let name = `${firstName} ${lastName}`.trim();
            if (!name) {
              name =
                contact.email || recipient.contact_id || `Client ${index + 1}`;
            }
            return {
              selectedClient: {
                id: recipient.contact_id || null,
                name: name,
                type: contact.get_role_display || contact.role || "Unknown",
                email: contact.email || "",
                phone_number: contact.phone_number || "",
                color: getRandomColor(),
              },
              clientOpen: false,
              clientSearch: "",
              filteredClients: [],
              invoicePortion: Number(recipient.invoice_portion) || null,
            };
          })
        : [];
      errors.payers = form.payers.map(() => ({
        client: "",
        invoicePortion: "",
      }));
    } else {
      Swal.fire({
        title: "Failed to Fetch Billing Preferences",
        text: billingResponse.data.message || "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#18181b",
      });
    }
  } catch (error) {
    Swal.fire({
      title: "Error Fetching Billing Preferences",
      text:
        error.response?.data?.message ||
        error.message ||
        "Network error occurred.",
      icon: "error",
      confirmButtonColor: "#18181b",
    });
  }
};

const fetchClients = async (index, query = "") => {
  try {
    const url = `/api/firm_side/matter/creation/search-contacts-with-matter-info/?matter_id=${
      props.matterId
    }${query ? `&query=${encodeURIComponent(query)}` : ""}`;
    const response = await api.get(url);
    if (response.data.status) {
      clients.value = response.data.data.map((client) => {
        const firstName = client.first_name || "";
        const lastName = client.last_name || "";
        let name = `${firstName} ${lastName}`.trim();
        if (!name) {
          name = client.email || client.id || "Unnamed Client";
        }
        return {
          id: client.id,
          name: name,
          type: client.get_role_display || client.role || "Unknown",
          email: client.email || "",
          phone_number: client.phone_number || "",
          color: getRandomColor(),
        };
      });
      form.payers[index].filteredClients = clients.value;
    } else {
      Swal.fire({
        title: "Failed to Fetch Clients",
        text: response.data.message || "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#18181b",
      });
      form.payers[index].filteredClients = [];
    }
  } catch (error) {
    Swal.fire({
      title: "Error Fetching Clients",
      text: error.message || "Network error occurred.",
      icon: "error",
      confirmButtonColor: "#18181b",
    });
    form.payers[index].filteredClients = [];
  }
};

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

const mapBillingMethodToApi = (method) => {
  const mapping = {
    Hourly: "HOURLY",
    "Fixed Fee": "FIXED_FEE",
    "Contingency Fee": "CONTINGENCY_FEE",
  };
  return mapping[method] || method;
};

const mapBillingMethodToDisplay = (method) => {
  if (!method) return "Select billing method";
  const mapping = {
    HOURLY: "Hourly",
    FIXED_FEE: "Fixed Fee",
    CONTINGENCY_FEE: "Contingency Fee",
  };
  return mapping[method] || method;
};

const toggleBillingMethodDropdown = () => {
  billingMethodOpen.value = !billingMethodOpen.value;
};

const selectBillingMethod = (method) => {
  selectedBillingMethod.value = method;
  form.billingMethod = mapBillingMethodToApi(method);
  billingMethodOpen.value = false;
  validateField("billingMethod");
  if (method === "Fixed Fee") {
    form.includeBudget = false;
    form.budgetAmount = null;
    form.includeExpenseInBudget = false;
  }
};

const toggleClientDropdown = (index) => {
  form.payers[index].clientOpen = !form.payers[index].clientOpen;
  if (form.payers[index].clientOpen) {
    form.payers[index].clientSearch = "";
    fetchClients(index);
  }
};

const searchClients = (index) => {
  fetchClients(index, form.payers[index].clientSearch);
};

const selectClient = (index, client) => {
  form.payers[index].selectedClient = client;
  form.payers[index].clientOpen = false;
  validatePayerField(index, "client");
};

const openNewContactModal = (index) => {
  activePayerIndex.value = index;
  form.payers[index].clientOpen = false;
  isNewContactModalOpen.value = true;
};

const closeNewContactModal = () => {
  isNewContactModalOpen.value = false;
  activePayerIndex.value = null;
};

const handleContactAdded = (newContact) => {
  const index = activePayerIndex.value;
  const firstName = newContact.first_name || "";
  const lastName = newContact.last_name || "";
  let name = `${firstName} ${lastName}`.trim();
  if (!name) {
    name = newContact.email || newContact.id || "Unnamed Client";
  }
  const newClient = {
    id: newContact.id,
    name: name,
    type: newContact.get_role_display || newContact.role || "Unknown",
    email: newContact.email || "",
    phone_number: newContact.phone_number || "",
    color: getRandomColor(),
  };
  clients.value.push(newClient);
  if (index !== null) {
    form.payers[index].filteredClients = [...clients.value];
    selectClient(index, newClient);
  }
  isNewContactModalOpen.value = false;
};

const addPayer = () => {
  form.payers.push({
    selectedClient: null,
    clientOpen: false,
    clientSearch: "",
    filteredClients: [...clients.value],
    invoicePortion: null,
  });
  errors.payers.push({ client: "", invoicePortion: "" });
  validateForm();
};

const validateField = (field) => {
  switch (field) {
    case "billingMethod":
      errors.billingMethod = form.billingMethod
        ? ""
        : "Billing method is required";
      break;
    case "budgetAmount":
      errors.budgetAmount =
        !form.includeBudget ||
        selectedBillingMethod.value === "Fixed Fee" ||
        (form.budgetAmount !== null &&
          form.budgetAmount !== "" &&
          form.budgetAmount >= 0)
          ? ""
          : "Budget amount is required and must be a non-negative number";
      break;
    case "finalAmount":
      errors.finalAmount =
        selectedBillingMethod.value !== "Fixed Fee" ||
        (form.finalAmount !== null &&
          form.finalAmount !== "" &&
          form.finalAmount >= 0)
          ? ""
          : "Final amount is required and must be a non-negative number";
      break;
  }
};

const validatePayerField = (index, field) => {
  if (!errors.payers[index])
    errors.payers[index] = { client: "", invoicePortion: "" };
  switch (field) {
    case "client":
      errors.payers[index].client = form.payers[index].selectedClient
        ? ""
        : "Client is required";
      break;
    case "invoicePortion":
      errors.payers[index].invoicePortion =
        form.payers[index].invoicePortion !== null &&
        form.payers[index].invoicePortion !== "" &&
        form.payers[index].invoicePortion >= 0
          ? ""
          : "Invoice portion is required and must be a non-negative number";
      break;
  }
};

const validateForm = () => {
  validateField("billingMethod");
  if (selectedBillingMethod.value === "Fixed Fee") {
    validateField("finalAmount");
  } else {
    validateField("budgetAmount");
  }
  if (form.isSplitInvoice) {
    form.payers.forEach((payer, index) => {
      validatePayerField(index, "client");
      validatePayerField(index, "invoicePortion");
    });
  } else {
    errors.payers = form.payers.map(() => ({ client: "", invoicePortion: "" }));
  }
  const isValid =
    errors.billingMethod === "" &&
    errors.budgetAmount === "" &&
    errors.finalAmount === "" &&
    (!form.isSplitInvoice ||
      errors.payers.every((payer) =>
        Object.values(payer).every((error) => error === "")
      ));
  return isValid;
};

const saveAndNext = async () => {
  if (!validateForm()) {
    const errorMessages = [];
    if (errors.billingMethod)
      errorMessages.push(`Billing Method: ${errors.billingMethod}`);
    if (errors.budgetAmount)
      errorMessages.push(`Budget Amount: ${errors.budgetAmount}`);
    if (errors.finalAmount)
      errorMessages.push(`Final Amount: ${errors.finalAmount}`);
    if (form.isSplitInvoice) {
      errors.payers.forEach((payer, index) => {
        const payerErrors = [];
        if (payer.client) payerErrors.push(`Client: ${payer.client}`);
        if (payer.invoicePortion)
          payerErrors.push(`Invoice Portion: ${payer.invoicePortion}`);
        if (payerErrors.length > 0) {
          errorMessages.push(`Payer ${index + 1}: ${payerErrors.join(", ")}`);
        }
      });
    }
    Swal.fire({
      text:
        errorMessages.length > 0
          ? errorMessages.join("; ")
          : "Please check all required fields",
      icon: "warning",
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

  try {
    const payload = {
      matter_id: String(props.matterId),
      billing_method: form.billingMethod,
      is_method_change_allowed: true,
      budget_amount: null,
      include_expense_in_budget:
        form.billingMethod === "HOURLY" ? form.includeExpenseInBudget : false,
      fixed_fee_amount: null,
      contingency_rate: null,
      is_split_invoice: form.isSplitInvoice,
      recipients: [],
    };

    if (form.billingMethod === "FIXED_FEE") {
      payload.fixed_fee_amount = form.finalAmount
        ? Number(form.finalAmount).toFixed(2)
        : null;
    } else if (form.billingMethod === "HOURLY") {
      if (
        form.includeBudget &&
        form.budgetAmount !== null &&
        form.budgetAmount !== ""
      ) {
        payload.budget_amount = Number(form.budgetAmount).toFixed(2);
      }
    }

    if (form.isSplitInvoice) {
      payload.recipients = form.payers.map((payer) => ({
        contact_id: String(payer.selectedClient?.id),
        invoice_portion: Number(payer.invoicePortion),
      }));
    }

    const response = await api.post(
      "/api/firm_side/matter/creation/set-billing-preference/",
      payload
    );

    if (response.data.status) {
      Swal.fire({
        text: "Billing preferences saved successfully!",
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

onMounted(async () => {
  await fetchBillingPreferences();
});
</script>
