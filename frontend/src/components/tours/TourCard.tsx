import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, MapPin } from "lucide-react";
import { Tour } from "@/types/tour";

interface TourCardProps {
  tour: Tour;
}

const TourCard: React.FC<TourCardProps> = ({ tour }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/tours/${tour.id}`}>
        <div className="relative h-48">
          <img
            src={typeof tour.image === "string" ? tour.image : undefined}
            alt={tour.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <div className="flex items-center text-white gap-4">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{tour.days} Days</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{tour.location}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{tour.title}</h3>
          <p className="text-gray-600 line-clamp-2">{tour.description}</p>

          <div className="mt-4 text-sm text-gray-700">
            <h4 className="font-semibold">Itinerary:</h4>
            <ul className="list-disc pl-5">
              {tour.itinerary.slice(0, 3).map((item, index) => (
                <li key={index}>
                  <strong>Day {item.day}:</strong> {item.description}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <span className="text-red-600 font-semibold">View Details</span>
            <motion.svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </motion.svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default TourCard;
