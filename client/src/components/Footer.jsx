import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#001F3D] text-gray-300">
      {/* Top Footer */}
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-[#ED985F]">
              JobPortal
            </h3>
            <p className="mt-4 text-sm text-[#547792]">
              Connecting students with real opportunities posted by
              professors and recruiters.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/posts" className="hover:text-[#ED985F] transition">
                  Browse posts
                </Link>
              </li>
              <li>
                <Link to="/applications" className="hover:text-[#ED985F] transition">
                  My Applications
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-[#ED985F] transition">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* For Students */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">
              For Students
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-[#ED985F] transition cursor-pointer">
                Apply for Jobs
              </li>
              <li className="hover:text-[#ED985F] transition cursor-pointer">
                Track Applications
              </li>
              <li className="hover:text-[#ED985F] transition cursor-pointer">
                Build Profile
              </li>
            </ul>
          </div>

          {/* For Professors */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">
              For Professors
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-[#ED985F] transition cursor-pointer">
                Post Opportunities
              </li>
              <li className="hover:text-[#ED985F] transition cursor-pointer">
                Manage Applicants
              </li>
              <li className="hover:text-[#ED985F] transition cursor-pointer">
                Shortlist Candidates
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#547792]">
            © {new Date().getFullYear()} JobPortal. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm">
            <span className="cursor-pointer hover:text-[#ED985F] transition">
              Privacy Policy
            </span>
            <span className="cursor-pointer hover:text-[#ED985F] transition">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
