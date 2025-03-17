"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, MapPin, CheckCircle } from "lucide-react";
import { getTourById, updateTour } from "@/lib/toursApi";
import type { Tour } from "@/types/tour";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/Loader";

const TourEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tourData, setTourData] = useState<Tour | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchTourData();
    }
  }, [id]);

  const fetchTourData = async () => {
    try {
      const fetchedTour = await getTourById(id as string);
      setTourData(fetchedTour);
      setImagePreview(
        typeof fetchedTour.image === "string"
          ? fetchedTour.image
          : URL.createObjectURL(fetchedTour.image as File)
      );
    } catch (error) {
      console.error("Error fetching tour:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tour. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (
    field: keyof Tour,
    value:
      | string
      | number
      | File
      | string[]
      | { day: number; description: string }[]
  ) => {
    setTourData((prevTour) => {
      if (!prevTour) return null;

      if (field === "itinerary") {
        return {
          ...prevTour,
          itinerary: value as { day: number; description: string }[],
        };
      }

      return {
        ...prevTour,
        [field]: value,
      };
    });
  };

  const handleAddHighlight = () => {
    setTourData((prevTour) =>
      prevTour
        ? { ...prevTour, highlights: [...prevTour.highlights, ""] }
        : null
    );
  };

  const handleAddItinerary = () => {
    setTourData((prevTour) =>
      prevTour
        ? {
            ...prevTour,
            itinerary: [
              ...prevTour.itinerary,
              { day: prevTour.itinerary.length + 1, description: "" },
            ],
          }
        : null
    );
  };

  const handleAddInclusion = () => {
    setTourData((prevTour) =>
      prevTour
        ? { ...prevTour, inclusions: [...(prevTour.inclusions || []), ""] }
        : null
    );
  };

  // Delete functions
  const handleDeleteHighlight = (index: number) => {
    setTourData((prevTour) => {
      if (!prevTour) return null;
      const newHighlights = prevTour.highlights.filter((_, i) => i !== index);
      return { ...prevTour, highlights: newHighlights };
    });
  };

  const handleDeleteItinerary = (index: number) => {
    setTourData((prevTour) => {
      if (!prevTour) return null;
      const newItinerary = prevTour.itinerary.filter((_, i) => i !== index);
      return { ...prevTour, itinerary: newItinerary };
    });
  };

  const handleDeleteInclusion = (index: number) => {
    setTourData((prevTour) => {
      if (!prevTour) return null;
      const newInclusions = prevTour.inclusions.filter((_, i) => i !== index);
      return { ...prevTour, inclusions: newInclusions };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      handleInputChange("image", file);
    }
  };

  const handleMetaInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTourData((prevTour) => {
      if (!prevTour) return null;
      return {
        ...prevTour,
        [name]: value,
      };
    });
  };

  const handleMetaKeywordsChange = (value: string) => {
    const keywords = value.split(",").map((keyword) => keyword.trim());
    setTourData((prevTour) => {
      if (!prevTour) return null;
      return {
        ...prevTour,
        metaKeywords: keywords,
      };
    });
  };

  const handleSaveChanges = async () => {
    if (!tourData) return;

    try {
      // Create a new object with only the fields we want to update
      const updatedTourData = {
        ...tourData,
        status:
          tourData.status.charAt(0).toUpperCase() + tourData.status.slice(1),
        itinerary: tourData.itinerary.map(({ day, description }) => ({
          day,
          description,
        })),
      };

      // Use the id from the URL parameter instead of from the tourData object
      // The sanitization will happen in the updateTour function
      await updateTour(id as string, updatedTourData as Tour);

      toast({
        title: "Success",
        description: "Tour updated successfully.",
      });
      navigate("/admin/tours");
    } catch (error) {
      console.error("Error updating tour:", error);
      toast({
        title: "Error",
        description: "Failed to update tour. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!tourData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            <Loader />
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        className="relative h-[60vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={
            imagePreview ||
            (typeof tourData.image === "string"
              ? tourData.image
              : URL.createObjectURL(tourData.image as File))
          }
          alt={tourData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 text-white">
            <motion.input
              className="bg-transparent text-4xl md:text-5xl font-bold mb-4 border-none outline-none"
              value={tourData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
            <motion.div
              className="flex items-center gap-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <input
                  type="number"
                  value={tourData.days}
                  className="bg-transparent text-white border-b border-white outline-none"
                  onChange={(e) =>
                    handleInputChange(
                      "days",
                      Number.parseInt(e.target.value, 10)
                    )
                  }
                />
                <span>Days</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <input
                  type="text"
                  value={tourData.location}
                  className="bg-transparent text-white border-b border-white outline-none"
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {/* Start Date and Status Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-4">Start Date & Status</h2>
              <div className="flex space-x-4 mb-4">
                <input
                  type="date"
                  className="w-1/2 border rounded-lg p-2"
                  value={tourData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                />
                <select
                  className="w-1/2 border rounded-lg p-2"
                  value={tourData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-4">Tour Overview</h2>
              <textarea
                className="w-full border rounded-lg p-4"
                rows={6}
                value={tourData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold mb-4">Tour Highlights</h2>
              {tourData.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center space-x-4 mb-4">
                  <CheckCircle className="w-5 h-5 text-red-600" />
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2"
                    value={highlight}
                    onChange={(e) => {
                      const newHighlights = [...tourData.highlights];
                      newHighlights[index] = e.target.value;
                      handleInputChange("highlights", newHighlights);
                    }}
                  />
                  <button
                    onClick={() => handleDeleteHighlight(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddHighlight}
                className="text-blue-600 hover:text-blue-700"
              >
                Add New Highlight
              </button>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-2xl font-bold mb-4">Itinerary</h2>
              {tourData.itinerary.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-sm mb-4"
                >
                  <input
                    type="text"
                    value={item.description}
                    className="w-full border rounded-lg p-2 mb-2"
                    onChange={(e) => {
                      const newItinerary = [...tourData.itinerary];
                      newItinerary[index].description = e.target.value;
                      handleInputChange("itinerary", newItinerary);
                    }}
                  />
                  <button
                    onClick={() => handleDeleteItinerary(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddItinerary}
                className="text-blue-600 hover:text-blue-700"
              >
                Add New Day to Itinerary
              </button>
            </motion.section>
          </div>

          {/* Right side content */}
          <div className="space-y-8">
            {/* File Upload Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-2xl font-bold mb-4">Upload Image</h2>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border rounded-lg p-2"
              />
            </motion.section>

            {/* Inclusions Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <h2 className="text-2xl font-bold mb-4">Tour Inclusions</h2>
              {(tourData.inclusions || []).map((inclusion, index) => (
                <div key={index} className="flex items-center space-x-4 mb-4">
                  <CheckCircle className="w-5 h-5 text-red-600" />
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2"
                    value={inclusion}
                    onChange={(e) => {
                      const newInclusions = [...tourData.inclusions];
                      newInclusions[index] = e.target.value;
                      handleInputChange("inclusions", newInclusions);
                    }}
                  />
                  <button
                    onClick={() => handleDeleteInclusion(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddInclusion}
                className="text-blue-600 hover:text-blue-700"
              >
                Add New Inclusion
              </button>
            </motion.section>

            {/* Book Now Button */}
            <button className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 mb-4">
              Book Now
            </button>
          </div>
        </div>

        {/* Save Changes Button at the bottom */}
        <div className="w-full flex justify-center mt-8">
          <button
            onClick={handleSaveChanges}
            className="w-1/3 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Save Changes
          </button>
        </div>
      </div>
      <div className="mx-auto mt-5 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          SEO Meta Information
        </h2>

        {/* Meta Title */}
        <div className="mb-4">
          <label
            htmlFor="metaTitle"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Meta Title
          </label>
          <input
            type="text"
            id="metaTitle"
            name="metaTitle"
            value={tourData.metaTitle}
            onChange={handleMetaInputChange}
            className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="Enter meta title"
          />
        </div>

        {/* Meta Description */}
        <div className="mb-4">
          <label
            htmlFor="metaDescription"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Meta Description
          </label>
          <textarea
            id="metaDescription"
            name="metaDescription"
            value={tourData.metaDescription}
            onChange={handleMetaInputChange}
            rows={3}
            className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="Enter meta description"
          />
        </div>

        {/* Meta Keywords */}
        <div className="mb-4">
          <label
            htmlFor="metaKeywords"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Meta Keywords
          </label>
          <input
            type="text"
            id="metaKeywords"
            name="metaKeywords"
            value={tourData.metaKeywords?.join(", ")}
            onChange={(e) => handleMetaKeywordsChange(e.target.value)}
            className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="Enter keywords (comma-separated)"
          />
        </div>
      </div>
    </div>
  );
};

export default TourEdit;
