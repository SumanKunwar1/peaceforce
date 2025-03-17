"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Users, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface DonationSectionProps {
  heroImage?: string | File | null;
}
const DonationSection: React.FC<DonationSectionProps> = ({ heroImage }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: "",
  });
  const getBackgroundImage = () => {
    if (typeof heroImage === "string") {
      return heroImage;
    } else if (heroImage instanceof File) {
      return URL.createObjectURL(heroImage);
    }
    return "/src/Assets/BTMC-Hero-Banner-1.png"; // Fallback image
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission
  };

  return (
    <section className="py-16 relative">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${getBackgroundImage()})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="text-white"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">Support Our Mission</h2>
            <Textarea
              className="text-lg mb-8 bg-transparent text-white"
              placeholder="Enter mission description"
              value="Your generous donation helps us maintain our facilities, support our teachers, and continue providing Buddhist education and meditation programs to our community."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: DollarSign,
                  title: "Transparent",
                  text: "Clear use of funds",
                },
                { icon: Users, title: "Impactful", text: "Helping thousands" },
                { icon: Heart, title: "Meaningful", text: "Supporting dharma" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: index * 0.1 }}
                >
                  <item.icon className="w-8 h-8 mx-auto mb-2 text-red-500" />
                  <Input
                    className="font-semibold mb-1 bg-transparent text-white text-center"
                    value={item.title}
                    placeholder="Enter title"
                  />
                  <Input
                    className="text-sm text-gray-300 bg-transparent text-center"
                    value={item.text}
                    placeholder="Enter description"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-8 rounded-lg shadow-xl"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-6">Make a Donation</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <Input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Donation Amount
                </label>
                <Input
                  type="number"
                  required
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-red-600 text-white hover:bg-red-700"
              >
                Donate Now
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DonationSection;
