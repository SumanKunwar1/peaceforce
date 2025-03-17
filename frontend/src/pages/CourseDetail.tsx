"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, Book, GraduationCap, CheckCircle } from "lucide-react";
import { getCourseById } from "@/lib/courseApi";
import EnrollmentForm from "@/teachings/EnrollmentForm";
import RecommendedCourses from "@/teachings/RecommendedCourses";
import type { EnrollmentFormData, ICourse } from "../types/course";
import Loader from "@/components/Loader";

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [course, setCourse] = useState<ICourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (courseId) {
        try {
          setLoading(true);
          const fetchedCourse = await getCourseById(courseId);
          setCourse(fetchedCourse);
        } catch (error) {
          console.error("Error fetching course:", error);
          setError("Failed to load course details");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return <Loader />;
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            {error || "Course Not Found"}
          </h2>
          <Link to="/teachings" className="text-green-100 hover:text-green-200">
            Back to Teachings
          </Link>
        </div>
      </div>
    );
  }

  const handleEnrollment = (data: EnrollmentFormData) => {
    console.log("Enrollment data:", data);
    setIsEnrollmentOpen(false);
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Banner */}
      <div className="relative h-[60vh]">
        <img
          src={
            typeof course.image === "string"
              ? course.image
              : course.image instanceof File
              ? URL.createObjectURL(course.image)
              : "/placeholder.svg"
          }
          alt={course.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {course.title}
            </h1>
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center">
                <Book className="w-5 h-5 mr-2" />
                <span>{course.language?.join(", ") || "Not specified"}</span>
              </div>
              <div className="flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                <span>{course.instructor?.name || "Unknown Instructor"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Details */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {/* About the Course */}
            <section>
              <h2 className="text-2xl font-bold mb-4">About the Course</h2>
              <p className="text-gray-700">{course.description}</p>
            </section>

            {/* Course Highlights */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Course Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.highlights?.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-2 text-gray-700"
                  >
                    <CheckCircle className="w-5 h-5 text-green-100 mt-1 flex-shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Course Materials */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Course Materials</h2>
              <div className="space-y-4">
                {course.materials?.map((material, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-gray-700"
                  >
                    <Book className="w-5 h-5 text-green-100" />
                    <span>{material}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-lg sticky top-24">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">Instructor</h3>
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        (course.instructor?.image as string | undefined) ||
                        "/placeholder.svg"
                      }
                      alt={course.instructor?.name || "Instructor"}
                      className="w-16 h-16 rounded-full object-cover"
                    />

                    <div>
                      <p className="font-semibold">
                        {course.instructor?.name || "Unknown Instructor"}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {course.instructor?.title || "No title available"}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-700">
                    {course.instructor?.bio || "No bio available"}
                  </p>
                </div>

                <button
                  onClick={() => setIsEnrollmentOpen(true)}
                  className="w-full bg-green-100 text-white py-3 rounded-lg hover:bg-green-200 transition-colors"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <RecommendedCourses currentCourseId={courseId} />
      </div>

      {/* Enrollment Form */}
      <EnrollmentForm
        isOpen={isEnrollmentOpen}
        onClose={() => setIsEnrollmentOpen(false)}
        onSubmit={handleEnrollment}
        courseTitle={course.title}
        courseId={course._id as string}
      />

      {showThankYou && (
        <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
          Thank you for enrolling! We'll contact you soon.
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
