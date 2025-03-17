import type React from "react";
import { Target, Users, Heart } from "lucide-react";
import type { IAboutInput } from "@/types/about";

interface AboutMissionProps {
  data: IAboutInput;
  onUpdate: (data: Partial<IAboutInput>) => void;
}

const AboutMission: React.FC<AboutMissionProps> = ({ data, onUpdate }) => {
  const handleUpdate = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    const updatedMissions = [...data.missionsSection];
    updatedMissions[index] = { ...updatedMissions[index], [field]: value };
    onUpdate({ missionsSection: updatedMissions });
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Target":
        return Target;
      case "Users":
        return Users;
      case "Heart":
        return Heart;
      default:
        return Target;
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12" contentEditable>
          Why BTMC Foundation Was Founded
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.missionsSection.map((mission, index) => {
            const IconComponent = getIcon(mission.icon || "");
            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <IconComponent className="w-12 h-12 text-red-600 mb-4" />
                <h3
                  className="text-xl font-semibold mb-4"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    handleUpdate(
                      index,
                      "title",
                      e.currentTarget.textContent || ""
                    )
                  }
                >
                  {mission.title || `Mission ${index + 1}`}
                </h3>
                <p
                  className="text-gray-700"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    handleUpdate(
                      index,
                      "description",
                      e.currentTarget.textContent || ""
                    )
                  }
                >
                  {mission.description || "Enter mission description here"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutMission;
