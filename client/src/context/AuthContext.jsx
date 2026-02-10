import { createContext, useContext, useEffect, useState } from "react";
import { API } from "../services/authApi";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const socket = io(BASE_URL, {
  autoConnect: false, // Connect manually
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await API.get("/api/auth/me");
          const userData = res.data;
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        } catch (error) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (formData) => {
    const res = await API.post("/api/auth/login", formData);
    const { user: userData, token } = res.data;
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
    toast.success("Welcome back 👋");
  };

  const signup = async (formData) => {
    const res = await API.post("/api/auth/register", formData);
    const { newUser: userData, token } = res.data;
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
    toast.success("Account created successfully 🎉");
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedUser = { ...prev, ...updatedFields };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!user || !token) return;

    // Pass token for authentication
    socket.auth = { token };
    socket.connect();
    
    socket.on("connect", () => {
      socket.emit("join", user.id)
    });

    return () => {
      socket.off("connect");
      socket.disconnect();
    };
  }, [user]);

  const logout = async () => {
    try {
      await API.post("/api/auth/logout");
    } catch (err) {
    }
    finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      // Disconnect socket on logout
      if (socket.connected) {
        socket.disconnect();
      }
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
