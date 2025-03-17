import type React from "react";
import { useState } from "react";
import { Clock, MapPin, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createTour } from "@/lib/toursApi";
import type { Tour } from "@/types/tour";
import { useToast } from "@/hooks/use-toast";

const TourCreate: React.FC = () => {
  const [tourData, setTourData] = useState<Partial<Tour>>({
    title: "",
    location: "",
    duration: "",
    days: 0,
    startDate: "",
    description: "",
    highlights: [""],
    itinerary: [{ day: 1, description: "" }],
    inclusions: [""],
    activities: [""],
    image: "",
    status: "Upcoming",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (
    field: keyof Tour,
    value:
      | string
      | number
      | File
      | string[]
      | { day: number; description: string }[]
  ) => {
    setTourData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleAddHighlight = () => {
    setTourData((prevData) => ({
      ...prevData,
      highlights: [...(prevData.highlights || []), ""],
    }));
  };

  const handleAddItinerary = () => {
    setTourData((prevData) => ({
      ...prevData,
      itinerary: [
        ...(prevData.itinerary || []),
        { day: (prevData.itinerary?.length || 0) + 1, description: "" },
      ],
    }));
  };

  const handleAddInclusion = () => {
    setTourData((prevData) => ({
      ...prevData,
      inclusions: [...(prevData.inclusions || []), ""],
    }));
  };

  const handleAddActivity = () => {
    setTourData((prevData) => ({
      ...prevData,
      activities: [...(prevData.activities || []), ""],
    }));
  };

  const handleDeleteHighlight = (index: number) => {
    const newHighlights =
      tourData.highlights?.filter((_, i) => i !== index) || [];
    handleInputChange("highlights", newHighlights);
  };

  const handleDeleteItinerary = (index: number) => {
    const newItinerary =
      tourData.itinerary?.filter((_, i) => i !== index) || [];
    handleInputChange("itinerary", newItinerary);
  };

  const handleDeleteInclusion = (index: number) => {
    const newInclusions =
      tourData.inclusions?.filter((_, i) => i !== index) || [];
    handleInputChange("inclusions", newInclusions);
  };

  const handleDeleteActivity = (index: number) => {
    const newActivities =
      tourData.activities?.filter((_, i) => i !== index) || [];
    handleInputChange("activities", newActivities);
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
    setTourData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMetaKeywordsChange = (value: string) => {
    const keywords = value.split(",").map((keyword) => keyword.trim());
    setTourData((prevData) => ({
      ...prevData,
      metaKeywords: keywords,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      await createTour(tourData);
      toast({
        title: "Success",
        description: "Tour created successfully.",
      });
      navigate("/admin/tours");
    } catch (error) {
      console.error("Error creating tour:", error);
      toast({
        title: "Error",
        description: "Failed to create tour. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        className="relative h-[60vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={imagePreview || ""}
          alt="Tour preview"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 text-white">
            <motion.input
              className="bg-transparent text-4xl md:text-5xl font-bold mb-4 border-none outline-none"
              placeholder="Tour Title"
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
                  className="bg-transparent text-white border-b border-white outline-none"
                  placeholder="Duration (days)"
                  value={tourData.days}
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
                  className="bg-transparent text-white border-b border-white outline-none"
                  placeholder="Location"
                  value={tourData.location}
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
                  onChange={(e) =>
                    handleInputChange(
                      "status",
                      e.target.value as Tour["status"]
                    )
                  }
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
                placeholder="Write a description of the tour..."
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
              {tourData.highlights?.map((highlight, index) => (
                <div key={index} className="flex items-center space-x-4 mb-4">
                  <CheckCircle className="w-5 h-5 text-red-600" />
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2"
                    placeholder="Add a highlight"
                    value={highlight}
                    onChange={(e) => {
                      const newHighlights = [...(tourData.highlights || [])];
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
                className="text-red-600 hover:text-red-700"
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
              {tourData.itinerary?.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-sm mb-4"
                >
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2 mb-2"
                    placeholder={`Day ${index + 1} itinerary description`}
                    value={item.description}
                    onChange={(e) => {
                      const newItinerary = [...(tourData.itinerary || [])];
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
                className="text-red-600 hover:text-red-700"
              >
                Add New Day to Itinerary
              </button>
            </motion.section>
          </div>

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
              {tourData.inclusions?.map((inclusion, index) => (
                <div key={index} className="flex items-center space-x-4 mb-4">
                  <CheckCircle className="w-5 h-5 text-red-600" />
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2"
                    placeholder="Add an inclusion"
                    value={inclusion}
                    onChange={(e) => {
                      const newInclusions = [...(tourData.inclusions || [])];
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
                className="text-red-600 hover:text-red-700"
              >
                Add New Inclusion
              </button>
            </motion.section>

            {/* Activities Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <h2 className="text-2xl font-bold mb-4">Tour Activities</h2>
              {tourData.activities?.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 mb-4">
                  <CheckCircle className="w-5 h-5 text-red-600" />
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2"
                    placeholder="Add an activity"
                    value={activity}
                    onChange={(e) => {
                      const newActivities = [...(tourData.activities || [])];
                      newActivities[index] = e.target.value;
                      handleInputChange("activities", newActivities);
                    }}
                  />
                  <button
                    onClick={() => handleDeleteActivity(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddActivity}
                className="text-red-600 hover:text-red-700"
              >
                Add New Activity
              </button>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <button
                onClick={handleSaveChanges}
                className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
              >
                Save Tour
              </button>
            </motion.section>
          </div>
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

export default TourCreate;
