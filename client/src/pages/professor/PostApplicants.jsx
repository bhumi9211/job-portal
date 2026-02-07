import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "../../services/authApi";
import { usePosts } from "../../context/PostsContext";
import toast from "react-hot-toast";

/* ---------- SQUARE BUTTON COMPONENT ---------- */
const SquareButton = ({
  label,
  icon,
  color,
  onClick,
  disabled = false,
}) => {
  const colors = {
    green: "border-green-400 text-green-400 hover:bg-green-400/10",
    red: "border-red-400 text-red-400 hover:bg-red-400/10",
    blue: "border-[#5DA9E9] text-[#5DA9E9] hover:bg-[#5DA9E9]/10",
    orange: "border-[#ED985F] text-[#ED985F] hover:bg-[#ED985F]/10",
    purple: "border-purple-400 text-purple-400 hover:bg-purple-400/10",
    gray: "border-gray-400 text-gray-300 hover:bg-gray-400/10",
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        w-16 h-16
        flex flex-col items-center justify-center
        rounded-lg border text-xs
        transition
        ${
          disabled
            ? "opacity-60 cursor-default"
            : colors[color]
        }
      `}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-[10px] mt-1">{label}</span>
    </button>
  );
};

/* ---------- MAIN COMPONENT ---------- */
const PostApplicants = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [applicants, setApplicants] = useState([]);
  const { post, fetchPostsById } = usePosts();

  /* ---------- FETCH POST ---------- */
  useEffect(() => {
    if (id) fetchPostsById(id);
  }, [id]);

  /* ---------- FETCH APPLICANTS ---------- */
  const getApplicants = async () => {
    try {
      const res = await API.get(`/api/post/${id}/applicants`, {
        withCredentials: true,
      });
      setApplicants(res.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to load applicants"
      );
    }
  };

  useEffect(() => {
    if (id) getApplicants();
  }, [id]);

  /* ---------- UPDATE STATUS ---------- */
  const updateStatus = async (applicationId, action, newStatus) => {
    try {
      await API.patch(
        `/api/application/${action}/${applicationId}`,
        {},
        { withCredentials: true }
      );

      toast.success(`Application ${newStatus}`);

      setApplicants((prev) =>
        prev.map((app) =>
          app._id === applicationId
            ? { ...app, status: newStatus }
            : app
        )
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Action failed"
      );
    }
  };

  /* ---------- FILTER ---------- */
  const filteredApplicants =
    selectedStatus === "all"
      ? applicants
      : applicants.filter((a) => a.status === selectedStatus);

  return (
    <section className="min-h-screen bg-[#001F3D] py-20">
      <div className="mx-auto max-w-7xl px-4">

        {/* HEADER */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white">
            Applicants —{" "}
            <span className="text-[#ED985F]">{post?.title}</span>
          </h2>
          <p className="mt-2 text-sm text-[#547792]">
            Review and manage candidates
          </p>
        </div>

        {/* FILTERS */}
        <div className="mb-8 flex flex-wrap gap-3 text-sm">
          {["all", "applied", "accepted", "waitlisted", "rejected"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`border px-4 py-1.5 transition
                ${
                  selectedStatus === status
                    ? "border-[#ED985F] bg-[#ED985F]/10 text-[#ED985F]"
                    : "border-[#9DB2BF]/30 text-[#9DB2BF] hover:bg-[#9DB2BF]/10"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            )
          )}
        </div>

        {/* APPLICANTS GRID */}
        <div
          className="
            grid gap-6
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
          "
        >
          {filteredApplicants.map((applicant) => {
            const isAccepted = applicant.status === "accepted";
            const isWaitlisted = applicant.status === "waitlisted";
            const isRejected = applicant.status === "rejected";

            return (
              <div
                key={applicant._id}
                className="
                  aspect-square
                  rounded-xl
                  bg-[#213448]
                  border border-[#9DB2BF]/20
                  p-4
                  flex flex-col justify-between
                "
              >
                {/* TOP INFO */}
                <div className="text-center">
                  <div
                    className="
                      mx-auto h-12 w-12 rounded-full
                      bg-[#ED985F]/20
                      flex items-center justify-center
                      text-lg font-bold text-[#ED985F]
                    "
                  >
                    {applicant.student.fullName.charAt(0)}
                  </div>

                  <p className="mt-2 font-medium text-white">
                    {applicant.student.fullName}
                  </p>

                  <p className="text-xs text-[#9DB2BF] truncate">
                    {applicant.student.email}
                  </p>

                  <span
                    className="
                      inline-block mt-2 px-2 py-0.5
                      text-xs rounded border
                      border-[#ED985F] text-[#ED985F]
                    "
                  >
                    {applicant.status}
                  </span>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <SquareButton
                    label="Profile"
                    icon="👤"
                    color="gray"
                    onClick={() =>
                      navigate(
                        `/profile/${applicant.student._id}`
                      )
                    }
                  />

                  <SquareButton
                    label="Message"
                    icon="💬"
                    color="purple"
                    onClick={() =>
                      navigate(
                        `/messages`
                      )
                    }
                  />

                  <SquareButton
                    label="Resume"
                    icon="📄"
                    color="orange"
                    onClick={() =>
                      navigate(
                        `/professor/applications/${applicant._id}/resume`
                      )
                    }
                  />
                </div>

                {/* STATUS ACTIONS */}
                <div className="flex justify-center gap-2 mt-2">
                  <SquareButton
                    label={isAccepted ? "Done" : "Accept"}
                    icon={isAccepted ? "✔" : "✓"}
                    color="green"
                    disabled={isAccepted}
                    onClick={() =>
                      updateStatus(applicant._id, "accept", "accepted")
                    }
                  />

                  <SquareButton
                    label={isWaitlisted ? "Done" : "Wait"}
                    icon={isWaitlisted ? "✔" : "⏳"}
                    color="blue"
                    disabled={isWaitlisted}
                    onClick={() =>
                      updateStatus(applicant._id, "waitlist", "waitlisted")
                    }
                  />

                  <SquareButton
                    label={isRejected ? "Done" : "Reject"}
                    icon={isRejected ? "✔" : "✕"}
                    color="red"
                    disabled={isRejected}
                    onClick={() =>
                      updateStatus(applicant._id, "reject", "rejected")
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* EMPTY STATE */}
        {filteredApplicants.length === 0 && (
          <p className="mt-16 text-center text-[#547792]">
            No candidates found
          </p>
        )}
      </div>
    </section>
  );
};

export default PostApplicants;
