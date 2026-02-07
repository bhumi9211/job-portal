const ProfessorHome = () => {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="max-w-2xl text-center">
  
          {/* BADGE */}
          <span className="inline-block mb-4 rounded-full bg-[#547792]/20 px-4 py-1 text-sm text-[#ED985F]">
            Professor Dashboard
          </span>
  
          {/* HEADING */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Welcome back, Professor 👋
          </h1>
  
          {/* SUBTEXT */}
          <p className="text-sm sm:text-base md:text-lg text-[#547792] mb-8">
            Create job opportunities, review applicants, shortlist the best
            candidates, and manage your postings — all from one place.
          </p>
  
          {/* QUICK ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
  
            <div className="rounded-xl bg-[#213448] px-6 py-4 w-full sm:w-auto shadow-md hover:scale-[1.03] transition">
              <h3 className="text-lg font-semibold mb-1">
                Create Job Post
              </h3>
              <p className="text-sm text-[#547792]">
                Publish a new opportunity for students
              </p>
            </div>
  
            <div className="rounded-xl bg-[#213448] px-6 py-4 w-full sm:w-auto shadow-md hover:scale-[1.03] transition">
              <h3 className="text-lg font-semibold mb-1">
                Manage Applications
              </h3>
              <p className="text-sm text-[#547792]">
                Review, accept or waitlist applicants
              </p>
            </div>
  
          </div>
  
        </div>
      </div>
    );
  };
  
  export default ProfessorHome;
  