import React from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { useEvents } from "../lib/api";
import EventCard from "@/components/events/EventCard";
import Loader from "@/components/Loader";

const Events: React.FC = () => {
  const { events, isLoading, isError } = useEvents();

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (isError) {
    return <div>Error loading events</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.div
        className="bg-gradient-to-r from-green-100 to-green-200 py-12"
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
                Explore Our Events
              </motion.h1>
              <motion.p
                className="text-green-100 text-lg"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Discover exciting events that bring people together.
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Events Grid Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events?.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
