import { Scroll } from "lucide-react";
import { IAboutHeroContentInput } from "@/types/about";

interface AboutHeroProps {
  aboutHero: IAboutHeroContentInput;
}

const AboutHero: React.FC<AboutHeroProps> = ({ aboutHero }) => {
  return (
    <section className="bg-gradient-to-r from-red-600 to-red-800 py-8">
      <div className="max-w-7xl mx-auto px-4 flex justify-center items-center">
        <div className="flex items-center space-x-4">
          <Scroll className="w-8 h-8 text-white" />
          <div>
            <h1 className="text-3xl font-bold text-white">{aboutHero.title}</h1>
            <p className="text-red-100 mt-1">{aboutHero.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
