"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaEdit, FaTrash } from "react-icons/fa";
import { faqApi } from "@/lib/faqApi";
import type { FAQ } from "@/types/faq";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AdminFAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [faqData, setFaqData] = useState<FAQ[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const { toast } = useToast();
  const [seoMeta, setSeoMeta] = useState({
    _id: "",
    pageTitle: "faq", // Default to "programs" if not fetched
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "", // Initialize with empty string
  });
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeoMeta = async () => {
      try {
        const response = await axios.get(
          `/api/global-meta/${seoMeta.pageTitle}`
        );
        const fetchedData = response.data.seoMeta;

        // Ensure the response includes pageTitle, metaTitle, etc.
        setSeoMeta({
          _id: fetchedData._id || "",
          pageTitle: fetchedData.pageTitle || "faq",
          metaTitle: fetchedData.metaTitle || "",
          metaDescription: fetchedData.metaDescription || "",
          metaKeywords: fetchedData.metaKeywords || "",
        });
      } catch (error) {
        console.error("Error fetching SEO metadata:", error);
      }
    };

    fetchSeoMeta();
  }, [seoMeta.pageTitle]);
  const handleSeoMetaChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSeoMeta({ ...seoMeta, [e.target.name]: e.target.value });
  };

  const handleSeoMetaSubmit = async () => {
    try {
      // Prepare the data for submission
      const seoData = {
        pageTitle: seoMeta.pageTitle,
        metaTitle: seoMeta.metaTitle,
        metaDescription: seoMeta.metaDescription,
        metaKeywords:
          typeof seoMeta.metaKeywords === "string"
            ? seoMeta.metaKeywords.split(",").map((keyword) => keyword.trim())
            : [],
      };

      const method = seoMeta._id ? "patch" : "post";
      const url = seoMeta._id
        ? `/api/global-meta/${seoMeta._id}`
        : "/api/global-meta";

      // Make the request (either POST or PATCH)
      await axios[method](url, seoData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      toast({
        title: "SEO Metadata Updated",
        description: "The SEO metadata has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating SEO metadata:", error);
      toast({
        title: "Error",
        description: "Failed to update SEO metadata. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const faqs = await faqApi.getFAQs();
      console.log("API Response:", faqs);
      if (Array.isArray(faqs)) {
        setFaqData(faqs);
      } else {
        console.error("Received non-array data from API:", faqs);
        setFaqData([]);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      setFaqData([]);
    }
  };

  console.log("FAQ Data:", faqData);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleAddOrUpdateFAQ = async () => {
    if (newQuestion && newAnswer) {
      try {
        const faqData: Omit<FAQ, "id"> = {
          question: newQuestion,
          answer: newAnswer,
          category: newCategory || "General",
        };

        if (editingFaqId) {
          await faqApi.updateFAQ(editingFaqId, faqData);
        } else {
          await faqApi.createFAQ(faqData as FAQ);
        }

        await fetchFAQs();
        resetForm();
      } catch (error) {
        console.error("Error adding/updating FAQ:", error);
      }
    }
  };

  const handleEditFAQ = (faq: FAQ) => {
    setEditingFaqId(faq.id);
    setNewQuestion(faq.question);
    setNewAnswer(faq.answer);
    setNewCategory(faq.category || "");
  };

  const handleRemoveFAQ = (id: string) => {
    setFaqToDelete(id);
    setIsDeleteAlertOpen(true);
  };

  const confirmDeleteFAQ = async () => {
    if (faqToDelete) {
      try {
        await faqApi.deleteFAQ(faqToDelete);
        await fetchFAQs(); // Refresh FAQ list
        toast({
          title: "Success",
          description: "FAQ deleted successfully.",
        });
      } catch (error) {
        console.error("Error removing FAQ:", error);
        toast({
          title: "Error",
          description: "Failed to delete FAQ. Please try again.",
          variant: "destructive",
        });
      }
    }
    setIsDeleteAlertOpen(false);
    setFaqToDelete(null);
  };

  const resetForm = () => {
    setEditingFaqId(null);
    setNewQuestion("");
    setNewAnswer("");
    setNewCategory("");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <div className="bg-red-600 text-white p-4 text-center">
        <h1 className="text-3xl font-bold">BTMC Foundation</h1>
      </div>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto py-12 px-4 md:px-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 uppercase mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={faq.id}
              className="border-t border-gray-300 rounded-lg overflow-hidden"
            >
              <div
                className={`flex items-center justify-between px-6 py-4 cursor-pointer bg-red-600 text-white transition-all ${
                  activeIndex === index ? "bg-red-700" : "bg-red-600"
                }`}
                onClick={() => toggleAccordion(index)}
              >
                <h4 className="text-lg font-semibold">{faq.question}</h4>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditFAQ(faq);
                    }}
                    className="text-white hover:text-gray-200"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFAQ(faq.id);
                    }}
                    className="text-white hover:text-gray-200"
                  >
                    <FaTrash />
                  </button>
                  <motion.div
                    animate={{
                      rotate: activeIndex === index ? 180 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaChevronDown className="text-xl" />
                  </motion.div>
                </div>
              </div>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    className="px-6 py-4 bg-gray-100 text-gray-700"
                    animate={{ height: "auto", opacity: 1 }}
                    initial={{ height: 0, opacity: 0 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="leading-relaxed">{faq.answer}</p>
                    {faq.category && (
                      <p className="mt-2 text-sm text-gray-500">
                        Category: {faq.category}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Add/Edit FAQ Section */}
        <div className="space-y-4 mt-8">
          <h3 className="text-xl font-semibold">
            {editingFaqId ? "Edit FAQ" : "Add New FAQ"}
          </h3>
          <div>
            <label htmlFor="question" className="block text-gray-700">
              Question
            </label>
            <input
              type="text"
              id="question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter question"
            />
          </div>
          <div>
            <label htmlFor="answer" className="block text-gray-700">
              Answer
            </label>
            <textarea
              id="answer"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter answer"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-gray-700">
              Category (optional)
            </label>
            <input
              type="text"
              id="category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter category"
            />
          </div>
          <div className="mx-auto rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              SEO Meta Information
            </h2>

            <div className="mb-4">
              <label
                htmlFor="metaTitle"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Meta Title
              </label>
              <Input
                type="text"
                id="metaTitle"
                name="metaTitle"
                value={seoMeta.metaTitle}
                onChange={handleSeoMetaChange}
                className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Enter meta title"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="metaDescription"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Meta Description
              </label>
              <Textarea
                id="metaDescription"
                name="metaDescription"
                value={seoMeta.metaDescription}
                onChange={handleSeoMetaChange}
                className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Enter meta description"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="metaKeywords"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Meta Keywords
              </label>
              <Input
                type="text"
                id="metaKeywords"
                name="metaKeywords"
                value={seoMeta.metaKeywords}
                onChange={handleSeoMetaChange}
                className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Enter keywords (comma-separated)"
              />
            </div>

            <Button onClick={handleSeoMetaSubmit}>Update SEO Metadata</Button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleAddOrUpdateFAQ}
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              {editingFaqId ? "Update FAQ" : "Add FAQ"}
            </button>
            {editingFaqId && (
              <button
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo(0, 0)}
        className="fixed bottom-10 right-10 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors"
      >
        ↑
      </button>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the FAQ
              and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteFAQ}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminFAQ;
