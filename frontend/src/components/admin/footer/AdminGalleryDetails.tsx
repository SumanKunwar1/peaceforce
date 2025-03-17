"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { IGalleryCategory, IGalleryEvent } from "@/types/gallery";
import * as galleryApi from "@/lib/gallery";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Check, Upload, Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Loader from "@/components/Loader";

const AdminGalleryDetails: React.FC = () => {
  const { categoryId, eventId } = useParams<{
    categoryId: string;
    eventId: string;
  }>();
  const [category, setCategory] = useState<IGalleryCategory | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<IGalleryEvent | null>(
    null
  );
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategoryDetails();
  }, [categoryId, eventId]);

  const fetchCategoryDetails = async () => {
    if (!categoryId || !eventId) return;
    try {
      setIsLoading(true);
      const fetchedCategory = await galleryApi.fetchGalleryCategoryById(
        categoryId
      );
      setCategory(fetchedCategory);
      const event = fetchedCategory?.events?.find(
        (event) => event._id === eventId
      );
      if (event) {
        setSelectedEvent(event);
      } else {
        setError("Event not found");
      }
    } catch (err) {
      console.error("Error fetching category details:", err);
      setError("Failed to load category data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && categoryId && eventId) {
      try {
        setIsLoading(true);
        const formData = new FormData();
        Array.from(files).forEach((file) => formData.append("images", file));
        await galleryApi.insertEventImages(categoryId, eventId, formData);
        await fetchCategoryDetails();
        toast({
          title: "Images uploaded successfully",
          description: `${files.length} image(s) have been added to the event.`,
        });
      } catch (err) {
        console.error("Error uploading images:", err);
        toast({
          title: "Error uploading images",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleImageSelection = (imageUrl: string) => {
    setSelectedImages((prev) =>
      prev.includes(imageUrl)
        ? prev.filter((url) => url !== imageUrl)
        : [...prev, imageUrl]
    );
  };

  const handleRemoveSelectedImages = async () => {
    if (categoryId && eventId && selectedImages.length > 0) {
      try {
        setIsLoading(true);
        await Promise.all(
          selectedImages.map((imageUrl) =>
            galleryApi.deleteEventImage(categoryId, eventId, imageUrl)
          )
        );
        await fetchCategoryDetails();
        setSelectedImages([]);
        toast({
          title: "Images removed successfully",
          description: `${selectedImages.length} image(s) have been removed from the event.`,
        });
      } catch (err) {
        console.error("Error removing images:", err);
        toast({
          title: "Error removing images",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="text-center text-gray-600">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!category || !selectedEvent) {
    return (
      <div className="text-center text-gray-500">
        Category or event not found
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {category.name} - {selectedEvent.title}
      </h1>

      {/* Image Upload */}
      <div className="mb-6">
        <label className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition">
          <Upload className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700">Upload Images</span>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>

      {/* Image Grid */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Event Images
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {selectedEvent.images.map((imageUrl) => (
          <div key={imageUrl} className="relative group">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt="Gallery"
              className="w-full h-40 object-cover rounded-lg shadow-md"
            />
            {/* Selection Overlay */}
            <div
              className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg transition ${
                selectedImages.includes(imageUrl)
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-80"
              }`}
              onClick={() => handleImageSelection(imageUrl)}
            >
              {selectedImages.includes(imageUrl) ? (
                <Check className="w-10 h-10 text-green-500" />
              ) : (
                <div className="w-10 h-10 border-4 border-white rounded-full"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Remove Selected Images Button */}
      {selectedImages.length > 0 && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="mt-6 flex items-center gap-2"
            >
              <Trash className="w-5 h-5" />
              Remove {selectedImages.length} Selected Image(s)
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Images</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove {selectedImages.length} selected
                images? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRemoveSelectedImages}>
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default AdminGalleryDetails;
