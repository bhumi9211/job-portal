import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserButton = () => {
  const { user, logout } = useAuth(); // ✅ single call
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <div className="relative">
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full bg-[#213448] px-4 py-2 text-white hover:bg-[#2f4a63]"
      >
        {/* ✅ PROFILE IMAGE */}
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt="profile"
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ED985F] text-sm font-bold text-[#001F3D]">
            {user.fullName?.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="hidden sm:flex flex-col text-left">
          <span className="text-sm font-medium">{user.fullName}</span>
          <span className="text-xs text-gray-300 capitalize">
            {user.role}
          </span>
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#213448] shadow-lg border border-[#547792]">
          <button
            onClick={() => {
              navigate("/profile");
              setOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#2f4a63] rounded-t-xl"
          >
            Profile
          </button>

          <button
            onClick={() => {
              logout();
              setOpen(false);
              navigate("/signup");
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-[#2f4a63] rounded-b-xl"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserButton;
