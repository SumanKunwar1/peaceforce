import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEvents } from "@/lib/api";
import EventCard from "../../Programs/ProgramCard";

const EventsSection = () => {
  // Fetch the events data using the useEvents hook
  const { events } = useEvents();

  // Get only the latest 4 events for the home page
  const latestEvents = events?.slice(0, 4);

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
          {latestEvents?.map((event: any) => (
            <EventCard key={event.id} program={event} />
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
            to="/admin/programs"
            className="inline-flex items-center text-red-600 hover:text-red-700 font-semibold"
          >
            View All Events
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
