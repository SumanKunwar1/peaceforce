"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";
import useSWR from "swr";
import { careersApi } from "@/lib/careersApi";
import CareerForm from "./CareerForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { JobPosting as IJobPosting } from "@/types/career";
import { Helmet } from "react-helmet-async";

const Career = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<IJobPosting | null>(null);

  const { data: jobPostings, error } = useSWR<IJobPosting[]>(
    "jobPostings",
    careersApi.getJobPostings
  );

  const openForm = (job: IJobPosting) => {
    setSelectedJob(job);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedJob(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.div
        className="bg-gradient-to-r from-green-600 to-green-800 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-white mb-2">Careers</h1>
          <p className="text-green-200 text-lg">
            Explore exciting opportunities to join our team and make a
            difference.
          </p>
        </div>
      </motion.div>

      {/* Job Listings Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {error && (
          <div className="text-green-600 text-center">
            Error loading job postings. Please try again later.
          </div>
        )}
        {!jobPostings && !error && (
          <div className="space-y-12">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="h-64 w-full" />
            ))}
          </div>
        )}
        {jobPostings?.map((job: IJobPosting) => (
          <JobPosting key={job.id} job={job} onApply={() => openForm(job)} />
        ))}
      </div>

      {/* Application Form Modal */}
      {isFormOpen && (
        <CareerForm
          selectedJob={selectedJob}
          isOpen={isFormOpen}
          onClose={closeForm}
        />
      )}
    </div>
  );
};

type JobPostingProps = {
  job: IJobPosting;
  onApply: () => void;
};

const JobPosting = ({ job, onApply }: JobPostingProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDetails = () => {
    setIsOpen(!isOpen);
  };

  // Check if the deadline has expired
  const isExpired = new Date(job.deadline) < new Date();

  return (
    <>
      <Helmet>
        <title>{job.metaTitle}</title>
        <meta name="description" content={job.metaDescription} />
        <meta name="keywords" content={job?.metaKeywords?.join(", ")} />
      </Helmet>
      <motion.div
        className="bg-white shadow-lg rounded-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {/* Job Header */}
        <div className="flex flex-wrap justify-between items-center p-6 bg-gray-100 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
            <div className="flex flex-wrap items-center text-sm text-gray-600 mt-2 space-x-6">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1 text-gray-500" />
                <span>{job.type}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                <span>
                  Apply by {new Date(job.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          {isExpired ? (
            <div className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md">
              Expired
            </div>
          ) : (
            <Button
              onClick={onApply}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Apply Now
            </Button>
          )}
        </div>

        {/* Job Details Dropdown */}
        <div className="p-6">
          <Button
            variant="link"
            className="text-green-600 font-semibold mb-4"
            onClick={toggleDetails}
          >
            {isOpen ? "Hide Details" : "View Details"}
          </Button>

          {/* Conditional Rendering of Details */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-700 mb-6">{job.description}</p>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Requirements
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {job.requirements.map((req: string, index: number) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Responsibilities
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {job.responsibilities.map((resp: string, index: number) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Benefits
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {job.benefits.map((benefit: string, index: number) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Career;
