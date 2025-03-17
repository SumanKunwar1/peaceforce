"use client";

import type React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { getCourses } from "@/lib/courseApi";
import type { ICourse } from "@/types/course";
import { Skeleton } from "@/components/ui/skeleton";

interface RecommendedCoursesProps {
  currentCourseId: string | undefined;
}

const RecommendedCourses: React.FC<RecommendedCoursesProps> = ({
  currentCourseId,
}) => {
  const { data: courses, error } = useSWR<ICourse[]>("courses", getCourses);

  const safeCurrentCourseId = currentCourseId ?? "";

  const getRandomCourses = (): ICourse[] => {
    if (!courses) return [];

    // Remove the current course from the list
    const otherCourses = courses.filter(
      (course) => course._id !== safeCurrentCourseId
    );

    // Shuffle and select the top 3
    return otherCourses.sort(() => Math.random() - 0.5).slice(0, 3);
  };

  const recommendedCourses = getRandomCourses();

  if (error) {
    return (
      <div className="text-green-600 text-center mt-16">
        Error loading recommended courses. Please try again later.
      </div>
    );
  }

  if (!courses) {
    return (
      <motion.section
        className="mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-2xl font-bold mb-8">Recommended Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      </motion.section>
    );
  }

  if (recommendedCourses.length === 0) {
    return null;
  }

  return (
    <motion.section
      className="mt-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <h2 className="text-2xl font-bold mb-8">Recommended Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendedCourses.map((course) => (
          <motion.div
            key={course._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <Link to={`/teachings/${course._id}`}>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {course.instructor.name}
                  </div>
                  <span className="text-green-600 font-semibold">
                    Explore Now →
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default RecommendedCourses;
