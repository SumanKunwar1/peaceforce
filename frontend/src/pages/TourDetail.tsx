// src/components/TourDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Clock,
  MapPin,
  CheckCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import TourCard from "@/components/tours/TourCard";
import BookingForm from "@/components/tours/BookingForm";
import { getTourById, getTours } from "@/lib/toursApi";
import { Tour } from "../types/tour";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { IBookingData } from "../types/bookings";
import Loader from "@/components/Loader";
import { Helmet } from "react-helmet-async";

const TourDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [relatedTours, setRelatedTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDays, setExpandedDays] = useState<number[]>([]);
  const [isBookingFormOpen, setBookingFormOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTourAndRelated = async () => {
      try {
        if (id) {
          const fetchedTour = await getTourById(id);
          setTour(fetchedTour);

          const allTours = await getTours();
          const related = allTours.filter((t) => t.id !== id).slice(0, 3);
          setRelatedTours(related);
        }
        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to fetch tour details. Please try again later.");
        setLoading(false);
      }
    };

    fetchTourAndRelated();
  }, [id]);

  const handleBookingSubmit = (data: IBookingData) => {
    console.log("Booking data:", data);
    setBookingFormOpen(false);
    toast({
      title: "Booking Successful",
      description: "Your tour has been booked successfully.",
      duration: 4000,
    });
  };

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tour Not Found</h2>
          <Link to="/tours" className="text-green-100 hover:text-green-200">
            Back to Tours
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{tour.metaTitle}</title>
        <meta name="description" content={tour.metaDescription} />
        <meta name="keywords" content={tour.metaKeywords?.join(", ")} />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <motion.div
          className="relative h-[60vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={typeof tour.image === "string" ? tour.image : undefined}
            alt={tour.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 text-white">
              <motion.h1
                className="text-4xl md:text-5xl font-bold mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {tour.title}
              </motion.h1>
              <motion.div
                className="flex items-center gap-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{tour.days} Days</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{tour.location}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold mb-4">Tour Overview</h2>
                <p className="text-gray-700">{tour.description}</p>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-4">Tour Highlights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tour.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-2 text-gray-700"
                    >
                      <CheckCircle className="w-5 h-5 text-green-100 mt-1 flex-shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-2xl font-bold mb-4">Itinerary</h2>
                <div className="space-y-4">
                  {tour.itinerary.map((item) => (
                    <div
                      key={item.day}
                      className="bg-white p-4 rounded-lg shadow-sm"
                    >
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() =>
                          setExpandedDays((prev) =>
                            prev.includes(item.day)
                              ? prev.filter((day) => day !== item.day)
                              : [...prev, item.day]
                          )
                        }
                      >
                        <div className="flex items-center space-x-4">
                          <Calendar className="w-5 h-5 text-green-100" />
                          <h3 className="font-semibold">Day {item.day}</h3>
                        </div>
                        {expandedDays.includes(item.day) ? (
                          <ChevronUp className="w-5 h-5 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      {expandedDays.includes(item.day) && (
                        <p className="text-gray-700 mt-2">{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.section>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                className="bg-white p-6 rounded-lg shadow-lg sticky top-24"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h3 className="text-xl font-bold mb-4">Book This Tour</h3>
                <div className="space-y-4 mb-6">
                  <h4 className="font-semibold">Inclusions:</h4>
                  <ul className="space-y-2">
                    {tour.inclusions.map((inclusion, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-100" />
                        <span className="text-gray-700">{inclusion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  onClick={() => setBookingFormOpen(true)}
                  className="w-full bg-green-100 text-white hover:bg-green-200"
                >
                  Book Tour
                </Button>
              </motion.div>
            </div>
          </div>

          <motion.section
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-2xl font-bold mb-8">Related Tours</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </motion.section>
        </div>

        <BookingForm
          isOpen={isBookingFormOpen}
          onClose={() => setBookingFormOpen(false)}
          onSubmit={handleBookingSubmit}
          tourTitle={tour.title}
          tourId={tour.id}
        />
      </div>
    </>
  );
};

export default TourDetail;
