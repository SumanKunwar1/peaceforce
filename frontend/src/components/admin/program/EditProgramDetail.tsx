"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Clock, CheckCircle } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import type { IProgram } from "@/types/program";
import { useProgram, useUpdateProgram } from "@/lib/api";
import { Textarea } from "@/components/ui/textarea";
import Loader from "@/components/Loader";
import { toast } from "@/hooks/use-toast";

const EditProgramDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { program: fetchedProgram, isLoading, isError } = useProgram(id!);
  const { trigger: updateProgram } = useUpdateProgram(id!);
  const [program, setProgram] = useState<IProgram | null>(null);
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [newBannerImage, setNewBannerImage] = useState<File | null>(null);

  useEffect(() => {
    if (fetchedProgram) {
      setProgram(fetchedProgram);
    }
  }, [fetchedProgram]);

  if (isLoading) return <Loader />;
  if (isError) return <div>Error loading program</div>;
  if (!program) return null;

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewBannerImage(e.target.files[0]);
    }
  };

  const handleFieldChange = (field: keyof IProgram, value: any) => {
    setProgram((prevProgram) => {
      if (!prevProgram) return prevProgram;
      return { ...prevProgram, [field]: value };
    });
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newGallery = Array.from(e.target.files);
      handleFieldChange("gallery", newGallery);
    }
  };

  const handleAddGoal = () => {
    setProgram((prevProgram) => {
      if (!prevProgram) return prevProgram;
      return {
        ...prevProgram,
        programGoals: [...prevProgram.programGoals, ""],
      };
    });
  };

  const handleRemoveGoal = (index: number) => {
    setProgram((prevProgram) => {
      if (!prevProgram) return prevProgram;
      return {
        ...prevProgram,
        programGoals: prevProgram.programGoals.filter((_, i) => i !== index),
      };
    });
  };

  const handleGoalChange = (index: number, value: string) => {
    setProgram((prevProgram) => {
      if (!prevProgram) return prevProgram;
      const updatedGoals = [...prevProgram.programGoals];
      updatedGoals[index] = value;
      return {
        ...prevProgram,
        programGoals: updatedGoals,
      };
    });
  };

  const handleMetaKeywordsChange = (value: string) => {
    const keywords = value.split(",").map((keyword) => keyword.trim());
    setProgram((prevProgram) => {
      if (!prevProgram) return prevProgram;
      return { ...prevProgram, metaKeywords: keywords };
    });
  };

  const handleTicketChange = (index: number, value: string) => {
    setProgram((prevProgram) => {
      if (!prevProgram) return prevProgram;
      const ticketTypesArray = prevProgram.ticketTypes.split(",");
      ticketTypesArray[index] = value;
      return { ...prevProgram, ticketTypes: ticketTypesArray.join(",") };
    });
  };

  const handleAddTicket = () => {
    setProgram((prevProgram) => {
      if (!prevProgram) return prevProgram;
      return {
        ...prevProgram,
        ticketTypes: prevProgram.ticketTypes + ",",
      };
    });
  };

  const handleRemoveTicket = (index: number) => {
    setProgram((prevProgram) => {
      if (!prevProgram) return prevProgram;
      const ticketTypesArray = prevProgram.ticketTypes.split(",");
      ticketTypesArray.splice(index, 1);
      return { ...prevProgram, ticketTypes: ticketTypesArray.join(",") };
    });
  };

  const handleSubmit = async () => {
    if (!program) return;

    try {
      const formData = new FormData();
      Object.entries(program).forEach(([key, value]) => {
        if (
          !["_id", "goals", "createdAt", "updatedAt", "__v", "id"].includes(key)
        ) {
          if (key === "image" && newBannerImage) {
            formData.append("image", newBannerImage);
          } else if (key === "gallery" && Array.isArray(value)) {
            value.forEach((file: File) => formData.append("gallery", file));
          } else if (key === "metaKeywords" && Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (Array.isArray(value) || typeof value === "object") {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value as string);
          }
        }
      });

      await updateProgram(formData);

      toast({
        title: "Program Updated",
        description: "The program has been successfully updated.",
      });

      navigate("/admin/programs");
    } catch (error) {
      console.error("Error updating program:", error);

      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update the program. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <motion.div
          className="relative h-[60vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {isEditingBanner ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="mb-4 text-white"
              />
              <button
                onClick={() => setIsEditingBanner(false)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Save Banner
              </button>
            </div>
          ) : (
            <>
              <img
                src={
                  (program.image as string | undefined) || "/placeholder.svg"
                }
                alt={program.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50" />
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 text-white">
                  <input
                    type="text"
                    value={program.title}
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                    className="text-4xl md:text-5xl bg-transparent font-bold mb-4"
                  />
                  <motion.div
                    className="flex items-center gap-6 flex-wrap"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      <div className="flex space-x-2">
                        <input
                          type="date"
                          value={program.startDate}
                          onChange={(e) =>
                            handleFieldChange("startDate", e.target.value)
                          }
                          className="text-white bg-transparent border-b border-white"
                        />
                        <span className="text-white">to</span>
                        <input
                          type="date"
                          value={program.endDate}
                          onChange={(e) =>
                            handleFieldChange("endDate", e.target.value)
                          }
                          className="text-white bg-transparent border-b border-white"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      <input
                        type="text"
                        value={program.location}
                        onChange={(e) =>
                          handleFieldChange("location", e.target.value)
                        }
                        className="text-white bg-transparent border-b border-white"
                      />
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      <input
                        type="text"
                        value={program.time}
                        onChange={(e) =>
                          handleFieldChange("time", e.target.value)
                        }
                        className="text-white bg-transparent border-b border-white"
                      />
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      <input
                        type="number"
                        value={program.capacity}
                        onChange={(e) =>
                          handleFieldChange(
                            "capacity",
                            Number.parseInt(e.target.value)
                          )
                        }
                        className="text-white bg-transparent border-b border-white"
                      />
                    </div>
                  </motion.div>
                  <button
                    onClick={() => setIsEditingBanner(true)}
                    className="mt-4 px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
                  >
                    Edit Banner
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <motion.section>
                <h2 className="text-2xl font-bold mb-4">About the Program</h2>
                <textarea
                  value={program.fullDescription}
                  onChange={(e) =>
                    handleFieldChange("fullDescription", e.target.value)
                  }
                  className="w-full p-4 h-60 border border-gray-300 rounded"
                />
              </motion.section>

              <motion.section>
                <h2 className="text-2xl font-bold mb-4">Short Description</h2>
                <Textarea
                  value={program.shortDescription}
                  onChange={(e) =>
                    handleFieldChange("shortDescription", e.target.value)
                  }
                  className="w-full p-4 h-20 border border-gray-300 rounded"
                  placeholder="Enter a short description of the program"
                />
              </motion.section>

              <motion.section>
                <h2 className="text-2xl font-bold mb-4">Program Goals</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {program.programGoals?.map((goal, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-red-600 mt-1" />
                      <input
                        type="text"
                        value={goal}
                        onChange={(e) =>
                          handleGoalChange(index, e.target.value)
                        }
                        placeholder="Write the goal"
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                      />
                      <button
                        onClick={() => handleRemoveGoal(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleAddGoal}
                    className="text-red-600 hover:text-red-700"
                  >
                    + Add Goal
                  </button>
                </div>
              </motion.section>

              <motion.section>
                <h2 className="text-2xl font-bold mb-4">Ticket Type</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {program.ticketTypes?.split(",").map((ticket, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-red-600 mt-1" />
                      <input
                        type="text"
                        value={ticket}
                        onChange={(e) =>
                          handleTicketChange(index, e.target.value)
                        }
                        placeholder="Write the ticket type"
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                      />
                      <button
                        onClick={() => handleRemoveTicket(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleAddTicket}
                    className="text-red-600 hover:text-red-700"
                  >
                    + Add Ticket
                  </button>
                </div>
              </motion.section>

              <motion.section>
                <h2 className="text-2xl font-bold mb-4">Venue</h2>
                <input
                  type="text"
                  value={program.venue}
                  onChange={(e) => handleFieldChange("venue", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter the venue"
                />
              </motion.section>

              <motion.section>
                <h2 className="text-2xl font-bold mb-4">Instructor</h2>
                <input
                  type="text"
                  value={program.instructor}
                  onChange={(e) =>
                    handleFieldChange("instructor", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter the instructor's name"
                />
              </motion.section>

              <motion.section>
                <h2 className="text-2xl font-bold mb-4">Schedule</h2>
                <Textarea
                  value={program.schedule}
                  onChange={(e) =>
                    handleFieldChange("schedule", e.target.value)
                  }
                  className="w-full p-4 h-40 border border-gray-300 rounded"
                  placeholder="Enter the program schedule"
                />
              </motion.section>

              <motion.section>
                <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                <div className="space-y-2">
                  {program.requirements?.map((requirement, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={requirement}
                        onChange={(e) => {
                          const newRequirements = [...program.requirements];
                          newRequirements[index] = e.target.value;
                          handleFieldChange("requirements", newRequirements);
                        }}
                        className="flex-grow p-2 border border-gray-300 rounded"
                        placeholder={`Requirement ${index + 1}`}
                      />
                      <button
                        onClick={() => {
                          const newRequirements = program.requirements.filter(
                            (_, i) => i !== index
                          );
                          handleFieldChange("requirements", newRequirements);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      handleFieldChange("requirements", [
                        ...program.requirements,
                        "",
                      ])
                    }
                    className="text-red-600 hover:text-red-700"
                  >
                    + Add Requirement
                  </button>
                </div>
              </motion.section>

              <motion.section>
                <h2 className="text-2xl font-bold mb-4">Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {program.gallery?.map((image, index) => (
                    <img
                      key={index}
                      src={
                        typeof image === "string"
                          ? image
                          : URL.createObjectURL(image)
                      }
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryChange}
                  className="mt-4"
                />
              </motion.section>
            </div>

            <div className="lg:col-span-1">
              <motion.div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">Program Details</h3>
                <div>
                  <div className="flex justify-between">
                    <span>Start Date:</span>
                    <span>{program.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>End Date:</span>
                    <span>{program.endDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span>{program.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span>{program.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Capacity:</span>
                    <span>{program.capacity}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          <div className="mx-auto mt-5 rounded-lg">
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
                value={program.metaTitle || ""}
                onChange={(e) => handleFieldChange("metaTitle", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter the meta title"
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
                value={program.metaDescription || ""}
                onChange={(e) =>
                  handleFieldChange("metaDescription", e.target.value)
                }
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
                value={
                  program.metaKeywords ? program.metaKeywords.join(", ") : ""
                }
                onChange={(e) => handleMetaKeywordsChange(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Enter keywords (comma-separated)"
              />
            </div>
          </div>

          <motion.section>
            <div className="flex justify-center mt-8">
              <button
                onClick={handleSubmit}
                className="w-[30%] bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                Update Program
              </button>
            </div>
          </motion.section>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditProgramDetail;
