import type React from "react";
import { Target, Users, Heart } from "lucide-react";
import type { IAboutContentInput } from "@/types/about";

interface AboutMissionProps {
  missionsSection: IAboutContentInput[];
}

const AboutMission: React.FC<AboutMissionProps> = ({ missionsSection }) => {
  const iconMap: { [key: string]: React.ElementType } = {
    Target,
    Users,
    Heart,
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why BTMC Foundation Was Founded
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {missionsSection.map((mission, index) => {
            const IconComponent =
              iconMap[mission.icon as keyof typeof iconMap] || Target;
            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <IconComponent className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-4">{mission.title}</h3>
                <p className="text-gray-700">{mission.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutMission;
