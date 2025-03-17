import type React from "react";
import { Sparkles } from "lucide-react";
import type { IAboutInput } from "@/types/about";

interface AboutVisionProps {
  data: IAboutInput;
  onUpdate: (data: Partial<IAboutInput>) => void;
}

const AboutVision: React.FC<AboutVisionProps> = ({ data, onUpdate }) => {
  // Handle the update for each block independently
  const handleUpdate = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    const updatedVision = [...data.visionSection];
    updatedVision[index] = { ...updatedVision[index], [field]: value };
    onUpdate({ visionSection: updatedVision });
  };

  return (
    <section className="py-16 bg-red-800 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-evenly items-center text-center space-y-12 md:space-y-0 md:flex-row">
          {/* Block 1 */}
          <div>
            <Sparkles className="w-12 h-12 mb-6" />
            <h2
              className="text-3xl font-bold mb-6"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                handleUpdate(0, "title", e.currentTarget.textContent || "")
              }
            >
              {data.visionSection[0]?.title}
            </h2>
            <p
              className="text-lg max-w-3xl"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                handleUpdate(
                  0,
                  "description",
                  e.currentTarget.textContent || ""
                )
              }
            >
              {data.visionSection[0]?.description}
            </p>
          </div>

          {/* Block 2 */}
          <div>
            <Sparkles className="w-12 h-12 mb-6" />
            <h2
              className="text-3xl font-bold mb-6"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                handleUpdate(1, "title", e.currentTarget.textContent || "")
              }
            >
              {data.visionSection[1]?.title}
            </h2>
            <p
              className="text-lg max-w-3xl"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                handleUpdate(
                  1,
                  "description",
                  e.currentTarget.textContent || ""
                )
              }
            >
              {data.visionSection[1]?.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutVision;
