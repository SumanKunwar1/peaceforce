import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type {
  IGalleryCategory,
  IGalleryCategoryInput,
  IGalleryEventInput,
} from "@/types/gallery";
import * as galleryApi from "@/lib/gallery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
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
import Loader from "@/components/Loader";

const AdminGallery: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<IGalleryCategory[]>([]);
  const [newCategory, setNewCategory] = useState<IGalleryCategoryInput>({
    name: "",
  });
  const [newEvent, setNewEvent] = useState<IGalleryEventInput>({
    title: "",
    description: "",
    date: "",
    coverImage: null,
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const fetchedCategories = await galleryApi.fetchGalleryCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      setError("Failed to load gallery categories. Please try again.");
      console.error("Error fetching categories:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewEvent((prev) => ({ ...prev, coverImage: file }));
    }
  };

  const addCategory = async () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category name.",
        variant: "destructive",
      });
      return;
    }

    try {
      const createdCategory = await galleryApi.createGalleryCategory(
        newCategory.name
      );
      setCategories((prev) => [...prev, createdCategory]);
      setNewCategory({ name: "" });

      toast({
        title: "Success",
        description: "Category created successfully.",
      });
    } catch (err) {
      console.error("Error creating category:", err);
      toast({
        title: "Error",
        description: "Failed to create category. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addEvent = async () => {
    if (!selectedCategoryId) {
      toast({
        title: "Error",
        description: "Please select a category.",
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append(
        "events",
        JSON.stringify({
          title: newEvent.title,
          description: newEvent.description,
          date: newEvent.date,
        })
      );

      if (newEvent.coverImage) {
        formData.append("coverImage", newEvent.coverImage);
      }

      const updatedCategory = await galleryApi.insertGalleryEvent(
        selectedCategoryId,
        formData
      );
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === selectedCategoryId ? updatedCategory : cat
        )
      );

      setNewEvent({ title: "", description: "", date: "", coverImage: null });
      fetchCategories();
      toast({ title: "Success", description: "Event added successfully." });
    } catch (err) {
      console.error("Error adding event:", err);
      toast({
        title: "Error",
        description: "Failed to add event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeCategory = async (categoryId: string) => {
    try {
      await galleryApi.deleteGalleryCategory(categoryId);
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
      toast({
        title: "Success",
        description: "Category removed successfully.",
      });
    } catch (err) {
      console.error("Error removing category:", err);
      toast({
        title: "Error",
        description: "Failed to remove category. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeEvent = async (categoryId: string, eventId: string) => {
    try {
      await galleryApi.deleteEvent(categoryId, eventId);
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                events: cat?.events?.filter((event) => event._id !== eventId),
              }
            : cat
        )
      );
      toast({
        title: "Success",
        description: "Event removed successfully.",
      });
    } catch (err) {
      console.error("Error removing event:", err);
      toast({
        title: "Error",
        description: "Failed to remove event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const editEvent = (categoryId: string, eventId: string) => {
    navigate(`/admin/gallery/${categoryId}/event/${eventId}`);
  };

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Gallery</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Create Gallery Category</h2>
        <div className="flex gap-4">
          <Input
            type="text"
            name="name"
            placeholder="Category Name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ name: e.target.value })}
            className="flex-grow"
          />
          <Button onClick={addCategory}>Create Category</Button>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Add New Event</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={selectedCategoryId || ""}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <Input
              type="text"
              name="title"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
            />
            <Textarea
              name="description"
              placeholder="Event Description"
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
            />
            <Input
              name="date"
              type="date"
              value={newEvent.date}
              onChange={(e) =>
                setNewEvent({ ...newEvent, date: e.target.value })
              }
            />
            <Input
              name="coverImage"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
            />
            <Button onClick={addEvent}>Add Event</Button>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">Categories and Events</h2>
        {categories.map((category) => (
          <div
            key={category.id}
            className="mb-8 p-4 bg-white rounded-lg shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{category.name}</h3>
              <div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Remove Category</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the category and all its events.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => removeCategory(category.id)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            {category.events?.map((event) => (
              <div
                key={event._id}
                className="mb-4 ml-4 p-4 bg-gray-100 rounded"
              >
                <h4 className="text-lg font-semibold">{event.title}</h4>
                <p className="mb-2">{event.description}</p>
                <p className="mb-2">
                  Date: {new Date(event.date).toLocaleDateString()}
                </p>
                {event.coverImage && (
                  <img
                    src={event.coverImage || "/placeholder.svg"}
                    alt={event.title}
                    className="w-32 h-32 object-cover mb-2 rounded"
                  />
                )}
                <div className="flex gap-2">
                  <Button onClick={() => editEvent(category.id, event._id!)}>
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete Event</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the event and all its images.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => removeEvent(category.id, event._id!)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGallery;
