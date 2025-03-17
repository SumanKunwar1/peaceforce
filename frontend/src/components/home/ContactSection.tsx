"use client";

import type React from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useEnquiries } from "@/lib/enquiry";
import type { IContactData, IContactInput } from "@/types/contact";
import { useToast } from "@/hooks/use-toast";

const LocationSection: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<IContactInput>({
    name: "",
    email: "",
    phoneNumber: "",
    message: "",
    page: "Contact",
    pageTitle: "Contact Us",
  });

  const { createEnquiry } = useEnquiries();

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createEnquiry(formData as IContactData);
      toast({
        title: "Success",
        description: "Your enquiry has been submitted successfully.",
      });
      // Reset the form after submission
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        message: "",
        page: "Contact",
        pageTitle: "Contact Us",
      });
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      toast({
        title: "Error",
        description: "Failed to submit enquiry. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold mb-4 text-center">
              Contact Us
            </h3>
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              id="contact-form"
            >
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Your Contact Number"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your Message"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  rows={4}
                  required
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-red-600 w-full text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </motion.div>

          {/* Google Map */}
          <motion.div
            className="rounded-lg overflow-hidden shadow-lg h-[450px]"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1765.9625840525828!2d85.3403874!3d27.7375881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb190011545255:0xca8e5c9afa20eaeb!2sP8QR%2B25J%2C%20Ring%20Rd%2C%20Kathmandu%2044600!5e0!3m2!1sen!2snp!4v1717907677167"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
