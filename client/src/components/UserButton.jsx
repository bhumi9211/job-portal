import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserButton = ({setIsOpen}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="relative">
      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:block">
        <button
          className="flex items-center gap-2 rounded-full bg-[#213448] px-4 py-2 text-white hover:bg-[#2f4a63]"
        >
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

          <div className="flex flex-col text-left">
            <span className="text-sm font-medium">{user.fullName}</span>
            <span className="text-xs text-gray-300 capitalize">
              {user.role}
            </span>
          </div>
        </button>

        {/* Dropdown */}
      
          <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#213448] shadow-lg border border-[#547792]">
            <button
              onClick={() => {
                navigate("/profile");
                
              }}
              className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#2f4a63] rounded-t-xl"
            >
              Profile
            </button>

            <button
              onClick={() => {
                logout();
                
                navigate("/signup");
              }}
              className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-[#2f4a63] rounded-b-xl"
            >
              Logout
            </button>
          </div>
      
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="block md:hidden rounded-xl bg-[#213448] p-4 text-white">
        <div className="flex items-center gap-3">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt="profile"
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ED985F] font-bold text-[#001F3D]">
              {user.fullName?.charAt(0).toUpperCase()}
            </div>
          )}

<div className="flex items-center justify-between w-full">
  <p className="font-semibold">{user.fullName}</p>

  <p className="text-xs px-2 py-1 rounded-2xl capitalize bg-[#efa777] text-black">
    {user.role}
  </p>
</div>

        </div>

        {/* Mobile actions */}
        
        <div className="mt-3 flex  gap-2">
          <button
            onClick={() =>{ 
              if(setIsOpen) setIsOpen(false)
              navigate("/profile")}}
            
            className="rounded-lg bg-[#2f4a63] px-4 py-2 text-sm w-full"
          >
            Profile
          </button>

          <button
            onClick={() => {
              logout();
              navigate("/signup");
            }}
            className="rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-400 w-full"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserButton;
