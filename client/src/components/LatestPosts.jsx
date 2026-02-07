import { Link } from "react-router-dom";
import PostCard from "./PostCard";
import { usePosts } from "../context/PostsContext";

const LatestPosts = () => {
  const { posts } = usePosts();
  const latestPosts = posts.slice(0, 3);

  return (
    <section className="bg-[#001F3D] py-28">
      <div className="mx-auto max-w-7xl px-4">
        {/* Heading */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-white">
            Latest <span className="text-[#ED985F]">Posts</span>
          </h2>
          <p className="mt-3 text-[#547792]">
            Discover opportunities before deadlines close
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>

        {/* View More Button */}
        <div className="mt-20 text-center">
          <Link
            to="/posts"
            className="inline-block rounded-xl border-2 border-[#ED985F]
            px-8 py-3 font-semibold text-[#ED985F]
            transition hover:bg-[#ED985F] hover:text-[#001F3D]"
          >
            View More Posts →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestPosts;
