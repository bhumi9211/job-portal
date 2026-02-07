import { createContext, useContext, useEffect, useState } from "react";
import { API } from "../services/authApi";
import toast from "react-hot-toast";

const ApplicationContext = createContext(null);

export const ApplicationProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied,setApplied] = useState(false)

  const handleApplySubmit = async(e,postId) => {
    e.preventDefault();
    if (!resumeFile) {
      alert("Please upload your resume!");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData()
      formData.append("resume",resumeFile)
      const res = await API.post(`/api/application/${postId}/apply`,formData, {withCredentials: true})
      setApplied(true);
      closeApplyModal();
      toast.success("Applied successfully 🎉")
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Something went wrong..Try again later"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ApplicationContext.Provider
      value={{
        handleApplySubmit,
        setApplied,
        applied,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplication = () => useContext(ApplicationContext);
