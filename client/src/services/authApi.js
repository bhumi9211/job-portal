import axios from "axios";

 export const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true
});

// For Frontend Debugging: Axios Interceptors
API.interceptors.request.use(
  (request) => {
    console.log("Starting Request:", {
      method: request.method,
      url: request.url,
      headers: request.headers,
    });
    return request;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    console.log("Response Received:", {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("Response Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);


// export const loginApi = (data) => API.post("/auth/login", data);
// export const signupApi = (data) => API.post("/auth/signup", data);
// export const getMeApi = () => API.get("/auth/me");
