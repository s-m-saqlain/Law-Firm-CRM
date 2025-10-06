import axios from "axios";

const api = axios.create({
  baseURL: "https://law-firm.devssh.xyz",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  return config;
});

export default api;
