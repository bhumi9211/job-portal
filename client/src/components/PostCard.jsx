import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  console.log(post)
  if (!post) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  

  return (
    <div className="group overflow-hidden rounded-2xl bg-[#213448]
      shadow-[0_20px_40px_rgba(0,0,0,0.25)]
      transition hover:-translate-y-2"
    >
      <img
        src={post.postImage}
        alt={post.title}
        className="h-48 w-full object-cover
        transition-transform duration-500 group-hover:scale-105"
      />

      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-semibold text-white">
            {post.title}
          </h3>

          <span className={`rounded-full px-3 py-1 text-xs font-semibold
            ${
              post.status === "open"
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}>
            {post.status}
          </span>
        </div>

        <div className="mt-4 space-y-2 text-sm text-gray-300">
          <p><span className="text-white">Posted By:</span> {post.postedBy?.fullName}</p>
          <p><span className="text-white">Apply By:</span> {formatDate(post.applyBy)}</p>
        </div>

        <Link
          to={`/post/${post._id}`}
          className="mt-6 block rounded-lg bg-[#ED985F] py-2
          text-center font-semibold text-[#001F3D]"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
