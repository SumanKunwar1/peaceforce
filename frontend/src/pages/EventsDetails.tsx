"use client";

import type React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useEvent } from "../lib/api";
import EventRegistrationForm from "@/components/events/EventsRegistrationForm";
import Loader from "@/components/Loader";
import { Helmet } from "react-helmet-async";

const EventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { event, isLoading, isError } = useEvent(id || "");
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (isError || !event) {
    return <div>Error loading event</div>;
  }

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  return (
    <>
      <Helmet>
        <title>{event.metaTitle}</title>
        <meta name="description" content={event.metaDescription} />
        <meta name="keywords" content={event?.metaKeywords?.join(", ")} />
      </Helmet>
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
          <p className="text-xl mb-6">{event.shortDescription}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="event-details">
              <img
                src={
                  typeof event.image === "string"
                    ? event.image
                    : URL.createObjectURL(event.image) || "/placeholder.svg"
                }
                alt={event.title}
                className="w-full rounded-lg mb-4"
              />

              <p className="mb-4">{event.fullDescription}</p>
              <div className="space-y-2">
                <p>
                  <strong>Location:</strong> {event.location}
                </p>
                <p>
                  <strong>Venue:</strong> {event.venue}
                </p>
                <p>
                  <strong>Date:</strong> {event.date}
                </p>
                <p>
                  <strong>Time:</strong> {event.time}
                </p>
                {event.artist && (
                  <p>
                    <strong>Artist:</strong> {event.artist}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Ticket Types</h2>
              <div className="space-y-4">
                {event.ticketTypes.map((ticket) => (
                  <motion.div
                    key={ticket.type}
                    className="border p-4 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-semibold">{ticket.type}</h3>
                      <span className="text-lg font-bold">
                        Rs. {ticket.price}
                      </span>
                    </div>
                    <ul className="list-disc list-inside mb-2">
                      {ticket.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                    <p className="text-sm text-gray-600">
                      {ticket.available} tickets available
                    </p>
                  </motion.div>
                ))}
              </div>
              <motion.button
                onClick={() => setIsFormOpen(true)}
                className="mt-6 w-full bg-green-100 text-white py-3 rounded-lg hover:bg-green-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book Tickets
              </motion.button>
            </div>
          </div>

          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {event.gallery.map((image, index) => (
                <motion.img
                  key={index}
                  src={
                    typeof image === "string"
                      ? image
                      : URL.createObjectURL(image) || "/placeholder.svg"
                  }
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              ))}
            </div>
          </motion.div>

          <EventRegistrationForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            event={event}
          />
        </div>
      </motion.div>
    </>
  );
};

export default EventPage;
