"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEvent, updateEvent } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Loader from "@/components/Loader";

export interface TicketType {
  id?: string;
  type: "VVIP" | "VIP" | "Regular";
  price: number;
  benefits: string[];
  available: number;
}

export interface Event {
  _id?: string;
  id?: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  date: string;
  time: string;
  image: string | File;
  location: string;
  venue: string;
  artist?: string;
  ticketTypes: TicketType[];
  gallery: (string | File)[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
const EventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { event, isLoading, isError, mutate } = useEvent(id as string);
  const { toast } = useToast();
  const [eventData, setEventData] = useState<Event | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newGalleryImages, setNewGalleryImages] = useState<File[]>([]);

  useEffect(() => {
    if (event) {
      sanitizeEventData(event);
      setEventData(event);
    }
  }, [event]);

  const sanitizeEventData = (data: Event): Event => {
    // Remove fields that are not allowed
    const { _id, createdAt, updatedAt, __v, id, ...sanitizedData } = data;
    return sanitizedData;
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    isGallery = false
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      if (isGallery) {
        setNewGalleryImages([
          ...newGalleryImages,
          ...Array.from(e.target.files),
        ]);
      } else {
        setNewImage(e.target.files[0]);
      }
    }
  };

  const handleInputChange = (field: keyof Event, value: string) => {
    setEventData((prevData) => ({ ...prevData!, [field]: value }));
  };

  const handleTicketChange = (
    index: number,
    field: keyof TicketType,
    value: any
  ) => {
    setEventData((prevData) => {
      const updatedTickets = [...prevData!.ticketTypes];
      if (field === "price" || field === "available") {
        updatedTickets[index][field] = Number.parseInt(value, 10) || 0;
      } else {
        updatedTickets[index][field] = value;
      }
      return { ...prevData!, ticketTypes: updatedTickets };
    });
  };

  console.log("eventData", eventData);

  const handleMetaInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEventData((prevData) => {
      if (!prevData) return null;
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleMetaKeywordsChange = (value: string) => {
    const keywords = value.split(",").map((keyword) => keyword.trim());
    setEventData((prevData) => {
      if (!prevData) return null;
      return {
        ...prevData,
        metaKeywords: keywords,
      };
    });
  };

  const handleSaveUpdates = async () => {
    if (!eventData) return;

    try {
      const sanitizedData = sanitizeEventData(eventData);
      const formData = new FormData();
      Object.entries(sanitizedData).forEach(([key, value]) => {
        if (key === "ticketTypes") {
          formData.append(key, JSON.stringify(value));
        } else if (key === "image" && typeof value === "string") {
          // Don't append the existing image URL
        } else if (typeof value === "string" || typeof value === "number") {
          formData.append(key, String(value));
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        }
      });

      if (newImage) {
        formData.append("image", newImage);
      }

      newGalleryImages.forEach((file) => {
        formData.append("gallery", file);
      });

      await updateEvent(id as string, formData);
      await mutate();
      toast({
        title: "Event updated",
        description: "The event has been successfully updated.",
        duration: 4000,
      });
      navigate("/admin/events");
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );
  if (isError) return <div>Error loading event</div>;
  if (!eventData) return null;

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
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Edit Event</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="event-details">
            <Input
              type="text"
              value={eventData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="text-2xl font-bold mb-4"
            />
            <Textarea
              value={eventData.shortDescription}
              onChange={(e) =>
                handleInputChange("shortDescription", e.target.value)
              }
              className="text-xl mb-6"
            />
            <img
              src={
                newImage
                  ? URL.createObjectURL(newImage)
                  : (eventData.image as string)
              }
              alt={eventData.title}
              className="w-full rounded-lg mb-4"
            />
            <Input
              type="file"
              onChange={(e) => handleImageUpload(e)}
              className="mb-4"
            />
            <Textarea
              value={eventData.fullDescription}
              onChange={(e) =>
                handleInputChange("fullDescription", e.target.value)
              }
              className="mb-4"
            />
            <div className="space-y-2">
              {["location", "venue", "date", "time", "artist"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700">
                    {field.charAt(0).toUpperCase() + field.slice(1)}:
                  </label>
                  <Input
                    type="text"
                    value={(eventData[field as keyof Event] as string) || ""}
                    onChange={(e) =>
                      handleInputChange(field as keyof Event, e.target.value)
                    }
                    className="mt-1 block w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Ticket Types</h2>
            <div className="space-y-4">
              {eventData.ticketTypes?.map((ticket, index) => (
                <motion.div
                  key={index}
                  className="border p-4 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <Input
                      type="text"
                      value={ticket.type || ""}
                      onChange={(e) =>
                        handleTicketChange(index, "type", e.target.value)
                      }
                      className="text-xl font-semibold"
                    />
                    <span className="text-lg font-bold">
                      Rs.
                      <Input
                        type="number"
                        value={ticket.price || 0}
                        onChange={(e) =>
                          handleTicketChange(index, "price", e.target.value)
                        }
                        className="ml-1 w-20"
                      />
                    </span>
                  </div>
                  <ul className="list-disc list-inside mb-2">
                    {ticket.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center">
                        <div className="flex-1">
                          <Input
                            type="text"
                            value={benefit || ""}
                            onChange={(e) => {
                              const updatedBenefits = [...ticket.benefits];
                              updatedBenefits[benefitIndex] = e.target.value;
                              handleTicketChange(
                                index,
                                "benefits",
                                updatedBenefits
                              );
                            }}
                            className="w-full"
                          />
                        </div>
                        <Button
                          onClick={() => {
                            const updatedBenefits = ticket.benefits.filter(
                              (_, i) => i !== benefitIndex
                            );
                            handleTicketChange(
                              index,
                              "benefits",
                              updatedBenefits
                            );
                          }}
                          className="ml-2 text-red-600"
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => {
                      const updatedBenefits = [...ticket.benefits, ""];
                      handleTicketChange(index, "benefits", updatedBenefits);
                    }}
                    className="mt-2 bg-blue-600 text-white"
                  >
                    Add Bullet Point
                  </Button>
                  <p className="text-sm text-gray-600">
                    <Input
                      type="number"
                      value={ticket.available || 0}
                      onChange={(e) =>
                        handleTicketChange(index, "available", e.target.value)
                      }
                      className="w-16"
                    />
                    tickets available
                  </p>
                </motion.div>
              ))}
            </div>
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
            {eventData.gallery?.map((image, index) => (
              <motion.div key={index} className="relative">
                <motion.img
                  src={image as string}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </motion.div>
            ))}
            {newGalleryImages.map((file, index) => (
              <motion.div key={`new-${index}`} className="relative">
                <motion.img
                  src={URL.createObjectURL(file)}
                  alt={`New gallery image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </motion.div>
            ))}
          </div>
          <Input
            type="file"
            multiple
            onChange={(e) => handleImageUpload(e, true)}
            className="mt-4"
          />
        </motion.div>
        <div className="flex justify-center items-center">
          <motion.button
            onClick={handleSaveUpdates}
            className="mt-8 w-[300px] bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Save Updates
          </motion.button>
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
            value={eventData?.metaTitle}
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
            value={eventData?.metaDescription}
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
            value={eventData?.metaKeywords?.join(", ")}
            onChange={(e) => handleMetaKeywordsChange(e.target.value)}
            className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="Enter keywords (comma-separated)"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default EventPage;
