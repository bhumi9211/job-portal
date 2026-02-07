import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API } from "../services/authApi";
import toast from "react-hot-toast";

const Profile = () => {
  const { user } = useAuth();
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [profileImage, setProfileImage] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    headline: "",
    location: "India",
    gender: "",
    skills: "",
    education: [{ college: "", degree: "", fieldOfStudy: "" }],
    experience: [{ title: "", company: "", description: "", years: "" }],
  });

  /* ================= FETCH PROFILE ================= */
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/user/profile", {
        withCredentials: true,
      });

      const data = res.data;
      updateUser({
        profileImage: data.profileImage,
      });
      setProfileImage(data.profileImage || "");

      setFormData({
        fullName: data.fullName || "",
        headline: data.headline || "",
        location: data.location || "India",
        gender: data.gender || "",
        skills: data.skills?.join(", ") || "",
        education:
          data.education?.length > 0
            ? data.education
            : [{ college: "", degree: "", fieldOfStudy: "" }],
        experience:
          data.experience?.length > 0
            ? data.experience
            : [{ title: "", company: "", description: "", years: "" }],
      });
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setProfileImage(URL.createObjectURL(file));
  };

  const updateEducation = (i, field, value) => {
    const updated = [...formData.education];
    updated[i][field] = value;
    setFormData({ ...formData, education: updated });
  };

  const updateExperience = (i, field, value) => {
    const updated = [...formData.experience];
    updated[i][field] = value;
    setFormData({ ...formData, experience: updated });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    try {
      const fd = new FormData();

      fd.append("fullName", formData.fullName);
      fd.append("headline", formData.headline);
      fd.append("location", formData.location);
      fd.append("gender", formData.gender);
      fd.append(
        "skills",
        JSON.stringify(
          formData.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        )
      );
      fd.append("education", JSON.stringify(formData.education));
      fd.append("experience", JSON.stringify(formData.experience));

      if (imageFile) fd.append("profileImage", imageFile);

      await API.put("/api/user/update-profile", fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile updated successfully ✅");

      fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return <p className="text-white text-center mt-20">Loading...</p>;
  }

  return (
    <section className="min-h-screen bg-[#001F3D] py-20 text-white">
      <div className="mx-auto max-w-6xl px-4">
        {/* PROFILE HEADER */}
        <div className="mb-10 rounded-2xl bg-[#213448] p-6 flex items-center gap-6">
          {profileImage ? (
            <img
              src={profileImage}
              alt="profile"
              className="h-36 w-36 rounded-full object-cover border-4 border-[#ED985F]"
            />
          ) : (
            <div className="flex h-36 w-36 items-center justify-center rounded-full border-4 border-[#ED985F] bg-[#001F3D] text-6xl font-bold text-[#ED985F]">
              {formData.fullName.charAt(0)}
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-2xl font-bold">{formData.fullName}</h1>
            <p className="text-[#9DB2BF]">{formData.headline}</p>

            <label className="mt-3 inline-block cursor-pointer text-sm text-[#ED985F] hover:underline">
              Change Photo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        {/* BASIC INFO */}
        <Card title="Basic Information">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
            <Input value={user.email} disabled />
            <Input
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              className="md:col-span-2"
            />
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>
          </div>
        </Card>

        {/* SKILLS */}
        <Card title="Skills">
          <Input
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="React, Node, MongoDB"
          />
        </Card>

        {/* EDUCATION */}
        <Card title="Education">
          {formData.education.map((edu, i) => (
            <div key={i} className="grid gap-3 md:grid-cols-3 mb-3">
              <Input
                value={edu.college}
                onChange={(e) => updateEducation(i, "college", e.target.value)}
                placeholder="College"
              />
              <Input
                value={edu.degree}
                onChange={(e) => updateEducation(i, "degree", e.target.value)}
                placeholder="Degree"
              />
              <Input
                value={edu.fieldOfStudy}
                onChange={(e) =>
                  updateEducation(i, "fieldOfStudy", e.target.value)
                }
                placeholder="Field"
              />
            </div>
          ))}
          <AddButton
            onClick={() =>
              setFormData({
                ...formData,
                education: [
                  ...formData.education,
                  { college: "", degree: "", fieldOfStudy: "" },
                ],
              })
            }
            label="Add Education"
          />
        </Card>

        {/* EXPERIENCE */}
        <Card title="Experience">
          {formData.experience.map((exp, i) => (
            <div key={i} className="grid gap-3 md:grid-cols-2 mb-3">
              <Input
                value={exp.title}
                onChange={(e) => updateExperience(i, "title", e.target.value)}
                placeholder="Title"
              />
              <Input
                value={exp.company}
                onChange={(e) => updateExperience(i, "company", e.target.value)}
                placeholder="Company"
              />
              <Input
                type="number"
                value={exp.years}
                onChange={(e) => updateExperience(i, "years", e.target.value)}
                placeholder="Years"
              />
              <Input
                value={exp.description}
                onChange={(e) =>
                  updateExperience(i, "description", e.target.value)
                }
                placeholder="Description"
              />
            </div>
          ))}
          <AddButton
            onClick={() =>
              setFormData({
                ...formData,
                experience: [
                  ...formData.experience,
                  { title: "", company: "", description: "", years: "" },
                ],
              })
            }
            label="Add Experience"
          />
        </Card>

        {/* SAVE */}
        <div className="mt-10 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`rounded-xl px-12 py-3 font-semibold text-[#001F3D] transition
      ${
        loading
          ? "bg-[#ED985F]/60 cursor-not-allowed"
          : "bg-[#ED985F] hover:scale-105"
      }
    `}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </section>
  );
};

/* ================= REUSABLE ================= */

const Card = ({ title, children }) => (
  <div className="mb-8 rounded-2xl bg-[#213448] p-6">
    <h3 className="mb-4 text-xl font-semibold">{title}</h3>
    {children}
  </div>
);

const Input = ({ className = "", ...props }) => (
  <input {...props} className={`input ${className}`} />
);

const AddButton = ({ label, onClick }) => (
  <button onClick={onClick} className="text-sm text-[#ED985F] hover:underline">
    + {label}
  </button>
);

export default Profile;
