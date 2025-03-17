import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Tag, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import TextEditor from "../../../components/admin/pages/TextEditor";
import { useToast } from "@/hooks/use-toast";

interface Author {
  name: string;
  avatar: string | File;
  role: string;
}

interface BlogPost {
  id?: string;
  isEditable?: boolean;
  title: string;
  excerpt: string;
  content: string;
  author: Author;
  image: string | File;
  category: string;
  tags: string[];
  readTime: number;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
}

const AddEditBlog: React.FC = () => {
  const [blogPost, setBlogPost] = useState<BlogPost>({
    title: "",
    excerpt: "",
    content: "",
    author: {
      name: "",
      avatar: "",
      role: "",
    },
    image: "",
    category: "",
    tags: [],
    readTime: 1,
    isEditable: true,
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const { toast } = useToast();

  const fetchBlogPost = async (postId: string) => {
    try {
      const response = await fetch(`/api/blogpost/${postId}`);
      if (!response.ok) throw new Error("Failed to fetch blog post");
      const data = await response.json();

      // Destructure to access blogPost properties
      const { blogPost } = data;

      setBlogPost(blogPost); // Now set the correct blogPost object

      if (blogPost.image) setImagePreview(blogPost.image);
      if (blogPost.author?.avatar) setAvatarPreview(blogPost.author.avatar);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      toast({
        title: "Error",
        description: "Failed to fetch blog post",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchBlogPost(id);
    }
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Update the state based on nested structure
    if (name.startsWith("author.")) {
      const authorField = name.split(".")[1] as keyof Author;
      setBlogPost((prev) => ({
        ...prev,
        author: { ...prev.author, [authorField]: value },
      }));
    } else {
      setBlogPost((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageType: "image" | "avatar"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please upload a valid image file.",
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (imageType === "image") {
        setImagePreview(result);
      } else {
        setAvatarPreview(result);
      }
    };
    reader.readAsDataURL(file);

    // Store file for form submission
    if (imageType === "image") {
      setBlogPost((prev) => ({ ...prev, image: file }));
    } else {
      setBlogPost((prev) => ({
        ...prev,
        author: { ...prev.author, avatar: file },
      }));
    }
  };

  const handleContentChange = (newContent: string) => {
    setBlogPost((prev) => ({ ...prev, content: newContent }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagInput = e.target.value;
    const tagArray = tagInput.split(",").filter((tag) => tag.trim() !== "");

    setBlogPost((prev) => ({
      ...prev,
      tags: tagArray,
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const newTag = e.currentTarget.value;
      if (newTag) {
        setBlogPost((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
      }
      e.preventDefault(); // prevent form submission or other default actions
    }
  };

  const handleMetaInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBlogPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMetaKeywordsChange = (value: string) => {
    const keywords = value.split(",").map((keyword) => keyword.trim());
    setBlogPost((prev) => ({
      ...prev,
      metaKeywords: keywords,
    }));
  };

  const handleSaveBlog = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Append text fields
      formData.append("title", blogPost.title);
      formData.append("excerpt", blogPost.excerpt);
      formData.append("content", blogPost.content);
      formData.append("category", blogPost.category);
      formData.append("readTime", blogPost.readTime.toString());

      // Properly append tags as individual items
      blogPost.tags.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag);
      });

      // Append author details as an object
      formData.append("author[name]", blogPost.author.name);
      formData.append("author[role]", blogPost.author.role);

      // Append images only if they are Files
      if (blogPost.image instanceof File) {
        formData.append("image", blogPost.image);
      }
      if (blogPost.author.avatar instanceof File) {
        formData.append("avatar", blogPost.author.avatar);
      }

      // Append meta information
      formData.append("metaTitle", blogPost.metaTitle);
      formData.append("metaDescription", blogPost.metaDescription);
      formData.append("metaKeywords", JSON.stringify(blogPost.metaKeywords));

      const response = await fetch(
        isEditing ? `/api/blogpost/${id}` : "/api/blogpost",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save blog post");
      }

      toast({
        title: "Success",
        description: `Blog post ${
          isEditing ? "updated" : "created"
        } successfully`,
      });

      navigate("/admin/blogs");
    } catch (error) {
      console.error("Error saving blog post:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save blog post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        className="relative h-[60vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <input
          type="file"
          onChange={(e) => handleImageChange(e, "image")}
          className="absolute top-4 right-4 z-10"
          accept="image/*"
        />
        <img
          src={imagePreview || "/default-image.jpg"}
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-4xl mx-auto px-4 text-white">
            <Link
              to="/admin/blogs"
              className="inline-flex items-center text-white mb-6 hover:text-red-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Blog
            </Link>
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <input
                type="text"
                name="title"
                value={blogPost.title}
                onChange={handleInputChange}
                className="bg-transparent border-none outline-none w-full"
                placeholder="Add Blog Title"
              />
            </motion.h1>
            <motion.div
              className="flex flex-wrap items-center gap-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <input
                  type="date"
                  name="date"
                  value={new Date().toISOString().split("T")[0]}
                  className="bg-transparent border-none outline-none cursor-pointer text-white"
                />
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <input
                  type="number"
                  name="readTime"
                  value={blogPost.readTime}
                  onChange={handleInputChange}
                  className="bg-transparent border-none outline-none w-16"
                  min={1}
                />{" "}
                min read
              </div>
              <div className="flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                <input
                  type="text"
                  name="category"
                  value={blogPost.category}
                  onChange={handleInputChange}
                  className="bg-transparent border-none outline-none"
                  placeholder="Category"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-3">
            <div className="sticky top-8">
              <div className="flex flex-col items-center text-center">
                <input
                  type="file"
                  onChange={(e) => handleImageChange(e, "avatar")}
                  className="mb-4"
                  accept="image/*"
                />
                <img
                  src={avatarPreview || "/default-author.jpg"}
                  alt="Author"
                  className="w-24 h-24 rounded-full mb-4"
                />
                <input
                  type="text"
                  className="mb-4 p-2 rounded-lg border border-gray-300"
                  placeholder="Author Name"
                  name="author.name"
                  value={blogPost.author?.name}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  className="mb-4 p-2 rounded-lg border border-gray-300"
                  placeholder="Author Role"
                  name="author.role"
                  value={blogPost.author?.role}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <motion.article
            className="md:col-span-9 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="prose prose-lg max-w-none">
              <textarea
                name="excerpt"
                value={blogPost.excerpt}
                onChange={handleInputChange}
                className="w-full p-4 border rounded-lg"
                placeholder="Add a brief excerpt"
                rows={3}
              />
              <TextEditor
                value={blogPost.content}
                onChange={handleContentChange}
              />
            </div>
          </motion.article>
        </div>

        <div className="mt-12 pt-8 border-t">
          <h3 className="text-lg font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {blogPost.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          <input
            type="text"
            className="mt-4 p-2 rounded-lg border border-gray-300 w-full"
            placeholder="Add Tags (comma separated)"
            value={blogPost.tags}
            onChange={handleTagsChange}
            onKeyDown={handleKeyDown}
          />
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
              value={blogPost.metaTitle}
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
              value={blogPost.metaDescription}
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
              value={blogPost.metaKeywords.join(", ")}
              onChange={(e) => handleMetaKeywordsChange(e.target.value)}
              className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="Enter keywords (comma-separated)"
            />
          </div>
        </div>
        <div className="flex justify-center items-center">
          <motion.button
            onClick={handleSaveBlog}
            disabled={isSubmitting}
            className={`mt-8 w-[300px] py-3 rounded-lg transition-colors ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
            whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
              ? "Update Blog"
              : "Save Blog"}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default AddEditBlog;
