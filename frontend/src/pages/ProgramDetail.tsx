"use client";

import type React from "react";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import ProgramRegistrationForm from "../components/Programs/ProgramRegistrationForm";
import ProgramCard from "../components/Programs/ProgramCard";
import type { ProgramRegistrationData } from "../types/program";
import { useProgram, usePrograms } from "@/lib/api";
import { bookProgram } from "@/lib/book-program";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/Loader";
import { Helmet } from "react-helmet-async";

const ProgramDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const { toast } = useToast();

  const { program, isLoading, isError } = useProgram(id || "");
  const { programs } = usePrograms();

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (isError || !program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Program Not Found</h2>
          <Link to="/programs" className="text-green-100 hover:text-green-200">
            Back to Programs
          </Link>
        </div>
      </div>
    );
  }

  const relatedPrograms = programs
    ?.filter((p) => p.id !== program.id)
    .slice(0, 3);

  const handleRegistration = async (data: ProgramRegistrationData) => {
    try {
      await bookProgram(program.id, data);
      setIsRegistrationOpen(false);
      toast({
        title: "Registration Successful",
        description:
          "Thank you for joining the program! We'll contact you soon.",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error booking program:", error);
      toast({
        title: "Registration Failed",
        description:
          "There was an error registering for the program. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>{program.metaTitle}</title>
        <meta name="description" content={program.metaDescription} />
        <meta name="keywords" content={program.metaKeywords?.join(", ")} />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <motion.div
          className="relative h-[60vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={program.image as string | undefined}
            alt={program.title}
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
                {program.title}
              </motion.h1>
              <motion.div
                className="flex items-center gap-6 flex-wrap"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>
                    {new Date(program.startDate).toLocaleDateString()} -{" "}
                    {new Date(program.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{program.location}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{program.time}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  <span>Capacity: {program.capacity} participants</span>
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
                <h2 className="text-2xl font-bold mb-4">About the Program</h2>
                <p className="text-gray-700">{program.fullDescription}</p>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-4">Program Goals</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {program.programGoals?.map((goal, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-2 text-gray-700"
                    >
                      <span className="w-2 h-2 rounded-full bg-green-100 mt-2" />
                      <span>{goal}</span>
                    </div>
                  ))}
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-2xl font-bold mb-4">Program's Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {program.gallery.map((image, index) => (
                    <img
                      key={index}
                      src={image || "/placeholder.svg"}
                      alt={`${program.title} - Image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
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
                <h3 className="text-xl font-bold mb-4">Program Details</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-gray-700">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span>Date</span>
                    </div>
                    <span>
                      {new Date(program.startDate).toLocaleDateString()} -{" "}
                      {new Date(program.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      <span>Time</span>
                    </div>
                    <span>{program.time}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>Location</span>
                    </div>
                    <span>{program.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      <span>Capacity</span>
                    </div>
                    <span>{program.capacity} participants</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsRegistrationOpen(true)}
                  className="w-full bg-green-100 text-white py-3 rounded-lg hover:bg-green-200 transition-colors"
                >
                  Join Program
                </button>
              </motion.div>
            </div>
          </div>

          <motion.section
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-2xl font-bold mb-8">Related Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPrograms?.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          </motion.section>
        </div>

        <ProgramRegistrationForm
          isOpen={isRegistrationOpen}
          onClose={() => setIsRegistrationOpen(false)}
          onSubmit={handleRegistration}
          programTitle={program.title}
          programId={program.id}
        />
      </div>
    </>
  );
};

export default ProgramDetail;
