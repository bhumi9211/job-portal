import axios from "axios";

 export const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  // withCredentials: true // No longer needed for localStorage auth
});

// For Frontend Debugging: Axios Interceptors
API.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem("token");
    if (token) {
      request.headers["Authorization"] = `Bearer ${token}`;
    }

   
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
  
    return response;
  },
  (error) => {
 
    return Promise.reject(error);
  }
);


// export const loginApi = (data) => API.post("/auth/login", data);
// export const signupApi = (data) => API.post("/auth/signup", data);
// export const getMeApi = () => API.get("/auth/me");
