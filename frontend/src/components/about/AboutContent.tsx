import { BookOpen, Heart } from "lucide-react";
import { IAboutContentInput } from "@/types/about";

interface AboutContentProps {
  aboutContent: IAboutContentInput[];
  image: string;
}

const AboutContent: React.FC<AboutContentProps> = ({ aboutContent, image }) => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {aboutContent.map((content, index) => {
              const IconComponent = content.icon ? BookOpen : BookOpen; // Replace with dynamic icon if needed
              return (
                <div key={index} className="space-y-4">
                  <IconComponent className="w-12 h-12 text-red-600" />
                  <h2 className="text-3xl font-bold">{content.title}</h2>
                  <p className="text-lg text-gray-700">{content.description}</p>
                </div>
              );
            })}
          </div>
          <div className="relative">
            <img
              src={
                image ||
                "https://images.unsplash.com/photo-160961938 5002-f40f1df9b7eb?auto=format&fit=crop&q=80"
              }
              alt="Buddhist Temple"
              className="rounded-lg shadow-xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-red-600 text-white p-6 rounded-lg shadow-lg">
              <Heart className="w-8 h-8 mb-2" />
              <p className="text-lg font-semibold">Established in 2003</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutContent;
