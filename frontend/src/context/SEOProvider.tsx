"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { getSeoMetaByPage } from "@/lib/seoMetaApi";
import type { ISeoMeta } from "@/types/seoMeta";

interface SEOContextType {
  seoMeta: ISeoMeta | null;
}

export const SEOContext = createContext<SEOContextType | undefined>(undefined);

export const SEOProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [seoMeta, setSeoMeta] = useState<ISeoMeta | null>(null);
  const location = useLocation();

  useEffect(() => {
    const fetchSeoMeta = async () => {
      try {
        let pageTitle = location.pathname.slice(1) || "global";
        pageTitle = decodeURIComponent(pageTitle);

        console.log("Fetching SEO for:", pageTitle);
        let data = await getSeoMetaByPage(pageTitle);

        if (!data && pageTitle !== "global") {
          console.log("Falling back to global SEO data");
          data = await getSeoMetaByPage("global");
        }

        setSeoMeta(data);
      } catch (error) {
        console.error("Failed to fetch SEO metadata:", error);
      }
    };

    fetchSeoMeta();
  }, [location.pathname]);
  // console.log("SEO Meta data in provider", seoMeta);
  return (
    <HelmetProvider>
      <SEOContext.Provider value={{ seoMeta }}>{children}</SEOContext.Provider>
    </HelmetProvider>
  );
};

export const useSEO = () => {
  const context = useContext(SEOContext);
  if (!context) {
    throw new Error("useSEO must be used within an SEOProvider");
  }
  return context;
};
