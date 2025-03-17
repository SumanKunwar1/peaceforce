import type React from "react";
import { Sparkles } from "lucide-react";
import type { IAboutContentInput } from "@/types/about";

interface AboutVisionProps {
  visionSection: IAboutContentInput[];
}

const AboutVision: React.FC<AboutVisionProps> = ({ visionSection }) => {
  return (
    <section className="py-16 bg-red-800 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-evenly flex-row items-center text-center">
          {visionSection.map((content, index) => {
            return (
              <div key={index}>
                <Sparkles className="w-12 h-12 mb-6" />
                <h2 className="text-3xl font-bold mb-6">{content.title}</h2>
                <p className="text-lg max-w-3xl">{content.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutVision;
