import type React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { usePrograms } from "@/lib/api";
import EventCard from "@/components/Programs/ProgramCard";
import type { IProgram } from "@/types/program";
import Loader from "../Loader";

const EventsSection: React.FC = () => {
  const { programs, isLoading, isError } = usePrograms();

  const getUpcomingPrograms = (
    programs: IProgram[] | undefined
  ): IProgram[] => {
    if (!programs) return [];
    const now = new Date();

    return programs
      .filter((program) => new Date(program.startDate) > now) // Ensures only future programs
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )
      .slice(0, 4);
  };

  const upcomingPrograms = getUpcomingPrograms(programs);
  console.log("upcomingPrograms", upcomingPrograms);

  if (isLoading) {
    <div>
      <Loader />
    </div>;
  }

  if (isError) {
    return (
      <div className="text-center text-green-500">
        Error loading programs. Please try again later.
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
        >
          Upcoming Programs
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {upcomingPrograms.map((program) => (
            <EventCard key={program.id} program={program} />
          ))}
        </div>
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 0.3 }}
        >
          <Link
            to="/programs"
            className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold"
          >
            View All Programs
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default EventsSection;
