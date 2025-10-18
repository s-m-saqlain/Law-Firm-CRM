import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "https://law-firm.devssh.xyz",
  withCredentials: true,
});

// api.interceptors.request.use((config) => {
//   return config;
// });

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
