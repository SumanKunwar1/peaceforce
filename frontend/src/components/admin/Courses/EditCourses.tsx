"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, Book, Globe, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { ICourse } from "@/types/course";
import { getCourseById, updateCourse, debugLog } from "@/lib/courseApi";
import Loader from "@/components/Loader";

const EditCourse: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [courseData, setCourseData] = useState<
    Omit<ICourse, "id, __v, _id"> & ICourse
  >({
    _id: "",
    id: "",
    title: "",
    description: "",
    image: null,
    duration: "",
    language: [],
    instructor: {
      name: "",
      title: "",
      bio: "",
      image: null,
    },
    highlights: [],
    materials: [],
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
  });

  useEffect(() => {
    if (id) {
      fetchCourse(id);
    }
  }, [id]);

  const fetchCourse = async (courseId: string) => {
    try {
      setIsLoading(true);
      const course = await getCourseById(courseId);
      setCourseData(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      toast({
        title: "Error",
        description: "Failed to fetch course data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  debugLog("EditCourse component rendered", {
    courseData,
    isLoading,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCourseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInstructorInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCourseData((prevData) => ({
      ...prevData,
      instructor: {
        ...prevData.instructor,
        [name]: value,
      },
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "image" | "instructor.image"
  ) => {
    const file = e.target.files?.[0] || null;
    if (field === "image") {
      setCourseData((prevData) => ({
        ...prevData,
        image: file,
      }));
    } else {
      setCourseData((prevData) => ({
        ...prevData,
        instructor: {
          ...prevData.instructor,
          image: file,
        },
      }));
    }
  };

  const handleAddHighlight = () => {
    setCourseData((prevData) => ({
      ...prevData,
      highlights: [...prevData.highlights, ""],
    }));
  };

  const handleRemoveHighlight = (highlightIndex: number) => {
    setCourseData((prevData) => ({
      ...prevData,
      highlights: prevData.highlights.filter((_, i) => i !== highlightIndex),
    }));
  };

  const handleHighlightChange = (highlightIndex: number, value: string) => {
    setCourseData((prevData) => ({
      ...prevData,
      highlights: prevData.highlights.map((highlight, i) =>
        i === highlightIndex ? value : highlight
      ),
    }));
  };

  const handleAddMaterial = () => {
    setCourseData((prevData) => ({
      ...prevData,
      materials: [...prevData.materials, ""],
    }));
  };

  const handleRemoveMaterial = (materialIndex: number) => {
    setCourseData((prevData) => ({
      ...prevData,
      materials: prevData.materials.filter((_, i) => i !== materialIndex),
    }));
  };

  const handleMaterialChange = (materialIndex: number, value: string) => {
    setCourseData((prevData) => ({
      ...prevData,
      materials: prevData.materials.map((material, i) =>
        i === materialIndex ? value : material
      ),
    }));
  };

  const handleMetaInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCourseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMetaKeywordsChange = (value: string) => {
    const keywords = value.split(",").map((keyword) => keyword.trim());
    setCourseData((prevData) => ({
      ...prevData,
      metaKeywords: keywords,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();

      // Append course data
      Object.entries(courseData).forEach(([key, value]) => {
        if (key === "id" && !id) return;
        if (key === "_id") return;
        if (key === "__v") return;
        if (key !== "image" && key !== "instructor") {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (value !== null) {
            formData.append(key, value.toString());
          }
        }
      });

      // Append image if it's a File object
      if (courseData.image instanceof File) {
        formData.append("image", courseData.image);
      }

      // Append instructor data
      Object.entries(courseData.instructor).forEach(([key, value]) => {
        if (key !== "image") {
          if (value !== null) {
            formData.append(`instructor[${key}]`, value.toString());
          }
        }
      });

      // Append instructor image if it's a File object
      if (courseData.instructor.image instanceof File) {
        formData.append("instructorImage", courseData.instructor.image);
      }

      await updateCourse(id!, formData);
      toast({
        title: "Course Updated",
        description: "The course has been successfully updated.",
      });
      navigate("/admin/courses");
    } catch (error) {
      console.error("Error updating course:", error);
      let errorMessage = "Failed to update the course. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[60vh]">
        <div className="absolute top-4 left-4 z-10">
          <label
            htmlFor="hero-banner-upload"
            className="bg-red-600 text-white p-2 rounded cursor-pointer hover:bg-red-700"
          >
            Choose Hero Banner Image
          </label>
          <input
            id="hero-banner-upload"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "image")}
            className="hidden"
          />
        </div>
        {courseData.image && (
          <img
            src={
              courseData.image instanceof File
                ? URL.createObjectURL(courseData.image)
                : courseData.image
            }
            alt="Hero Banner"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 text-white">
            <div className="space-y-0">
              <Input
                name="title"
                value={courseData.title}
                onChange={handleInputChange}
                placeholder="Write title for the hero banner"
                className="w-full bg-transparent border-none text-white text-5xl font-bold resize-none focus:outline-none"
              />
              <Textarea
                name="description"
                value={courseData.description}
                onChange={handleInputChange}
                placeholder="Write description for the hero banner"
                className="w-full bg-transparent border-none text-white text-lg resize-none focus:outline-none"
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <section>
                <h3 className="text-xl font-bold mb-4">About the Course</h3>
                <Input
                  name="title"
                  value={courseData.title}
                  onChange={handleInputChange}
                  placeholder="Course Title"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none mb-4"
                />
                <Textarea
                  name="description"
                  value={courseData.description}
                  onChange={handleInputChange}
                  placeholder="Write about the course"
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  rows={5}
                />
              </section>

              <section className="mt-6">
                <h3 className="text-xl font-bold mb-4">Course Highlights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courseData.highlights.map((highlight, hIndex) => (
                    <div key={hIndex} className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-red-600 mt-1" />
                      <Input
                        type="text"
                        value={highlight}
                        onChange={(e) =>
                          handleHighlightChange(hIndex, e.target.value)
                        }
                        placeholder="Add a highlight"
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                      />
                      <Button
                        onClick={() => handleRemoveHighlight(hIndex)}
                        variant="destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={handleAddHighlight}
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                  >
                    + Add Highlight
                  </Button>
                </div>
              </section>

              <section className="mt-6">
                <h3 className="text-xl font-bold mb-4">Course Materials</h3>
                <div className="space-y-4">
                  {courseData.materials.map((material, mIndex) => (
                    <div key={mIndex} className="flex items-center space-x-2">
                      <Book className="w-5 h-5 text-red-600" />
                      <Input
                        type="text"
                        value={material}
                        onChange={(e) =>
                          handleMaterialChange(mIndex, e.target.value)
                        }
                        placeholder="Add a material"
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                      />
                      <Button
                        onClick={() => handleRemoveMaterial(mIndex)}
                        variant="destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={handleAddMaterial}
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                  >
                    + Add Material
                  </Button>
                </div>
              </section>

              <section className="mt-6">
                <h3 className="text-xl font-bold mb-4">Instructor</h3>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "instructor.image")}
                />
                {courseData.instructor.image && (
                  <img
                    src={
                      courseData.instructor.image instanceof File
                        ? URL.createObjectURL(courseData.instructor.image)
                        : courseData.instructor.image
                    }
                    alt="Instructor"
                    className="w-16 h-16 rounded-full object-cover mb-4"
                  />
                )}
                <Input
                  name="name"
                  value={courseData.instructor.name}
                  onChange={handleInstructorInputChange}
                  placeholder="Instructor Name"
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none mb-4"
                />
                <Input
                  name="title"
                  value={courseData.instructor.title}
                  onChange={handleInstructorInputChange}
                  placeholder="Instructor Title"
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none mb-4"
                />
                <Textarea
                  name="bio"
                  value={courseData.instructor.bio}
                  onChange={handleInstructorInputChange}
                  placeholder="Instructor Bio"
                  className="w-full border rounded-lg p-4 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  rows={5}
                />
              </section>

              <section className="mt-6">
                <h3 className="text-xl font-bold mb-4">Course Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      <span>Duration</span>
                    </div>
                    <Input
                      name="duration"
                      value={courseData.duration}
                      onChange={handleInputChange}
                      placeholder="Course Duration"
                      className="border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 mr-2" />
                      <span>Language</span>
                    </div>
                    <Input
                      name="language"
                      value={courseData.language.join(", ")}
                      onChange={(e) => {
                        const languages = e.target.value
                          .split(",")
                          .map((lang) => lang.trim());
                        setCourseData((prev) => ({
                          ...prev,
                          language: languages,
                        }));
                      }}
                      placeholder="Course Languages"
                      className="border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-lg sticky top-24 space-y-6">
              <div className="flex justify-between space-x-4">
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Update Course"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-5 p-6 rounded-lg">
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
            value={courseData.metaTitle}
            onChange={handleMetaInputChange}
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
            value={courseData.metaDescription}
            onChange={handleMetaInputChange}
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
            value={courseData.metaKeywords?.join(", ")}
            onChange={(e) => handleMetaKeywordsChange(e.target.value)}
            className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="Enter keywords (comma-separated)"
          />
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
