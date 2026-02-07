import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CTASection = () => {

  const {isAuthenticated} = useAuth()

  return (
    <section className="relative bg-[#213448] py-24 overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-linear-to-r from-[#001F3D]/60 to-[#213448]/60" />

      <div className="relative mx-auto max-w-7xl px-4 text-center">
        <h2 className="text-4xl font-bold text-white md:text-5xl">
          Ready to Find Your{" "}
          <span className="text-[#ED985F]">Next Opportunity?</span>
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-[#547792]">
          Apply to verified opportunities posted by professors and recruiters.
          Start building your career today.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/posts"
            className="rounded-xl bg-[#ED985F] px-8 py-3 text-lg font-semibold text-[#001F3D] transition hover:scale-105 hover:shadow-lg"
          >
            Browse posts
          </Link>

         {!isAuthenticated ? (
           <Link
           to="/register"
           className="rounded-xl border border-[#ED985F] px-8 py-3 text-lg font-semibold text-[#ED985F] transition hover:bg-[#ED985F] hover:text-[#001F3D]"
         >
           Create Account
         </Link>
         ): null}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
