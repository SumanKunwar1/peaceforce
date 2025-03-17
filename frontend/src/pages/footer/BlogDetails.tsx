"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Tag,
  ArrowLeft,
  Share2,
  Bookmark,
  ThumbsUp,
} from "lucide-react";
import type { BlogPost } from "@/types/blog";
import { getBlogPostById } from "@/lib/blog";
import Loader from "@/components/Loader";
import { Helmet } from "react-helmet-async";

const BlogDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!id) return;
      try {
        const fetchedPost = await getBlogPostById(id);
        setPost(fetchedPost.blogPost);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch blog post");
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [id]);

  if (loading) {
    return <Loader />;
  }
  console.log("Current Blog Post:", post);
  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Blog Post Not Found</h2>
          <Link to="/blogs" className="text-red-600 hover:text-red-700">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.metaTitle}</title>
        <meta name="description" content={post.metaDescription} />
        <meta name="keywords" content={post.metaKeywords.join(", ")} />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <motion.div
          className="relative h-[60vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <img
            src={
              typeof post.image === "string"
                ? post.image
                : URL.createObjectURL(post.image)
            }
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-4xl mx-auto px-4 text-white">
              <Link
                to="/blog"
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
                {post.title}
              </motion.h1>
              <motion.div
                className="flex flex-wrap items-center gap-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{post.readTime} min read</span>
                </div>
                <div className="flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  <span>{post.category}</span>
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
                  <img
                    src={
                      typeof post.author.avatar === "string"
                        ? post.author.avatar
                        : URL.createObjectURL(post.author.avatar)
                    }
                    alt={post.author.name}
                    className="w-24 h-24 rounded-full mb-4"
                  />
                  <h3 className="font-semibold text-lg">{post.author.name}</h3>
                  <p className="text-gray-600 text-sm">{post.author.role}</p>
                </div>
                <div className="mt-8 space-y-4">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50">
                    <Bookmark className="w-4 h-4" />
                    Save
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <ThumbsUp className="w-4 h-4" />
                    Like
                  </button>
                </div>
              </div>
            </div>

            <motion.article
              className="md:col-span-9 prose prose-lg max-w-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          <div className="mt-12 pt-8 border-t">
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetails;
