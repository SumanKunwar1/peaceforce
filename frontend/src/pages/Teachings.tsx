import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import CourseCard from "@/teachings/CategoryCard";
import { getCourses } from "@/lib/courseApi";
import { ICourse } from "@/types/course";
import { Helmet } from "react-helmet-async";
import Loader from "@/components/Loader";

const Teachings: React.FC = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const fetchedCourses = await getCourses();
        setCourses(fetchedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return <Loader />;
  }

  // Get the first course for meta data (or use default values)
  const firstCourse = courses[0] || {};

  return (
    <>
      <Helmet>
        <title>{firstCourse.metaTitle || "Buddhist Teachings & Courses"}</title>
        <meta
          name="description"
          content={
            firstCourse.metaDescription ||
            "Explore our comprehensive range of Buddhist courses and begin your spiritual journey"
          }
        />
        <meta
          name="keywords"
          content={
            firstCourse.metaKeywords?.join(", ") ||
            "Buddhism, Courses, Teachings, Spiritual"
          }
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <motion.div
          className="bg-gradient-to-r from-green-100 to-green-200 py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center space-x-4">
              <GraduationCap className="w-12 h-12 text-white" />
              <div>
                <motion.h1
                  className="text-4xl font-bold text-white mb-2"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Buddhist Teachings & Courses
                </motion.h1>
                <motion.p
                  className="text-green-100 text-lg"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Explore our comprehensive range of courses and begin your
                  spiritual journey
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </motion.div>

          <motion.div
            className="mt-16 bg-white p-8 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4">Course Information</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Class Capacity</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Teaching Center: 30-50 students</li>
                  <li>Online Classes with Visuals: 6 students</li>
                  <li>Online Classes without Visuals: Unlimited capacity</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Course Materials</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Handouts of related subjects</li>
                  <li>Audio/Video tutorials</li>
                  <li>Course Certificate upon completion</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Support-Based Model
                </h3>
                <p className="text-gray-700">
                  BTMC Foundation operates on Buddhist principles. We accept
                  your support rather than charging course fees. Your support
                  helps us maintain and improve our services, benefiting present
                  and future generations while preserving peace and harmony in
                  the world.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Teachings;
