import type React from "react";
import { BookOpen, Map, GraduationCap, Globe } from "lucide-react";
import type { IAboutContentInput } from "@/types/about";

interface AboutServicesProps {
  servicesSection: IAboutContentInput[];
}

const AboutServices: React.FC<AboutServicesProps> = ({ servicesSection }) => {
  const iconMap: { [key: string]: React.ElementType } = {
    BookOpen,
    Map,
    GraduationCap,
    Globe,
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          What BTMC Foundation Does
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {servicesSection.map((service, index) => {
            const IconComponent =
              iconMap[service.icon as keyof typeof iconMap] || BookOpen;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <IconComponent className="w-12 h-12 text-red-600 mb-4" />
                <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                <p className="text-gray-700">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutServices;
