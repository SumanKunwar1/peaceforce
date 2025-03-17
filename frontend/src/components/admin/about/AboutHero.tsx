import React from "react";
import { Scroll } from "lucide-react";
import { IAboutInput } from "@/types/about";

interface AboutHeroProps {
  data: IAboutInput;
  onUpdate: (data: Partial<IAboutInput>) => void;
}

const AboutHero: React.FC<AboutHeroProps> = ({ data, onUpdate }) => {
  const handleUpdate = (field: "title" | "description", value: string) => {
    onUpdate({
      aboutHero: {
        ...data.aboutHero,
        [field]: value,
      },
    });
  };

  return (
    <section className="bg-gradient-to-r from-red-600 to-red-800 py-8">
      <div className="max-w-7xl mx-auto px-4 flex justify-center items-center">
        <div className="flex items-center space-x-4">
          <Scroll className="w-8 h-8 text-white" />
          <div>
            <h1
              className="text-3xl font-bold text-white"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                handleUpdate("title", e.currentTarget.textContent || "")
              }
            >
              {data.aboutHero.title || "Enter title here"}
            </h1>
            <p
              className="text-red-100 mt-1"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                handleUpdate("description", e.currentTarget.textContent || "")
              }
            >
              {data.aboutHero.description || "Enter description here"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
