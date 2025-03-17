"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import * as galleryApi from "@/lib/gallery";
import type { IGalleryCategory, IGalleryEvent } from "@/types/gallery";

import Loader from "@/components/Loader";

const Gallery: React.FC = () => {
  const [categories, setCategories] = useState<IGalleryCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [visibleEvents, setVisibleEvents] = useState<IGalleryEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const fetchedCategories = await galleryApi.fetchGalleryCategories();
      setCategories(fetchedCategories);
      if (fetchedCategories.length > 0) {
        setSelectedCategory(fetchedCategories[0].id);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load gallery categories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryEvents(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategoryEvents = async (categoryId: string) => {
    try {
      setIsLoading(true);
      const category = await galleryApi.fetchGalleryCategoryById(categoryId);
      setVisibleEvents(category?.events ? category.events.slice(0, 6) : []);
    } catch (err) {
      console.error("Error fetching category events:", err);
      setError("Failed to load events. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    if (selectedCategory) {
      try {
        const category = await galleryApi.fetchGalleryCategoryById(
          selectedCategory
        );
        setVisibleEvents((prevEvents) => [
          ...prevEvents,
          ...(category?.events
            ? category.events.slice(prevEvents.length, prevEvents.length + 6)
            : []),
        ]);
      } catch (err) {
        console.error("Error loading more events:", err);
        setError("Failed to load more events. Please try again.");
      }
    }
  };
  console.log("categories", categories);

  const handleLearnMore = (categoryId: string, eventId: string) => {
    navigate(`/gallery/${categoryId}/event/${eventId}`);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-green-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        className="bg-gradient-to-r from-green-600 to-green-800 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-4">Gallery</h1>
          <p className="text-green-100">Moments captured at BTMC Foundation</p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === category.id
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-600 hover:bg-green-50"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleEvents.map((event) => (
            <motion.div
              key={event._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={event.coverImage || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={() => handleLearnMore(selectedCategory!, event._id!)}
                  className="mt-4 text-white bg-green-600 px-4 py-2 rounded-full hover:bg-green-700 transition-colors"
                >
                  Learn More
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {visibleEvents.length <
          (categories?.find((cat) => cat.id === selectedCategory)?.events
            ?.length || 0) && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
