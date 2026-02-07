import { createContext, useContext, useState,useEffect } from "react";
import toast from "react-hot-toast";
import { API } from "../services/authApi";
import { useAuth } from "./AuthContext";
import { socket } from "./AuthContext";

const MessagesContext = createContext(null);

export const MessagesProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [chatPartners, setChatPartners] = useState([]);
  const [allChatPartners, setAllChatPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const {user} = useAuth()
  const [activeChatUserId, setActiveChatUserId] = useState(null);


  /* ================= FETCH MESSAGES ================= */
  const fetchAllMessages = async (chatUserId) => {
    try {
      setLoading(true);

      const res = await API.get(`/api/message/${chatUserId}`, {
        withCredentials: true,
      });
    

      setMessages(res.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Messages not available"
      );
    } finally {
      setLoading(false);
    }
  };



  /* ================= FETCH CHAT PARTNERS ================= */
  const fetchChatPartners = async () => {
    try {
      setLoading(true);

      const res = await API.get("/api/message/my-chats", {
        withCredentials: true,
      });

      setChatPartners(res.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Chat partners not available"
      );
    } finally {
      setLoading(false);
    }
  };
  const fetchAllChatPartners = async () => {
    try {
      setLoading(true);

      const res = await API.get("/api/message/chats", {
        withCredentials: true,
      });

      setAllChatPartners(res.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Chat partners not available"
      );
    } finally {
      setLoading(false);
    }
  };

  

  /* ================= SEND MESSAGE ================= */
//   const sendMessage = async (receiverId, { text, image }) => {
//     try {
//       const formData = new FormData();
  
//       if (text) {
//         formData.append("text", text);
//       }
  
//       if (image) {
//         formData.append("image", image);
//       }
  
//       const res = await API.post(
//         `/api/message/send/${receiverId}`,
//         formData,
//         {
//           withCredentials: true,
         
//         }
//       );
  
//       setMessages((prev) => [...prev, res.data]);
  
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || "Message send failed"
//       );
//     }
//   };

const sendMessage = async (receiverId, messageData) => {
  const tempId = `temp-${Date.now()}`;

  const optimisticMessage = {
    _id: tempId,
    senderId: user.id,
    receiverId,
    text: messageData.text,
    image: messageData.imagePreview || null, 
    createdAt: new Date().toISOString(),
    isOptimistic: true,
  };

  setMessages((prev) => [...prev, optimisticMessage]);

  try {
    const formData = new FormData();
    formData.append("text", messageData.text);

    if (messageData.image) {
      formData.append("image", messageData.image); 
    }

    const res = await API.post(
      `/api/message/send/${receiverId}`,
      formData,
      {
        withCredentials: true,
       
      }
    );

    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === tempId ? res.data : msg
      )
    );
  } catch (error) {
    setMessages((prev) =>
      prev.filter((msg) => msg._id !== tempId)
    );
    toast.error(error?.response?.data?.message || "Message failed");
  }
};
useEffect(() => {
  if (!socket) return;

  const handleNewMessage = (message) => {
    const isRelevant =
      message.senderId === activeChatUserId ||
      message.receiverId === activeChatUserId;

    if (isRelevant) {
      setMessages((prev) => [...prev, message]);
    }
  };

  socket.on("newMessage", handleNewMessage);

  return () => {
    socket.off("newMessage", handleNewMessage);
  };
}, [activeChatUserId]);


  return (
    <MessagesContext.Provider
      value={{
        messages,
        chatPartners,
        allChatPartners,
        loading,
        fetchAllMessages,
        fetchChatPartners,
        fetchAllChatPartners,
        sendMessage,
        setMessages,
        setActiveChatUserId,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => useContext(MessagesContext);
