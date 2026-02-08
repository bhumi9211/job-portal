import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const ProfessorDashboard = () => {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth(); // logout function from context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // clear auth state
    navigate("/signin"); // redirect to sign-in page
  };

  return (
    <div className="h-screen flex bg-[#001F3D] text-white overflow-hidden">
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      {/* LEFT SIDEBAR (ALWAYS FIXED) */}
      <aside
        className={`
          fixed  left-0 z-40
          h-full
          w-72 bg-[#213448] p-6
          flex flex-col gap-4
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-bold text-[#ED985F] mb-4"
          onClick={() => setOpen(false)}
        >
          JobPortal
        </Link>

        {/* TITLE */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <p className="text-sm text-[#547792]">Professor</p>
        </div>

        {/* LINKS */}
        <Link to="/professor/create-post"
          onClick={()=>setOpen(false)}
         className="sidebar-card">
          ➕ Create Job Post
        </Link>

        <Link to="/professor/my-posts" onClick={()=>setOpen(false)} className="sidebar-card">
          📄 My Posts
        </Link>

        <Link to="/professor/analysis" onClick={()=>setOpen(false)} className="sidebar-card">
        📊
        Analysis
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 mt-4 w-full rounded-lg border border-[#ED985F] px-4 py-2 text-[#ED985F] hover:bg-[#ED985F]/10 transition"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </aside>

      {/* RIGHT CONTENT (SCROLLS) */}
      <main
        className="
          flex-1
          ml-0 md:ml-72
         mt-4
          px-6 md:px-20
          overflow-y-auto
        "
      >
        {/* MOBILE TOP BAR */}
        <div className="flex items-center gap-4 mb-6 md:hidden">
          <button onClick={() => setOpen(true)} className="text-2xl">
            ☰
          </button>
          <h1 className="text-lg font-semibold">Professor Dashboard</h1>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default ProfessorDashboard;
