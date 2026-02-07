import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Hero = () => {
  const {user } = useAuth()
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-[#213448] via-[#001F3D] to-[#213448] pt-40 pb-28">
      
      {/* Background accents */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#547792]/20 blur-3xl"></div>
      <div className="absolute bottom-0 -right-24 h-96 w-96 rounded-full bg-[#ED985F]/20 blur-3xl"></div>

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-16 md:grid-cols-2">

          {/* Left Content */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#547792]/20 px-4 py-1 text-sm font-medium text-[#ED985F]">
              🚀 India’s Smart Job Portal
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white md:text-6xl">
              Discover Jobs that
              <span className="block bg-linear-to-r from-[#ED985F] to-[#F6B17A] bg-clip-text text-transparent">
                Shape Your Future
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-gray-300">
              Apply to internships, jobs, and research opportunities
              posted directly by professors and companies.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap gap-5">
              <Link
                to="/posts"
                className="rounded-xl bg-[#ED985F] px-7 py-3 font-semibold text-[#001F3D] shadow-lg transition hover:scale-105 hover:shadow-xl"
              >
                Explore Posts
              </Link>

             {user?.role === "professor" ? (
               <Link
               to="/professor/create-post"
               className="rounded-xl border border-[#547792] px-7 py-3 font-semibold text-white transition hover:bg-[#547792]/20 hover:scale-105"
             >
               Post a Job
             </Link>
             ) : null}
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden md:block">
            
            {/* Floating cards */}
            <div className="relative grid gap-6">

              <div className="ml-auto w-64 rounded-2xl bg-[#001F3D] p-6 shadow-xl border border-[#ED985F]">
                <p className="text-3xl font-bold text-[#ED985F]">10,000+</p>
                <p className="mt-1 text-sm text-gray-300">Live Opportunities</p>
              </div>

              <div className="w-72 rounded-2xl bg-[#001F3D] p-6 shadow-xl border border-[#ED985F]">
                <p className="text-3xl font-bold text-[#ED985F]">5,000+</p>
                <p className="mt-1 text-sm text-gray-300">Professors & Companies</p>
              </div>

              <div className="ml-auto w-64 rounded-2xl bg-[#001F3D] p-6 shadow-xl border border-[#ED985F]">
                <p className="text-3xl font-bold text-[#ED985F]">20,000+</p>
                <p className="mt-1 text-sm text-gray-300">Active Candidates</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
