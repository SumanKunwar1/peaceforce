"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { pageApi } from "@/lib/pageApi";
import type { IPageInput, IPageData } from "@/types/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import TextEditor from "@/components/admin/pages/TextEditor";
import { NavItems } from "@/config/navigation"; // Update this path to match your actual file location
import Loader from "@/components/Loader";

const PageForm: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  console.log("location", location, location.state);
  const { toast } = useToast();
  const [formData, setFormData] = useState<IPageInput>({
    title: "",
    slug: "",
    location: "header",
    parentPage: "none",
    content: "",
    status: "draft",
    metaTitle: "",
    metaKeywords: "",
    metaDescription: "",
  });
  const [pages, setPages] = useState<IPageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [pagesResponse, pageData] = await Promise.all([
          pageApi.getPages(),
          slug && slug !== "new"
            ? location.state?.pageData || pageApi.getPageBySlug(slug)
            : null,
        ]);
        setPages(pagesResponse?.pages as IPageData[]);
        if (pageData) {
          setFormData(pageData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, location.state, toast]);
  console.log("pages", pages);
  console.log("formData", formData);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create a copy of the form data to submit
    const dataToSubmit = {
      ...formData,
      // If it's a static parent, keep the path as is; otherwise, it's a MongoDB ID
      parentPage: formData.parentPage === "none" ? "none" : formData.parentPage,
    };

    try {
      if (slug && slug !== "new") {
        await pageApi.updatePage(
          location.state?.pageData._id || "",
          dataToSubmit
        );
        toast({
          title: "Success",
          description: "Page updated successfully.",
        });
      } else {
        await pageApi.createPage(dataToSubmit);
        toast({
          title: "Success",
          description: "Page created successfully.",
        });
      }
      navigate("/admin/pages");
    } catch (error: any) {
      console.error("Error saving page:");
      toast({
        title: "Error",
        description: `${error || "Failed to save page. Please try again."}`,
        variant: "destructive",
      });
    }
  };

  const headerPages = pages.filter((page) => page.location === "header");

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <motion.h1
          className="text-2xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {slug && slug !== "new" ? "Edit Page" : "Create New Page"}
        </motion.h1>
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Page Title
              </label>
              <Input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Slug
              </label>
              <Input
                type="text"
                name="slug"
                required
                value={formData.slug}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <Select
                name="location"
                value={formData.location}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: value as "header" | "footer",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="header">Header</SelectItem>
                  <SelectItem value="footer">Footer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.location === "header" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Page
                </label>
                <Select
                  name="parentPage"
                  value={formData.parentPage || "none"}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, parentPage: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {/* Static navigation items */}
                    {NavItems.map((item) => (
                      <SelectItem key={`static-${item.path}`} value={item.path}>
                        {item.label}
                      </SelectItem>
                    ))}
                    {/* Dynamic pages from database */}
                    {headerPages.map((page) => (
                      <SelectItem key={page._id} value={page._id}>
                        {page.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Select
                name="status"
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: value as "draft" | "published",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <TextEditor
              value={formData.content}
              onChange={handleEditorChange}
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Title
              </label>
              <Input
                type="text"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Keywords
              </label>
              <Input
                type="text"
                name="metaKeywords"
                value={formData.metaKeywords}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description
              </label>
              <Textarea
                name="metaDescription"
                rows={3}
                value={formData.metaDescription}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/pages")}
            >
              Cancel
            </Button>
            <Button type="submit">
              {slug && slug !== "new" ? "Update Page" : "Create Page"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default PageForm;
