import type React from "react";
import { useState } from "react";
import { BookOpen, Map, GraduationCap, Globe } from "lucide-react";
import type { IAboutInput } from "@/types/about";

interface AboutServicesProps {
  data: IAboutInput;
  onUpdate: (data: Partial<IAboutInput>) => void;
}

const AboutServices: React.FC<AboutServicesProps> = ({ data, onUpdate }) => {
  // Manage the new service form state
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    icon: "BookOpen", // Default icon
  });

  // Handle the input change for new service form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewService((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new service to the data
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (newService.title && newService.description) {
      const updatedServices = [...data.servicesSection, newService];
      onUpdate({ servicesSection: updatedServices });
      setNewService({ title: "", description: "", icon: "BookOpen" }); // Reset the form after adding
    }
  };

  // Update an existing service's field
  const handleUpdate = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    const updatedServices = [...data.servicesSection];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    onUpdate({ servicesSection: updatedServices });
  };

  // Get the appropriate icon based on the string value
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "BookOpen":
        return BookOpen;
      case "Map":
        return Map;
      case "GraduationCap":
        return GraduationCap;
      case "Globe":
        return Globe;
      default:
        return BookOpen;
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          What BTMC Foundation Does
        </h2>

        {/* Add Service Form */}
        <form onSubmit={handleAddService} className="space-y-4 mb-12">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Service Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newService.title}
              onChange={handleInputChange}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-500"
              placeholder="Enter service title"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Service Description
            </label>
            <textarea
              id="description"
              name="description"
              value={newService.description}
              onChange={handleInputChange}
              rows={3}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-500"
              placeholder="Enter service description"
              required
            />
          </div>
          <div>
            <label
              htmlFor="icon"
              className="block text-sm font-medium text-gray-700"
            >
              Icon (optional)
            </label>
            <input
              type="text"
              id="icon"
              name="icon"
              value={newService.icon}
              onChange={handleInputChange}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-500"
              placeholder="Enter icon name (e.g., BookOpen, Map, Globe)"
            />
          </div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Add Service
          </button>
        </form>

        {/* Existing Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.servicesSection.map((service, index) => {
            const IconComponent = getIcon(service.icon || "");
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
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
                  {service.title}
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
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutServices;
