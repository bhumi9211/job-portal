import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiDownload, FiArrowLeft } from "react-icons/fi";
import { API } from "../../services/authApi";
import toast from "react-hot-toast";

const ViewResume = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  const getResume = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/api/application/${applicationId}/resume`, {
        withCredentials: true,
      });
      setApplication(res.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong..Try again later"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getResume();
  }, [applicationId]);

  if (loading)
    return <p className="mt-10 text-center text-white">Loading resume...</p>;

  if (!application)
    return <p className="mt-20 text-center text-white">Resume not found</p>;

  return (
    <section className="min-h-screen bg-[#001F3D] py-2 px-4">
      <div className="mx-auto max-w-5xl rounded-2xl bg-[#213448] p-6 text-white">
        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[#ED985F] hover:underline"
            >
              <FiArrowLeft />
              Back
            </button>

            <h1 className="text-2xl font-bold"></h1>
            <p className="text-sm text-gray-300"></p>
          </div>

          <a
            href={application.resume}
            download
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-lg bg-[#ED985F] px-4 py-2 text-[#001F3D] hover:opacity-90"
          >
            <FiDownload />
            Download Resume
          </a>
        </div>

      
        <div className="mb-3">
          <span className="rounded-full bg-[#ED985F]/20 px-3 py-1 text-sm text-[#ED985F]">
              Preview :
          </span>
        </div>

        {/* PDF VIEWER */}
        <div className="h-[75vh] w-full overflow-hidden rounded-xl border border-[#9DB2BF]/20 bg-black">
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(
              application.resume
            )}&embedded=true`}
            className="h-full w-full"
            title="Resume Preview"
          />
        </div>
      </div>
    </section>
  );
};

export default ViewResume;
