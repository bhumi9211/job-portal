import { useEffect, useState, useRef, useCallback } from "react";
import { HiArrowLeft, HiSearch } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import { useMessages } from "../../context/MessageContext";
import { useAuth } from "../../context/AuthContext";
import { API } from "../../services/authApi";
import toast from "react-hot-toast";

const ProfessorMessages = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const bottomRef = useRef(null);
  const [image, setImage] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedChat, setSelectedChat] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const {
    chatPartners,
    fetchChatPartners,
    allChatPartners,
    fetchAllChatPartners,
    sendMessage,
    messages,
    fetchAllMessages,
    setActiveChatUserId
  } = useMessages();
  const { user } = useAuth();
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);


  useEffect(() => {
    fetchChatPartners();
    fetchAllChatPartners();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!selectedChat) return;
    fetchAllMessages(selectedChat._id);
  }, [selectedChat]);


const searchUsers = useCallback(async (query) => {
  
  try {
    if (!query || query.length < 2) {
      setSearchedUsers([]);
      return;
    }
    
    setSearchLoading(true);
    const params = new URLSearchParams({ search: query });
    const fullUrl = `/api/message/search?${params}`;
  

    const res = await API.get(fullUrl ,{ withCredentials: true });
  
    
    const users = res.data.users || [];
   
    
    setSearchedUsers(users);
  } catch (err) {
   
    toast.error("Search failed"); 
    setSearchedUsers([]);
  } finally {
   
    setSearchLoading(false);
  }
}, [user?.id]);


useEffect(() => {
  
  if (!search.trim()) {
    setSearchedUsers([]);
    return;
  }
  
  
  const timer = setTimeout(() => {
    searchUsers(search.trim());
  }, 400);
  
  return () => {
    clearTimeout(timer);
  };
}, [search, searchUsers]);

const source = search.trim()
? searchedUsers
: activeTab === "all"
? allChatPartners
: chatPartners;

useEffect(() => {
  // console.log('📂 Source changed:', { 
  //   search: search.trim(), 
  //   searchedUsers: searchedUsers.length, 
  //   activeTab, 
  //   sourceLength: source.length 
  // }); // DEBUG
}, [source, search, searchedUsers.length, activeTab]);


 

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() && !imagePreview) return;

    sendMessage(selectedChat._id, {
      text: message.trim(),
      image: image,
    });
    setMessage("");
    setImagePreview("");
    setImage(null); // ✅ FIXED
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
  
    setImage(file); 
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImage(null); 
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getInitials = (name = "") => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  

  return (
    <section className="min-h-screen bg-[#001F3D] text-white flex overflow-hidden">
      {/* LEFT PANEL */}
      <div
        className={`w-full sm:w-1/3 border-r border-white/10 flex flex-col
        ${selectedChat ? "hidden sm:flex" : "flex"}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-[#ED985F] text-black"
          >
            <HiArrowLeft />
          </button>
          <h2 className="text-xl font-bold">Messages</h2>
        </div>

        {/* Search */}
        <div className="px-4 py-4">
          <div className="flex items-center bg-[#213448] rounded-xl px-3">
            <HiSearch className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or role"
              className="bg-transparent w-full px-2 py-2 outline-none text-sm"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-4 pb-2">
          {["all", "my"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-xl font-semibold transition ${
                activeTab === tab
                  ? "bg-[#ED985F] text-black"
                  : "bg-[#213448] text-[#ED985F]"
              }`}
            >
              {tab === "all" ? "All Chats" : "My Chats"}
            </button>
          ))}
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-4">
        {searchLoading && (
  <p className="text-sm text-gray-400 text-center py-4">
    Searching users...
  </p>
)}

{!searchLoading && source.length === 0 && (
  <p className="text-sm text-gray-400 text-center py-4">
    No users found
  </p>
)}

          {source.map((user) => (
            <div
              key={user._id}
              onClick={() => {setSelectedChat(user);
                setActiveChatUserId(user._id);
              }}
              className="flex gap-3 items-center p-3 rounded-xl cursor-pointer hover:bg-[#213448]/80"
            >
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.fullName}
                  className="h-12 w-12 rounded-full object-cover border-2 border-[#ED985F]"
                />
              ) : (
                <div
                  className="h-12 w-12 rounded-full flex items-center justify-center
    bg-[#213448] text-[#ED985F] font-bold border-2 border-[#ED985F]"
                >
                  {getInitials(user.fullName)}
                </div>
              )}

              <div className="flex-1">
                <p className="font-semibold">{user.fullName}</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#ED985F]/20 text-[#ED985F]">
                  {user.role}
                </span>
                {user.messages && (
                  <p className="text-xs text-gray-400 truncate mt-1">
                    {user.messages[user.messages.length - 1]}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div
        className={`flex-1 flex flex-col h-screen
        ${!selectedChat ? "hidden sm:flex" : "flex"}`}
      >
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <button
                onClick={() => setSelectedChat(null)}
                className="p-2 rounded-full bg-[#ED985F] text-black"
              >
                <HiArrowLeft />
              </button>

              {selectedChat.profileImage ? (
                <img
                  src={selectedChat.profileImage}
                  alt={selectedChat.fullName}
                  className="h-12 w-12 rounded-full object-cover border-2 border-[#ED985F]"
                />
              ) : (
                <div
                  className="h-12 w-12 rounded-full flex items-center justify-center
    bg-[#213448] text-[#ED985F] font-bold border-2 border-[#ED985F]"
                >
                  {getInitials(selectedChat.fullName)}
                </div>
              )}

              <div>
                <p className="font-semibold">{selectedChat.fullName}</p>
                <span className="text-xs text-[#ED985F]">
                  {selectedChat.role}
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-4 flex flex-col space-y-2">
  {messages.map((msg) => (
    <div
      key={msg._id}
      className={`flex max-w-[80%] wrap-break-word ${
        msg.senderId === user.id ? "ml-auto" : "mr-auto"
      }`}
    >
      <div
        className='px-4 py-2 rounded-xl 
           bg-[#213448] text-white
        '
      >
        {msg.text && <p>{msg.text}</p>}

        {msg.image && (
          <img
            src={msg.image} // URL from backend
            alt="sent"
            className="mt-1 max-w-50 rounded"
          />
        )}

        <div className="text-xs text-gray-400 mt-1 text-right ">
          {new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  ))}
  <div ref={bottomRef} />
</div>




            {/* Input */}
       
        <div className="p-4 border-t border-slate-700/50">
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-slate-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-7 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700 "
              type="button"
            >
              X
            </button>
          </div>
        </div>
      )}
      </div>
      <form onSubmit={handleSend}>
            <div className="p-4 border-t border-white/10 flex gap-2 items-center">
              {/* Image picker */}
              <label className="cursor-pointer text-[#ED985F] font-bold">
                📷
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  hidden
                  onChange={handleImageChange}
                />
              </label>

              {/* Text input */}
             
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 rounded-xl bg-[#213448] outline-none"
              />

              {/* Send */}
              <button
              type="submit"
                disabled={!message.trim() && !imagePreview}
                className="px-4 py-2 rounded-xl bg-[#ED985F] text-black font-semibold disabled:opacity-50"
              >
                Send
              </button>
            </div>
        </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfessorMessages;
