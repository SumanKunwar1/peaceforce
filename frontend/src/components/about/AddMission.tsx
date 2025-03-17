import { Sparkles } from "lucide-react";

const missionContent = [
  {
    icon: Sparkles,
    title: "Mission of BTMC Foundation",
    description:
      "Our mission is to promote Buddhist values of peace, compassion, and mindfulness through education, spiritual guidance, and meaningful community initiatives. We are committed to offering accessible teachings, organizing transformative pilgrimage experiences, and supporting humanitarian efforts that encourage personal growth and inspire global harmony.",
  },
];

const AboutMission = () => {
  return (
    <section className="py-16 bg-green-800 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          {missionContent.map((content) => {
            const IconComponent = content.icon;
            return (
              <div key={content.title}>
                <IconComponent className="w-12 h-12 mb-6" />
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

export default AboutMission;
