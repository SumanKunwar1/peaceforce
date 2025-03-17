"use client";

import type React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ICourse } from "@/types/course";

interface CourseCardProps {
  course: ICourse;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  if (!course || typeof course !== "object") {
    console.error("Invalid course prop:", course);
    return null;
  }

  const courseId = course._id;
  console.log("Course ID:", courseId);
  if (!courseId) {
    console.error("Course is missing an id:", course);
    return null;
  }

  const linkTo = `/teachings/${courseId}`;

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={linkTo}>
        <div className="relative h-48">
          {course.image && (
            <img
              src={course.image as string | undefined}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">{course.title}</h3>
          <p className="text-gray-600 mb-4">{course.description}</p>
          <div className="flex items-center text-green-600 font-semibold group">
            <span>Learn More</span>
            <motion.div
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;
