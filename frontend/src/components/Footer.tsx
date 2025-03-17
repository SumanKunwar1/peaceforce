"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  ChevronRight,
} from "lucide-react";
import { createNewsletter } from "@/lib/newsletter";
import { getInfoSection } from "@/lib/infoSection";
import { pageApi } from "@/lib/pageApi";
import { useToast } from "@/hooks/use-toast";
import type { IInfoSectionData } from "@/types/infoSection";
import type { IPageData } from "@/types/page";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [infoSection, setInfoSection] = useState<IInfoSectionData | null>(null);
  const [pages, setPages] = useState<IPageData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [infoData, pagesData] = await Promise.all([
          getInfoSection(),
          pageApi.getPages(),
        ]);
        setInfoSection(infoData.infoSection);
        setPages(pagesData?.pages || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createNewsletter({ email });
      toast({
        title: "Success",
        description: "You have successfully subscribed to our newsletter.",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while subscribing. Please try again.",
        variant: "destructive",
      });
    }
  };

  const footerPages = pages.filter((page) => page.location === "footer");
  const quickNavigationLinks = [
    { title: "About Us", slug: "about" },
    { title: "Prevention Programs", slug: "teachings" },
    { title: "Community Action", slug: "tours" },
    { title: "Events", slug: "events" },
    { title: "Programs", slug: "programs" },
    { title: "Support Us", slug: "support" },
  ];
  const quickLinks = [
    { title: "Blog", slug: "blogs" },
    { title: "FAQ", slug: "faq" },
    { title: "Our Team", slug: "team" },
    { title: "Gallery", slug: "gallery" },
    { title: "Career", slug: "career" },
    ...footerPages,
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between flex-wrap gap-8">
          {/* First column */}
          <div className="flex-1 min-w-[250px]">
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-red-500" />
                <span>{infoSection?.location || "Loading..."}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-red-500" />
                <span>{infoSection?.phoneNumber || "Loading..."}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-red-500" />
                <span>{infoSection?.email || "Loading..."}</span>
              </div>
            </div>
          </div>

          {/* Second column */}
          <div className="flex-1 min-w-[250px]">
            <h3 className="text-xl font-semibold mb-4">
              Quick Navigation Links
            </h3>
            <ul className="space-y-2">
              {quickNavigationLinks.map((link) => (
                <li key={link.slug} className="flex items-center space-x-2">
                  <ChevronRight className="h-4 w-4 text-red-500" />
                  <a
                    href={`/${link.slug}`}
                    className="hover:text-red-500 transition-colors"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Third column */}
          <div className="flex-1 min-w-[250px]">
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li
                  key={"slug" in link ? link.slug : ""}
                  className="flex items-center space-x-2"
                >
                  <ChevronRight className="h-4 w-4 text-red-500" />
                  <a
                    href={`/${"slug" in link ? link.slug : ""}`}
                    className="hover:text-red-500 transition-colors"
                  >
                    {"title" in link ? link.title : ""}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Fourth column (Newsletter) */}
          <div className="flex-1 min-w-[250px]">
            <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
            <p className="mb-4">
              Subscribe to receive updates about our activities and events.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-red-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors"
              >
                Subscribe
              </button>
            </form>

            {/* Social Media Icons */}
            <div className="mt-6 flex justify-center space-x-6">
              {infoSection?.socialLinks?.facebook && (
                <a
                  href={infoSection.socialLinks?.facebook}
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="h-6 w-6" />
                </a>
              )}
              {infoSection?.socialLinks?.instagram && (
                <a
                  href={infoSection.socialLinks?.instagram}
                  className="text-purple-500 hover:text-purple-700 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              )}
              {infoSection?.socialLinks?.twitter && (
                <a
                  href={infoSection.socialLinks?.twitter}
                  className="text-blue-400 hover:text-blue-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="h-6 w-6" />
                </a>
              )}
              {infoSection?.socialLinks?.youtube && (
                <a
                  href={infoSection.socialLinks?.youtube}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Youtube className="h-6 w-6" />
                </a>
              )}
              {infoSection?.socialLinks?.linkedin && (
                <a
                  href={infoSection.socialLinks?.linkedin}
                  className="text-blue-700 hover:text-blue-900 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p>
            &copy; {new Date().getFullYear()} PeaceForce. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
