import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { API } from "../../services/authApi";
import { Link } from "react-router-dom";

const MyApplications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);

  const getApplications = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/application/my-applications", {
        withCredentials: true,
      });
      setApplications(res.data);
    } catch (error) {
      console.log(error)
      toast.error(
        error.response?.data?.message ||
          "Something went wrong.. Try again later"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getApplications();
  }, []);

  // Filter applications
  const filteredApps =
    selectedStatus === "all"
      ? applications
      : applications.filter((app) => app.status === selectedStatus);

  // Status styles
  const statusStyles = {
    accepted: "border-green-400/40 text-green-400",
    waitlisted: "border-[#5DA9E9]/40 text-[#5DA9E9]",
    rejected: "border-red-400/40 text-red-400",
  };

  return (
    <section className="min-h-screen bg-[#001F3D] py-20">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-white">My Applications</h2>
          <p className="mt-2 text-sm text-[#547792]">
            Track your applications and their status
          </p>
        </div>

        {/* Status Filters (shortlisted REMOVED) */}
        <div className="mb-8 flex flex-wrap gap-3 text-sm justify-center">
          {["all", "accepted", "waitlisted", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`border px-4 py-1.5 transition rounded-lg ${
                selectedStatus === status
                  ? "border-[#ED985F] bg-[#ED985F]/10 text-[#ED985F]"
                  : "border-[#9DB2BF]/30 text-[#9DB2BF] hover:bg-[#9DB2BF]/10"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Table Header */}
        <div className="hidden grid-cols-12 border-b border-[#9DB2BF]/20 pb-3 text-sm text-[#9DB2BF] md:grid">
          <div className="col-span-4">Job Title</div>
          <div className="col-span-3">Posted By</div>
          <div className="col-span-2">Applied On</div>
          <div className="col-span-3 text-right">Status</div>
        </div>

        {/* Applications */}
        <div className="divide-y divide-[#9DB2BF]/10">
          {filteredApps.map((app) => (
            <div
              key={app._id}
              className="grid grid-cols-1 gap-4 py-5 md:grid-cols-12 md:items-center"
            >
              {/* 🔥 Job Title COLOR CHANGED */}
            
<Link
  to={`/post/${app.post?._id}`}
  className="md:col-span-4 font-semibold text-[#ED985F] hover:underline cursor-pointer"
>
  {app.post?.title}
</Link>

              <div className="md:col-span-3 text-sm text-[#9DB2BF]">
                {app.post?.postedBy?.fullName}
              </div>

              <div className="md:col-span-2 text-sm text-[#9DB2BF]">
                {new Date(app.createdAt).toDateString()}
              </div>

              <div className="md:col-span-3 flex justify-end">
                <span
                  className={`border px-3 py-1 rounded-full text-xs font-semibold ${
                    statusStyles[app.status]
                  }`}
                >
                  {app.status.charAt(0).toUpperCase() +
                    app.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredApps.length === 0 && !loading && (
          <p className="mt-16 text-center text-[#547792]">
            No applications found in this category.
          </p>
        )}
      </div>
    </section>
  );
};

export default MyApplications;
