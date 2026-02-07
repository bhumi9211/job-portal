import { createContext, useContext, useEffect, useState } from "react";
import { API } from "../services/authApi";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

 export const socket = io(BASE_URL, {
  withCredentials: true,
  autoConnect: false,
});




const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* 🔄 Load user from localStorage on app start */
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  /* ✅ LOGIN */
  const login = async (formData) => {
    const res = await API.post("/api/auth/login", formData, {
      withCredentials: true,
    });

    const userData = res.data.user;
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    toast.success("Welcome back 👋");
  };

  /* ✅ SIGNUP */
  const signup = async (formData) => {
    const res = await API.post("/api/auth/register", formData, {
      withCredentials: true,
    });

    const userData = res.data.user;
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    toast.success("Account created successfully 🎉");
  };


  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updatedUser = { ...prev, ...updatedFields };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  useEffect(() => {
    if (!user) return;
  
    socket.connect();
  
    socket.on("connect", () => {
  
      // 🔥 emit ONLY after connect
      socket.emit("join", user.id);
    });
  
    return () => {
      socket.off("connect");
      socket.disconnect();
    };
  }, [user]);
  
  

  /* ✅ LOGOUT */
  const logout = async () => {
    try {
      await API.post("/api/auth/logout", { withCredentials: true });
    } catch (err) {}
    finally {
      localStorage.removeItem("user");
      setUser(null);
      toast.success("Logged out successfully 👋");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
