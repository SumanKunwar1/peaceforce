import BriefAboutSection from "../../components/admin/home/BriefAboutSection";
import ServiceSection from "../../components/admin/home/ServiceSection";
import ProgramSection from "../../components/admin/home/ProgramsSection";
import TestimonialsSection from "../../components/admin/home/TestimonialSection";
import StatsSection from "../../components/admin/home/StatSection";
import LocationSection from "../../components/admin/home/LocationSection";
import { useState } from "react";
import { motion } from "framer-motion";

type SectionKeys =
  | "showBriefAbout"
  | "showService"
  | "showPrograms"
  | "showTestimonial"
  | "showStat"
  | "showLocation";

const HomeAdmin = () => {
  const [sections, setSections] = useState<Record<SectionKeys, boolean>>({
    showBriefAbout: true,
    showService: true,
    showPrograms: true,
    showTestimonial: true,
    showStat: true,
    showLocation: true,
  });

  const toggleSection = (section: SectionKeys) => {
    setSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderSection = (Component: React.FC, sectionName: SectionKeys) => (
    <div className="mb-4">
      {sections[sectionName] && <Component />}
      <button
        onClick={() => toggleSection(sectionName)}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        {sections[sectionName] ? `Hide ${sectionName}` : `Show ${sectionName}`}
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">About Page Admin Panel</h1>
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold">BriefAbout Section</h2>
          {renderSection(BriefAboutSection, "showBriefAbout")}
        </div>
        <div>
          <h2 className="text-xl font-semibold">Service Section</h2>
          {renderSection(ServiceSection, "showService")}
        </div>
        <div>
          <h2 className="text-xl font-semibold"></h2>
          {renderSection(ProgramSection, "showPrograms")}
        </div>
        <div>
          <h2 className="text-xl font-semibold">Testimonial Section</h2>
          {renderSection(TestimonialsSection, "showTestimonial")}
        </div>
        <div>
          <h2 className="text-xl font-semibold">Stats Section</h2>
          {renderSection(StatsSection, "showStat")}
        </div>
        <div>
          <h2 className="text-xl font-semibold">Location Section</h2>
          {renderSection(LocationSection, "showLocation")}
        </div>
        <div className=" mx-auto p-6 rounded-lg">
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
              className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="Enter keywords (comma-separated)"
            />
          </div>
        </div>
        {/* Save Update Button */}
        <div className="mt-8 flex justify-center">
          <motion.button
            onClick={() => {
              console.log("Changes saved!");
              // Add logic for saving changes
            }}
            className="bg-red-600 text-white px-6 py-2 rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Save Update
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;
