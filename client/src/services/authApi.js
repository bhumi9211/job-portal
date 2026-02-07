import axios from "axios";

 export const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// export const loginApi = (data) => API.post("/auth/login", data);
// export const signupApi = (data) => API.post("/auth/signup", data);
// export const getMeApi = () => API.get("/auth/me");
