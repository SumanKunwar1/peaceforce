"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import { faqApi } from "@/lib/faqApi";
import Loader from "@/components/Loader";
import { Helmet } from "react-helmet-async";
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
}

const FaqPage = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [faqData, setFaqData] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const faqs = await faqApi.getFAQs();
        setFaqData(faqs as FAQ[]);
        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to fetch FAQs");
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);
  console.log("Current FAQ Data:", faqData);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-green-600">
        {error}
      </div>
    );
  }

  return (
    <>
      {faqData.map((faq) => (
        <Helmet>
          <title>FAQs - BTMC Foundation</title>
          <title>{faq.metaTitle}</title>
          <meta name="description" content={faq.metaDescription} />
          <meta name="keywords" content={faq.metaKeywords.join(", ")} />
        </Helmet>
      ))}
      <div className="min-h-screen bg-gray-50 font-sans">
        {/* Navbar */}
        <div className="bg-green-600 text-white p-4 text-center">
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
                  className={`flex items-center justify-between px-6 py-4 cursor-pointer bg-green-600 text-white transition-all ${
                    activeIndex === index ? "bg-green-800" : "bg-green-700"
                  }`}
                  onClick={() => toggleAccordion(index)}
                >
                  <h4 className="text-lg font-semibold">{faq.question}</h4>
                  <motion.div
                    animate={{
                      rotate: activeIndex === index ? 180 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaChevronDown
                      className={`text-xl ${
                        activeIndex === index ? "text-white" : "text-gray-300"
                      }`}
                    />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      className="px-6 py-4 bg-gray-100 text-gray-700"
                      animate={{ height: "auto", opacity: 1 }}
                      initial={{ height: 0, opacity: 0 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <p className="leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo(0, 0)}
          className="fixed bottom-10 right-10 bg-green-600 text-white p-3 rounded-full shadow-lg"
        >
          ↑
        </button>
      </div>
    </>
  );
};

export default FaqPage;
