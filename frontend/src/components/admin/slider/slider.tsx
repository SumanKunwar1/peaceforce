"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Trash } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import Loader from "@/components/Loader";

interface Button {
  text: string;
  link: string;
  bgColor: string;
  id?: string;
  _id?: string;
}

interface SliderData {
  id?: string;
  title?: string;
  description?: string;
  image: File | string | null;
  isVisible?: boolean;
  buttons?: Button[];
}

const Slider: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [slider, setSlider] = useState<Omit<SliderData, "id">>({
    title: "",
    description: "",
    image: null,
    buttons: [],
    isVisible: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSlider = async () => {
      if (id) {
        try {
          const response = await axios.get(`/api/slider/${id}`);
          setSlider(response.data.slider);
        } catch (error) {
          console.error("Error fetching slider:", error);
        }
      }
      setIsLoading(false);
    };

    fetchSlider();
  }, [id]);

  const handleInputChange = (
    field: keyof SliderData,
    value: string | boolean
  ) => {
    setSlider((prev) => ({ ...prev, [field]: value }));
  };

  const handleButtonChange = (
    index: number,
    field: keyof Button,
    value: string
  ) => {
    setSlider((prev) => ({
      ...prev,
      buttons:
        prev.buttons?.map((button, i) =>
          i === index ? { ...button, [field]: value } : button
        ) || [],
    }));
  };

  const handleAddButton = () => {
    setSlider((prev) => ({
      ...prev,
      buttons: [
        ...(prev.buttons || []),
        { text: "Button Name", link: "Button Link", bgColor: "#000000" },
      ],
    }));
  };

  const handleRemoveButton = (index: number) => {
    setSlider((prev) => ({
      ...prev,
      buttons: prev.buttons?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      setSlider((prev) => ({ ...prev, image: files[0] }));
    }
  };

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();
      if (slider.title) formData.append("title", slider.title);
      if (slider.description)
        formData.append("description", slider.description);
      if (typeof slider.isVisible === "boolean")
        formData.append("isVisible", String(slider.isVisible));

      // Remove 'id' and '_id' from buttons before sending
      const buttonsWithoutIds = slider.buttons?.map(
        ({ _id, id, ...button }) => button
      );

      if (buttonsWithoutIds) {
        formData.append("buttons", JSON.stringify(buttonsWithoutIds));
      }

      if (slider.image instanceof File) {
        formData.append("image", slider.image);
      } else if (typeof slider.image === "string") {
        formData.append("image", slider.image);
      }

      if (id) {
        await axios.patch(`/api/slider/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });
      } else {
        await axios.post("/api/slider", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });
      }
      navigate("/admin/slider");
    } catch (error) {
      console.error("Error saving slider:", error);
    }
  };

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  return (
    <AdminLayout>
      <div className="p-6">
        <motion.h1
          className="text-2xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {id ? "Edit Slider" : "Add New Slider"}
        </motion.h1>

        <motion.div
          className="bg-white rounded-lg shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <Input
              type="text"
              value={slider.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea
              value={slider.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Image
            </label>
            <div className="mt-1 flex items-center">
              {slider.image && typeof slider.image === "string" ? (
                <img
                  src={slider.image || "/placeholder.svg"}
                  alt="Slider"
                  className="w-32 h-32 object-cover rounded-lg mr-4"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-200 rounded-lg mr-4 flex items-center justify-center">
                  {slider.image ? (
                    <img
                      src={URL.createObjectURL(slider.image as File)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </div>
              )}
              <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {id ? "Change Image" : "Upload Image"}
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buttons
            </label>
            {slider.buttons?.map((button, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <Input
                  type="text"
                  value={button.text}
                  onChange={(e) =>
                    handleButtonChange(index, "text", e.target.value)
                  }
                  placeholder="Button Text"
                />
                <Input
                  type="text"
                  value={button.link}
                  onChange={(e) =>
                    handleButtonChange(index, "link", e.target.value)
                  }
                  placeholder="Button Link"
                />
                <Input
                  type="color"
                  value={button.bgColor}
                  onChange={(e) =>
                    handleButtonChange(index, "bgColor", e.target.value)
                  }
                  className="w-12 h-10 p-1"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveButton(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button onClick={handleAddButton} className="mt-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Button
            </Button>
          </div>

          <div className="mb-4 flex items-center">
            <label className="block text-sm font-medium text-gray-700 mr-2">
              Visible
            </label>
            <Switch
              checked={slider.isVisible || false}
              onCheckedChange={(checked) =>
                handleInputChange("isVisible", checked)
              }
            />
          </div>

          <div className="mt-6">
            <Button onClick={handleSaveChanges} className="w-full">
              Save Changes
            </Button>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default Slider;
