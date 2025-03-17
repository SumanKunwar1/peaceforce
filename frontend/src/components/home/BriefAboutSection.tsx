import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { aboutApi } from "@/lib/aboutApi";
import Loader from "../Loader";
import { IAbout } from "@/types/about";

const BriefAboutSection = () => {
  const [aboutData, setAboutData] = useState<IAbout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const data = await aboutApi.getAbout();
        setAboutData(data.about[0]); // Assuming API returns the full about object
      } catch (err) {
        console.error("Error fetching about data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  console.log("About Data:", aboutData);

  if (loading)
    return (
      <div>
        <Loader />
      </div>
    );

  if (!aboutData) return null; // Handle case where data is missing

  // Extract title and description from aboutContent
  const aboutTitle = aboutData.aboutContent?.[0]?.title || "About Us";
  const aboutDescription =
    aboutData.aboutContent?.[0]?.description ||
    "Discover more about our mission and vision.";

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: About Image */}
          <motion.div
            className="rounded-lg overflow-hidden shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            <motion.img
              src={aboutData.image as string} // Dynamically using API image with fallback
              alt={aboutTitle}
              className="w-full h-[400px] object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>

          {/* Right: About Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <BookOpen className="w-12 h-12 text-green-600 mb-6" />
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-3xl font-bold mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {aboutTitle}
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-lg text-gray-700 mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {aboutDescription}
            </motion.p>

            {/* Learn More Button */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link
                to="/about"
                className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold group"
              >
                Learn More About Us
                <motion.svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </motion.svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BriefAboutSection;
