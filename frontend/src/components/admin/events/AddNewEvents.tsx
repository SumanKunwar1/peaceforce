import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Event, TicketType } from "@/types/event";
import { addEvent, useEvents } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePicker } from "@/components/ui/time-picker";
import { format } from "date-fns";

const AddEvent: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutate } = useEvents();
  const [eventData, setEventData] = useState<Partial<Event>>({
    title: "",
    shortDescription: "",
    fullDescription: "",
    image: undefined,
    location: "",
    venue: "",
    artist: "",
    ticketTypes: [],
    gallery: [],
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
  });
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    undefined
  );
  const [selectedTime, setSelectedTime] = useState<string>("");

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    isGallery = false
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      if (isGallery) {
        setGalleryFiles([...galleryFiles, ...Array.from(e.target.files)]);
      } else {
        const file = e.target.files[0];
        setEventData({ ...eventData, image: file });
      }
    }
  };

  const handleInputChange = (field: keyof Event, value: string) => {
    setEventData({ ...eventData, [field]: value });
  };

  const handleTicketChange = (
    index: number,
    field: keyof TicketType,
    value: any
  ) => {
    const updatedTickets = [...(eventData.ticketTypes || [])];
    if (field === "price" || field === "available") {
      updatedTickets[index][field] = Number.parseInt(value, 10) || 0;
    } else {
      updatedTickets[index][field] = value;
    }
    setEventData({ ...eventData, ticketTypes: updatedTickets });
  };

  const addNewTicket = () => {
    const newTicket: TicketType = {
      type: "Regular",
      price: 0,
      available: 0,
      benefits: [],
    };
    setEventData({
      ...eventData,
      ticketTypes: [...(eventData.ticketTypes || []), newTicket],
    });
  };

  const handleMetaInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMetaKeywordsChange = (value: string) => {
    const keywords = value.split(",").map((keyword) => keyword.trim());
    setEventData((prevData) => ({
      ...prevData,
      metaKeywords: keywords,
    }));
  };

  const handleSaveEvent = async () => {
    try {
      const formData = new FormData();

      Object.entries(eventData).forEach(([key, value]) => {
        if (key === "ticketTypes") {
          formData.append(key, JSON.stringify(value));
        } else if (key === "image" && value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === "string") {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        }
      });

      galleryFiles.forEach((file) => {
        formData.append("gallery", file);
      });

      if (selectedDate) {
        formData.append("date", format(selectedDate, "yyyy-MM-dd"));
      }

      if (selectedTime) {
        formData.append("time", selectedTime);
      }

      const addedEvent = await addEvent(formData);
      console.assert(addedEvent);

      await mutate();

      toast({
        title: "Event added",
        description: "The new event has been successfully added.",
        duration: 4000,
      });
      navigate("/admin/events");
    } catch (error) {
      console.error("Error adding event:", error);
      toast({
        title: "Error",
        description: "Failed to add event. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

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
        <h1 className="text-3xl font-bold mb-6">Add New Event</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="event-details">
            <Input
              type="text"
              value={eventData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="text-2xl font-bold mb-4"
              placeholder="Enter event title"
            />
            <Textarea
              value={eventData.shortDescription}
              onChange={(e) =>
                handleInputChange("shortDescription", e.target.value)
              }
              className="text-xl mb-6"
              placeholder="Enter short description"
            />
            {eventData.image && (
              <img
                src={
                  eventData.image instanceof File
                    ? URL.createObjectURL(eventData.image)
                    : eventData.image
                }
                alt={eventData.title}
                className="w-full rounded-lg mb-4"
              />
            )}
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
              placeholder="Enter full description"
            />
            <div className="space-y-2">
              {["location", "venue", "artist"].map((field) => (
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
                    placeholder={`Enter ${field}`}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date:
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      {selectedDate ? (
                        format(selectedDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time:
                </label>
                <TimePicker value={selectedTime} onChange={setSelectedTime} />
              </div>
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
                    <Select
                      value={ticket.type}
                      onValueChange={(value) =>
                        handleTicketChange(index, "type", value)
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select ticket type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VVIP">VVIP</SelectItem>
                        <SelectItem value="VIP">VIP</SelectItem>
                        <SelectItem value="Regular">Regular</SelectItem>
                      </SelectContent>
                    </Select>
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
                            placeholder="Enter benefit"
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
                      placeholder="Available tickets"
                    />
                  </p>
                </motion.div>
              ))}
            </div>
            <Button
              onClick={addNewTicket}
              className="mt-4 bg-green-600 text-white"
            >
              Add New Ticket
            </Button>
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
            {galleryFiles.map((file, index) => (
              <motion.div key={index} className="relative">
                <motion.img
                  src={URL.createObjectURL(file)}
                  alt={`Gallery image ${index + 1}`}
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
            onClick={handleSaveEvent}
            className="mt-8 w-[300px] bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Save Event
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
            value={eventData.metaTitle}
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
            value={eventData.metaDescription}
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
            value={eventData.metaKeywords?.join(", ")}
            onChange={(e) => handleMetaKeywordsChange(e.target.value)}
            className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="Enter keywords (comma-separated)"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default AddEvent;
