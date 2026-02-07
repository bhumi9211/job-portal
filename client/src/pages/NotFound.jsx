import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#001F3D] px-4 text-white">
      <div className="text-center max-w-md">

        {/* 404 */}
        <h1 className="text-7xl font-extrabold text-[#ED985F] mb-4">
          404
        </h1>

        {/* MESSAGE */}
        <h2 className="text-2xl font-semibold mb-2">
          Page Not Found
        </h2>

        <p className="text-[#547792] mb-8">
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* ACTION */}
        <Link
          to="/"
          className="inline-block rounded-lg bg-[#ED985F] px-6 py-3
                     font-semibold text-[#001F3D]
                     hover:scale-[1.05] transition"
        >
          Go Back Home
        </Link>

      </div>
    </div>
  );
};

export default NotFound;
