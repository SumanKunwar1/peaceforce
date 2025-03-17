"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById } from "@/lib/gallery";
import type { IGalleryEvent } from "@/types/gallery";

import Loader from "@/components/Loader";

const GalleryDetail: React.FC = () => {
  const { categoryId, _id } = useParams<{
    categoryId: string;
    _id: string;
  }>();
  const [eventDetails, setEventDetails] = useState<IGalleryEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log("CategoryId", categoryId, "EventId", _id);
  useEffect(() => {
    fetchEventDetails();
  }, []); // Updated dependency array

  const fetchEventDetails = async () => {
    if (!categoryId || !_id) {
      setError("Invalid category or event ID");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const event = await getEventById(categoryId, _id);
      if (event) {
        setEventDetails(event);
      } else {
        setError("Event not found");
      }
    } catch (err) {
      console.error("Error fetching event details:", err);
      setError("Failed to load event details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  console.log("eventDetails", eventDetails);

  if (error || !eventDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-green-500">{error || "Event not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          {eventDetails.title}
        </h1>
        <p className="text-gray-700 mb-4">{eventDetails.description}</p>
        <p className="text-gray-500 text-sm mb-6">
          Date: {new Date(eventDetails.date).toLocaleDateString()}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventDetails.images &&
            eventDetails.images.map((image, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Image ${index + 1}`}
                  className="w-full h-64 object-cover"
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryDetail;
