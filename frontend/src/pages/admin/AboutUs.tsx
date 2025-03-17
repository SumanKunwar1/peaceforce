"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import AboutHero from "../../components/admin/about/AboutHero";
import AboutContent from "../../components/admin/about/AboutContent";
import AboutMission from "../../components/admin/about/AboutMission";
import AboutServices from "../../components/admin/about/AboutServices";
import AboutVision from "../../components/admin/about/AboutVision";
import AddMission from "../../components/admin/about/AddMission";
import { aboutApi } from "@/lib/aboutApi";
import { IAbout, IAboutInput, IAboutContentInput } from "../../types/about";

type SectionKeys =
  | "showHero"
  | "showContent"
  | "showMission"
  | "showServices"
  | "showVision"
  | "showAddMission";

const emptyAboutData: IAbout = {
  _id: "",
  aboutHero: { title: "", description: "" },
  aboutContent: [{ title: "", description: "", icon: "" }],
  missionsSection: [],
  servicesSection: [],
  visionSection: [{ title: "", description: "", icon: "" }],
  image: "",
  createdAt: "",
  updatedAt: "",
  __v: 0,
  id: "",
};

const AboutUs: React.FC = () => {
  const [sections, setSections] = useState<Record<SectionKeys, boolean>>({
    showHero: true,
    showContent: true,
    showMission: true,
    showServices: true,
    showVision: true,
    showAddMission: true,
  });

  const [aboutData, setAboutData] = useState<IAbout>(emptyAboutData);
  const [isLoading, setIsLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await aboutApi.getAbout();
        if (response.about && response.about.length > 0) {
          setAboutData(response.about[0]);
        }
      } catch (err) {
        console.error("Failed to fetch about data:", err);
        toast({
          title: "Error fetching data",
          description:
            "Failed to load existing data. You can still add new data.",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, [toast]);

  const toggleSection = (section: SectionKeys) => {
    setSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleUpdateAbout = (updatedData: Partial<IAboutInput>) => {
    setAboutData((prevData) => ({
      ...prevData,
      ...updatedData,
    }));
  };

  const handleImageUpload = (file: File) => {
    setImageFile(file);
  };

  const saveUpdates = async () => {
    try {
      const formData = new FormData();

      // Ensure all required fields are properly formatted
      const dataToSend: IAboutInput = {
        aboutHero: aboutData.aboutHero,
        aboutContent: aboutData.aboutContent.map(
          ({ title, description, icon }) => ({ title, description, icon })
        ),
        missionsSection: aboutData.missionsSection.map(
          ({ title, description, icon }) => ({
            title,
            description,
            icon,
          })
        ),
        servicesSection: aboutData.servicesSection.map(
          ({ title, description, icon }) => ({
            title,
            description,
            icon,
          })
        ),
        visionSection: aboutData.visionSection.map(
          ({ title, description, icon }) => ({ title, description, icon })
        ),
      };

      // Append all data except the image
      Object.entries(dataToSend).forEach(([key, value]) => {
        formData.append(key, JSON.stringify(value));
      });

      // Append the image if it's a File
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const updatedData = await aboutApi.updateAbout(formData);
      setAboutData(updatedData);
      toast({
        title: "Changes saved",
        description: "Your changes have been saved successfully.",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error saving changes:", error);
      toast({
        title: "Error saving changes",
        description: "An error occurred while saving your changes.",
        duration: 5000,
      });
    }
  };
  console.log("aboutData", aboutData);
  const handleAddMission = (newMission: IAboutContentInput) => {
    setAboutData((prevData) => ({
      ...prevData,
      missionsSection: [...prevData.missionsSection, newMission],
    }));
  };

  const renderSection = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Component: React.FC<any>,
    sectionName: SectionKeys
  ) => (
    <div className="mb-4">
      {sections[sectionName] && (
        <Component
          data={aboutData}
          onUpdate={(updatedData: Partial<IAboutInput>) =>
            handleUpdateAbout(updatedData)
          }
          onAddMission={
            sectionName === "showAddMission" ? handleAddMission : undefined
          }
          onImageUpload={
            sectionName === "showContent" ? handleImageUpload : undefined
          }
        />
      )}
      <button
        onClick={() => toggleSection(sectionName)}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        {sections[sectionName] ? `Hide ${sectionName}` : `Show ${sectionName}`}
      </button>
    </div>
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">About Page Admin Panel</h1>
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold">Hero Section</h2>
          {renderSection(AboutHero, "showHero")}
        </div>
        <div>
          <h2 className="text-xl font-semibold">Content Section</h2>
          {renderSection(AboutContent, "showContent")}
        </div>
        <div>
          <h2 className="text-xl font-semibold">Mission Section</h2>
          {renderSection(AboutMission, "showMission")}
        </div>
        <div>
          <h2 className="text-xl font-semibold">Services Section</h2>
          {renderSection(AboutServices, "showServices")}
        </div>
        <div>
          <h2 className="text-xl font-semibold">Vision Section</h2>
          {renderSection(AboutVision, "showVision")}
        </div>
        <div>
          <h2 className="text-xl font-semibold">Additional Mission Section</h2>
          {renderSection(AddMission, "showAddMission")}
        </div>
        {/* Save Update Button */}
        <div className="mt-8 flex justify-center">
          <motion.button
            onClick={saveUpdates}
            className="bg-green-600 text-white px-6 py-2 rounded-lg"
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

export default AboutUs;
