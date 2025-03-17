"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { pageApi } from "@/lib/pageApi";
import type { IPageData } from "@/types/page";
import Loader from "@/components/Loader";
import { Helmet } from "react-helmet-async";

const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [pageData, setPageData] = useState<IPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      setIsLoading(true);
      try {
        if (slug) {
          // Convert the slug back to the original format
          const originalSlug = slug.replace(/-/g, " ").toLowerCase();
          const response = await pageApi.getPageBySlug(originalSlug);
          if (response?.page) {
            setPageData(response?.page);
          } else {
            setPageData(null);
          }
        }
      } catch (error) {
        console.error("Error fetching page data:", error);
        setPageData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, [slug]);

  console.log("pageData", pageData);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{pageData.metaTitle || pageData.title}</title>
        <meta name="description" content={pageData.metaDescription} />
        <meta name="keywords" content={pageData.metaKeywords} />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{pageData.title}</h1>
        <div
          className="page-content"
          dangerouslySetInnerHTML={{ __html: pageData.content }}
        />
      </div>
    </>
  );
};

export default DynamicPage;
