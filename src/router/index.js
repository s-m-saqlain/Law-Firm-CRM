import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import DashboardLayout from "../components/layout/DashboardLayout.vue";
import Login from "../pages/Login.vue";
import SuperAdminDashboard from "../pages/superadmin/Dashboard.vue";
import SuperAdminAgencies from "../pages/superadmin/Agencies.vue";
import SuperAdminAnalytics from "../pages/superadmin/Analytics.vue";
import SuperAdminPackages from "../pages/superadmin/Packages.vue";
import SuperAdminSettings from "../pages/superadmin/Settings.vue";

import FirmDashboard from "../pages/firm/Dashboard.vue";
import FirmSubscription from "../pages/firm/FirmSubscription.vue";
import FirmLawyer from "../pages/firm/FirmLawyer.vue";
import FirmAccount from "../pages/firm/FirmAccount.vue";
import FirmMatters from "../pages/firm/FirmMatters.vue";
import FirmTasks from "../pages/firm/FirmTasks.vue";
import FirmBills from "../pages/firm/FirmBills.vue";
import FirmClients from "../pages/firm/FirmClients.vue";

import LawyerDashboard from "../pages/lawyer/Dashboard.vue";
import LawyerMatters from "../pages/lawyer/Matters.vue";
import LawyerDocuments from "../pages/lawyer/Documents.vue";
import LawyerTasks from "../pages/lawyer/Tasks.vue";
import LawyerCoverLetter from "../pages/lawyer/CoverLetter.vue";

import ForgotPassword from "../pages/ForgotPassword.vue";

const routes = [
  // login

  { path: "/", redirect: "/login" },
  { path: "/login", name: "Login", component: Login },

  // Super Admin

  {
    path: "/super-admin",
    component: DashboardLayout,
    meta: { requiresAuth: true, role: "Super Admin" },
    children: [
      { path: "dashboard", component: SuperAdminDashboard },
      { path: "firm", component: SuperAdminAgencies },
      { path: "analytics", component: SuperAdminAnalytics },
      { path: "packages", component: SuperAdminPackages },
      { path: "settings", component: SuperAdminSettings },
      {
        path: "change-password",
        component: () => import("../pages/ChangePassword.vue"),
      },
      {
        path: "update-profile",
        component: () => import("../pages/UpdateProfile.vue"),
      },
      { path: "", redirect: "/super-admin/dashboard" },
    ],
  },

  // Firm

  {
    path: "/firm",
    component: DashboardLayout,
    meta: { requiresAuth: true, role: "Law Firm" },
    children: [
      { path: "dashboard", component: FirmDashboard },
      { path: "subscription", component: FirmSubscription },
      { path: "lawyer", component: FirmLawyer },
      { path: "account", component: FirmAccount },
      { path: "matters", component: FirmMatters },
      { path: "tasks", component: FirmTasks },
      { path: "bills", component: FirmBills },
      { path: "clients", component: FirmClients },
      {
        path: "change-password",
        component: () => import("../pages/ChangePassword.vue"),
      },
      {
        path: "update-profile",
        component: () => import("../pages/UpdateProfile.vue"),
      },
      { path: "", redirect: "/firm/dashboard" },
    ],
  },

  // lawyer

  {
    path: "/lawyer",
    component: DashboardLayout,
    meta: { requiresAuth: true, role: "Lawyer" },
    children: [
      { path: "dashboard", component: LawyerDashboard },
      { path: "matters", component: LawyerMatters },
      { path: "documents", component: LawyerDocuments },
      { path: "tasks", component: LawyerTasks },
      { path: "cover-letter", component: LawyerCoverLetter },
      {
        path: "change-password",
        component: () => import("../pages/ChangePassword.vue"),
      },
      {
        path: "update-profile",
        component: () => import("../pages/UpdateProfile.vue"),
      },
      { path: "", redirect: "/lawyer/dashboard" },
    ],
  },

  // change password

  {
    path: "/change-password",
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "ChangePassword",
        component: () => import("../pages/ChangePassword.vue"),
      },
    ],
  },

  // update profile

  {
    path: "/update-profile",
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "UpdateProfile",
        component: () => import("../pages/UpdateProfile.vue"),
      },
    ],
  },

  // forgot password

  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  authStore.initializeAuth();

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !authStore.isAuthenticated) {
    next("/login");
  } else if (to.path === "/login" && authStore.isAuthenticated) {
    const role = authStore.userRole;
    if (role === "Lawyer") next("/lawyer");
    else if (role === "Law Firm") next("/firm");
    else if (role === "Super Admin") next("/super-admin");
    else next();
  } else if (
    requiresAuth &&
    to.meta.role &&
    authStore.userRole !== to.meta.role
  ) {
    next("/login");
  } else {
    next();
  }
});

export default router;
