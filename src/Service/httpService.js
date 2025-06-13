import axios from "axios";

// Authenticated Axios instance
const axiosInstance = axios.create({
  baseURL: localStorage.getItem("backendUrl"),
  headers: {
    "Content-Type": "application/json",
    "embedded-static-token": import.meta.env.VITE_EMBEDDED_STATIC_TOKEN,
  },
});

// Unauthenticated Axios instance
const axiosInstanceNoAuth = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add request/response interceptors if needed
axiosInstanceNoAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally (e.g., log or throw)
    return Promise.reject(error);
  }
);

// Authenticated requests
export const getRequest = (url) => axiosInstance.get(url);
export const postRequest = (url, data) => axiosInstance.post(url, data);
export const putRequest = (url, data) => axiosInstance.put(url, data);
export const deleteRequest = (url) => axiosInstance.delete(url);

// Unauthenticated POST request
export const postWithoutAuth = (url, data) => axiosInstanceNoAuth.post(url, data);