"use client";

import { motion } from "framer-motion";
import { Facebook, Linkedin, Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/Loader";
import { Helmet } from "react-helmet-async";

interface SocialLinks {
  facebook?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  socialLinks: SocialLinks;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
}

const Team = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/team");
      if (!response.ok) {
        throw new Error("Failed to fetch team members");
      }
      const data = await response.json();
      setTeamMembers(data.teamMembers);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast({
        title: "Error",
        description: "Failed to load team members. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {teamMembers.map((member) => (
        <Helmet>
          <title>{member.metaTitle}</title>
          <meta name="description" content={member.metaDescription} />
          <meta name="keywords" content={member?.metaKeywords?.join(", ")} />
        </Helmet>
      ))}
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <motion.div
          className="bg-gradient-to-r from-red-600 to-red-800 py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-4">Our Team</h1>
            <p className="text-red-100">Meet our dedicated team members</p>
          </div>
        </motion.div>

        {/* Team Members Grid */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {isLoading ? (
            <Loader />
          ) : teamMembers.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p>No team members found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member) => (
                <motion.div
                  key={member.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  {/* Team Member Card */}
                  <div>
                    {/* Image with fallback */}
                    <div className="relative w-full h-64">
                      <img
                        src={member.image || "/placeholder-profile.jpg"} // Add a placeholder image path
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-profile.jpg"; // Add a placeholder image path
                        }}
                      />
                    </div>
                  </div>
                  {/* Name & Role */}
                  <div className="p-4 text-center">
                    <h2 className="text-xl font-bold text-red-500">
                      {member.name}
                    </h2>
                    <p className="text-sm text-red-500">{member.role}</p>
                    {/* Added Bio with truncation */}
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {member.bio}
                    </p>
                  </div>
                  {/* Social Media Links */}
                  <div className="p-4 flex justify-center space-x-6">
                    {member.socialLinks?.facebook && (
                      <a
                        href={member.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Facebook className="w-6 h-6" />
                      </a>
                    )}
                    {member.socialLinks?.linkedin && (
                      <a
                        href={member.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Linkedin className="w-6 h-6" />
                      </a>
                    )}
                    {member.socialLinks?.instagram && (
                      <a
                        href={member.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Instagram className="w-6 h-6" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Team;
