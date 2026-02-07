import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { API } from "../../services/authApi";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const getUserProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/api/user/profile/${id}`, {
        withCredentials: true,
      });
      setUser(res.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong. Try again later"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, [id]);

  if (loading) {
    return <p className="text-white text-center mt-20">Loading profile...</p>;
  }

  if (!user) {
    return <p className="text-white text-center mt-20">User not found</p>;
  }

  const {
    fullName,
    profileImage,
    headline,
    location,
    role,
    skills = [],
    education = [],
    experience = [],
  } = user;

  return (
    <section className="min-h-screen bg-[#001F3D] py-16 mt-10 text-white">
      <div className="mx-auto max-w-6xl px-4">

        <button
          onClick={() => navigate(-1)}
          className="mb-6 rounded-lg border border-[#ED985F] px-4 py-2 text-sm text-[#ED985F] hover:bg-[#ED985F]/10 transition"
        >
          ← Back
        </button>

        {/* Header */}
        <div className="mb-10 rounded-2xl bg-[#213448] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
          {profileImage ? (
            <img
              src={profileImage}
              alt={fullName}
              className="h-36 w-36 rounded-full object-cover border-4 border-[#ED985F]"
            />
          ) : (
            <div className="flex h-36 w-36 items-center justify-center rounded-full border-4 border-[#ED985F] bg-[#001F3D] text-6xl font-bold text-[#ED985F]">
              {fullName?.charAt(0)?.toUpperCase()}
            </div>
          )}

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold">{fullName}</h1>
            <p className="text-[#9DB2BF] mt-1">
              {headline || "Add a headline"}
            </p>

            <div className="mt-3 flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="bg-[#5DA9E9]/20 text-[#5DA9E9] rounded-full px-3 py-1 text-sm font-semibold">
                {role === "student" ? "🎓 Student" : "👨‍🏫 Professor"}
              </span>
              {location && (
                <span className="bg-[#ED985F]/20 text-[#ED985F] rounded-full px-3 py-1 text-sm font-semibold">
                  {location}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        <Card title="Skills">
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-[#ED985F] px-3 py-1 rounded-full text-[#001F3D] text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No skills added</p>
          )}
        </Card>

        {/* Education */}
        <Card title="Education">
          {education.length > 0 ? (
            education.map((edu, i) => (
              <div key={i} className="mb-3">
                <p className="font-semibold">
                  {edu.degree} in {edu.fieldOfStudy}
                </p>
                <p className="text-gray-400">{edu.college}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No education added</p>
          )}
        </Card>

        {/* Experience */}
        <Card title="Experience">
          {experience.length > 0 ? (
            experience.map((exp, i) => (
              <div key={i} className="mb-3">
                <p className="font-semibold">
                  {exp.title} at {exp.company} ({exp.years} yr
                  {exp.years > 1 ? "s" : ""})
                </p>
                <p className="text-gray-400">{exp.description}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No experience added</p>
          )}
        </Card>
      </div>
    </section>
  );
};

const Card = ({ title, children }) => (
  <div className="mb-8 rounded-2xl bg-[#213448] p-6 md:p-8">
    <h3 className="mb-4 text-xl font-semibold">{title}</h3>
    {children}
  </div>
);

export default UserProfile;
