import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Event } from "../../types/event";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden flex-1 min-w-[300px]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={typeof event.image === "string" ? event.image : "/placeholder.svg"}
        alt={event.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-4">{event.shortDescription}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-red-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{event.date}</span>
          </div>
          <Link
            to={`/events/${event.id}`}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Learn More →
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
