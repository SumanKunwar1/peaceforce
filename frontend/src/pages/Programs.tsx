import type React from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import ProgramCard from "../components/Programs/ProgramCard";
import { usePrograms } from "@/lib/api";
import Loader from "@/components/Loader";

const Programs: React.FC = () => {
  const { programs, isLoading, isError } = usePrograms();

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );
  if (isError) return <div>Error loading programs</div>;

  const currentDate = new Date();
  const currentPrograms = programs?.filter(
    (program) =>
      new Date(program.startDate) <= currentDate &&
      new Date(program.endDate) >= currentDate
  );
  const upcomingPrograms = programs?.filter(
    (program) => new Date(program.startDate) > currentDate
  );
  const finishedPrograms = programs?.filter(
    (program) => new Date(program.endDate) < currentDate
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        className="bg-gradient-to-r from-green-600 to-green-700 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-4">
            <Calendar className="w-12 h-12 text-white" />
            <div>
              <motion.h1
                className="text-4xl font-bold text-white mb-2"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Our Programs
              </motion.h1>
              <motion.p
                className="text-green-100 text-lg"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Join our programs and deepen your spiritual practice
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {currentPrograms && currentPrograms.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Current Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPrograms.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          </section>
        )}

        {upcomingPrograms && upcomingPrograms.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Upcoming Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingPrograms.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          </section>
        )}

        {finishedPrograms && finishedPrograms.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-8">Finished Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {finishedPrograms.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Programs;
