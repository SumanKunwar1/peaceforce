"use client";

import type React from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import type { Event } from "../../types/event";
import { Link } from "react-router-dom";

interface UpcomingEventsProps {
  events: Event[];
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

  useEffect(() => {
    const sortedEvents = events
      .filter((event) => new Date(event.date) > new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
    setUpcomingEvents(sortedEvents);
  }, [events]);

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
      <div className="space-y-4">
        {upcomingEvents.map((event) => (
          <div key={event.id} className="flex items-start space-x-4">
            <div className="bg-red-100 text-red-600 p-2 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">{event.title}</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-600">
                  Upcoming
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {new Date(event.date).toLocaleDateString()} at {event.time}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {event.ticketTypes.reduce(
                  (total, type) => total + type.available,
                  0
                )}{" "}
                tickets available
              </p>
            </div>
          </div>
        ))}
      </div>
      <Link
        to="/admin/events"
        className="mt-4 text-sm text-red-600 hover:text-red-700"
      >
        <button className="mt-4 text-sm text-red-600 hover:text-red-700">
          View all events →
        </button>
      </Link>
    </motion.div>
  );
};

export default UpcomingEvents;
