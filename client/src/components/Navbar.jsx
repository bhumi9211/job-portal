import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineChatAlt2,
  HiOutlineDocumentText,
  HiOutlineClipboardList,
  HiOutlineViewGrid,
} from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import UserButton from "../components/UserButton";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const messagePath = "/messages"
   

  return (
    <nav className="fixed top-0 z-50 w-full bg-[#001F3D]/95 backdrop-blur-md border-b border-[#547792]/40">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-[#ED985F]">
            JobPortal
          </Link>

          {/* ================= DESKTOP ================= */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated && (
              <>
                {/* Posts */}
                <Link
                  to="/posts"
                  className="flex items-center gap-2 text-gray-200 hover:text-[#ED985F]"
                >
                  <HiOutlineDocumentText className="text-lg" />
                  Posts
                </Link>

                {/* Student */}
                {user?.role === "student" && (
                  <Link
                    to="/applications"
                    className="flex items-center gap-2 text-gray-200 hover:text-[#ED985F]"
                  >
                    <HiOutlineClipboardList className="text-lg" />
                    My Applications
                  </Link>
                )}

                {/* Professor */}
                {user?.role === "professor" && (
                  <Link
                    to="/professor"
                    className="flex items-center gap-2 text-gray-200 hover:text-[#ED985F]"
                  >
                    <HiOutlineViewGrid className="text-lg" />
                    Dashboard
                  </Link>
                )}
              </>
            )}

           {isAuthenticated ? (
             <Link
             to={messagePath}
             className="flex items-center gap-2 text-gray-200 hover:text-[#ED985F]"
             title="Messages"
           >
             <HiOutlineChatAlt2 className="text-xl" />
             Messages
           </Link>
           ): null}

            {!isAuthenticated ? (
              <Link
                to="/signup"
                className="rounded-lg bg-[#547792] px-4 py-2 text-white hover:bg-[#ED985F] hover:text-[#001F3D]"
              >
                Get Started
              </Link>
            ) : (
              <>
                <UserButton />

                {/* ✅ Messages icon ONLY (after UserButton) */}
              </>
            )}
          </div>

          {/* ================= MOBILE TOGGLE ================= */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-200"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor">
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {isOpen && (
        <div className="md:hidden bg-[#001F3D] border-t border-[#547792]/30">
          <div className="flex flex-col gap-4 px-4 py-4">
            {isAuthenticated && (
              <>
                <Link
                  to="/posts"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-gray-200"
                >
                  <HiOutlineDocumentText />
                  Posts
                </Link>

                {user?.role === "student" && (
                  <Link
                    to="/applications"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 text-gray-200"
                  >
                    <HiOutlineClipboardList />
                    My Applications
                  </Link>
                )}

                {isAuthenticated ? (
                  <Link
                  to={messagePath}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-gray-200"
                >
                  <HiOutlineChatAlt2 />
                  Messages
                </Link>
                ): null}
              </>
            )}

            {user?.role === "professor" && (
              <Link
                to="/professor"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 text-gray-200"
              >
                <HiOutlineViewGrid />
                Dashboard
              </Link>
            )}

            {isAuthenticated ? (
              <UserButton />
            ) : (
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="rounded-lg bg-[#547792] py-2 text-center text-white"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
