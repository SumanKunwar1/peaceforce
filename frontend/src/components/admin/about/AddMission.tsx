import type React from "react";
import { useState } from "react";
import type { IAboutContentInput } from "../../../types/about";

interface AddMissionProps {
  onAddMission: (newMission: IAboutContentInput) => void;
}

const AddMission: React.FC<AddMissionProps> = ({ onAddMission }) => {
  const [newMission, setNewMission] = useState<IAboutContentInput>({
    title: "",
    description: "",
    icon: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewMission((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMission(newMission);
    setNewMission({ title: "", description: "", icon: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Mission Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={newMission.title}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          required
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Mission Description
        </label>
        <textarea
          id="description"
          name="description"
          value={newMission.description}
          onChange={handleInputChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          required
        ></textarea>
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
          value={newMission.icon}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
        />
      </div>
      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Add New Mission
      </button>
    </form>
  );
};

export default AddMission;
