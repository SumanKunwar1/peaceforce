import type React from "react";
import { Helmet } from "react-helmet-async";
import { useSEO } from "@/context/SEOProvider";

export const SEOHead: React.FC = () => {
  const { seoMeta } = useSEO();

  if (!seoMeta) return null;

  return (
    <>
      <Helmet>
        <title>{seoMeta.metaTitle}</title>
        <meta name="description" content={seoMeta.metaDescription} />
        <meta name="keywords" content={seoMeta.metaKeywords.join(", ")} />
        {seoMeta.canonicalUrl && (
          <link rel="canonical" href={seoMeta.canonicalUrl} />
        )}
        <meta name="robots" content={seoMeta.robotsMeta} />
        <meta property="og:title" content={seoMeta.ogTitle} />
        <meta property="og:description" content={seoMeta.ogDescription} />
        {seoMeta.ogImage && (
          <meta property="og:image" content={seoMeta.ogImage} />
        )}
      </Helmet>
    </>
  );
};
