"use client";

import type React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { ISupport } from "@/types/support";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

interface SupportHeroProps {
  hero: ISupport["hero"];
  onChange: (hero: ISupport["hero"]) => void;
  onFileChange: (file: File | null) => void;
}

const SupportHero: React.FC<SupportHeroProps> = ({
  hero,
  onChange,
  onFileChange,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (typeof hero.image === "string") {
      setImagePreview(hero.image);
    } else if (hero.image instanceof File) {
      const objectUrl = URL.createObjectURL(hero.image);
      setImagePreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [hero.image]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onChange({ ...hero, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      onFileChange(file);
    }
  };

  return (
    <section className="bg-gradient-to-r from-red-600 to-red-800 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center space-x-4">
          <Heart className="w-12 h-12 text-white" />
          <div className="w-full">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Input
                type="text"
                name="title"
                value={hero.title}
                onChange={handleChange}
                className="text-4xl font-bold text-white mb-2 bg-transparent border-b border-white w-full"
                placeholder="Enter title"
              />
            </motion.div>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Textarea
                name="subtitle"
                value={hero.subtitle}
                onChange={handleChange}
                className="text-red-100 text-lg bg-transparent border-b border-white w-full"
                placeholder="Enter subtitle"
              />
            </motion.div>
          </div>
        </div>
        <div className="mt-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-white"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt={hero.title || "Hero image"}
                className="max-w-xs rounded"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SupportHero;
