import React, { useState } from "react";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { IAboutInput } from "../../../types/about";

interface AboutContentProps {
  data: IAboutInput;
  onUpdate: (data: Partial<IAboutInput>) => void;
  onImageUpload: (file: File) => void;
}

const AboutContent: React.FC<AboutContentProps> = ({
  data,
  onUpdate,
  onImageUpload,
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleEdit = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    const updatedContent = [...data.aboutContent];
    updatedContent[index] = { ...updatedContent[index], [field]: value };
    onUpdate({ aboutContent: updatedContent });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onImageUpload(file);

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <BookOpen className="w-12 h-12 text-red-600" />
            </motion.div>
            <motion.h2
              className="text-3xl font-bold"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.3 }}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                handleEdit(0, "title", e.currentTarget.textContent || "")
              }
            >
              {data.aboutContent[0]?.title || "Enter title here"}
            </motion.h2>
            <motion.p
              className="text-lg text-gray-700"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.4 }}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                handleEdit(0, "description", e.currentTarget.textContent || "")
              }
            >
              {data.aboutContent[0]?.description || "Enter description here"}
            </motion.p>
            {data.aboutContent[1] && (
              <motion.p
                className="text-lg text-gray-700"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.5 }}
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleEdit(
                    1,
                    "description",
                    e.currentTarget.textContent || ""
                  )
                }
              >
                {data.aboutContent[1].description}
              </motion.p>
            )}
          </motion.div>
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            <motion.img
              src={previewImage || (data.image as string | undefined)}
              alt="Buddhist Temple"
              className="rounded-lg shadow-xl w-full h-auto"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute bottom-4 left-4 bg-white text-sm p-2 rounded-lg cursor-pointer"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutContent;
