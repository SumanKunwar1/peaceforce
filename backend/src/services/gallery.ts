import { IGalleryCategoryInput, IGalleryEventUpdate } from "../types";
import { GalleryCategory, IGalleryCategory, IGalleryEvent } from "../models";
import { deleteFile } from "../utils/deleteFile";
import { httpMessages } from "../utils/HttpMessage";

class GalleryCategoryService {
  async createGalleryCategory(name: string): Promise<IGalleryCategory> {
    try {
      const newGalleryCategory = new GalleryCategory({
        name,
      });

      await newGalleryCategory.save();
      return newGalleryCategory;
    } catch (error) {
      console.error("Error creating gallery category:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async updateGalleryCategory(
    categoryId: string,
    name: string
  ): Promise<IGalleryCategory> {
    try {
      const newGalleryCategory = await GalleryCategory.findById(categoryId);
      if (!newGalleryCategory) {
        throw httpMessages.NOT_FOUND("Gallery Category ");
      }
      newGalleryCategory.name = name;
      await newGalleryCategory.save();
      return newGalleryCategory;
    } catch (error) {
      console.error("Error updating gallery category:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async insertEventImages(
    eventId: string,
    categoryId: string,
    images: string[]
  ): Promise<string> {
    const existingCategory = await GalleryCategory.findById(categoryId);
    if (!existingCategory) {
      throw httpMessages.USER_NOT_FOUND("Gallery category");
    }

    const event = existingCategory.events.find((e) => e.id === eventId);
    if (!event) {
      throw httpMessages.USER_NOT_FOUND("Gallery event");
    }

    event.images.push(...images);
    await existingCategory.save();
    return `Successfully added ${images.length} images to event ${eventId}.`;
  }

  async getGalleryCategories(): Promise<IGalleryCategory[]> {
    try {
      const categories = await GalleryCategory.find();

      return categories.map((category) => {
        const categoryObj = category.toObject();

        return {
          ...categoryObj,
          events: (categoryObj.events || []).map((event) => ({
            ...event,
            coverImage: event?.coverImage
              ? `/api/image/${event.coverImage}`
              : "/placeholder.svg", // Default image in case coverImage is null or undefined
            images: (event?.images || []).map((image) => `/api/image/${image}`),
          })),
        } as IGalleryCategory;
      });
    } catch (error) {
      console.error("Error fetching gallery categories:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async getGalleryCategoryById(id: string): Promise<IGalleryCategory | null> {
    try {
      const category = await GalleryCategory.findById(id);
      if (!category) {
        throw httpMessages.USER_NOT_FOUND("Gallery category");
      }

      const categoryObj = category.toObject() as any;
      categoryObj.events = (categoryObj.events || []).map((event: any) => ({
        ...event,
        coverImage: event?.coverImage
          ? `/api/image/${event.coverImage}`
          : "/placeholder.svg", // Default image in case coverImage is null or undefined
        images: (event?.images || []).map(
          (image: any) => `/api/image/${image}`
        ),
      }));

      return categoryObj;
    } catch (error) {
      console.error("Error fetching gallery category by ID:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async getEventById(
    categoryId: string,
    eventId: string
  ): Promise<IGalleryEvent | null> {
    try {
      const category = await GalleryCategory.findById(categoryId);
      if (!category) {
        throw httpMessages.USER_NOT_FOUND("Gallery category");
      }

      const event = category.events.find(
        (event) => event._id.toString() === eventId
      );

      if (!event) {
        throw httpMessages.USER_NOT_FOUND("Event not found");
      }

      const eventObj = event.toObject() as any;
      eventObj.coverImage = event?.coverImage
        ? `/api/image/${event.coverImage}`
        : "";

      eventObj.images = (event?.images || []).map(
        (image: any) => `/api/image/${image}`
      );

      return eventObj;
    } catch (error) {
      console.error("Error fetching event by ID:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async insertGalleryEvent(
    categoryId: string,
    galleryCategoryData: IGalleryEventUpdate
  ): Promise<IGalleryCategory | null> {
    try {
      // Step 1: Find the existing category by ID
      const existingCategory = await GalleryCategory.findById(categoryId);
      if (!existingCategory) {
        throw httpMessages.USER_NOT_FOUND("Gallery category");
      }
      console.log("initially", existingCategory);

      // Step 2: Extract the event object from the provided data
      const { events } = galleryCategoryData as any;

      // Step 3: Push the event object into the events array
      existingCategory.events.push(events); // Just push the object directly

      console.log("updated but not saved", existingCategory);

      // Step 4: Save the updated category to the database
      const updatedCategory = await existingCategory.save();

      console.log("updated and saved", updatedCategory);

      return updatedCategory;
    } catch (error) {
      console.error("Error updating gallery category:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async updateGalleryEvent(
    categoryId: string,
    eventId: string,
    galleryCategoryData: IGalleryEventUpdate
  ) {
    try {
      const category = await GalleryCategory.findById(categoryId);
      if (!category) {
        throw new Error("Category not found");
      }

      const event = category.events.find(
        (event) => event._id.toString() === eventId
      );
      if (!event) {
        throw new Error("Event not found");
      }

      const { events } = galleryCategoryData;
      const { coverImage } = events;

      // Handle the coverImage logic
      if (coverImage) {
        if (coverImage === "") {
          // If the coverImage is set to an empty string, delete the existing one
          if (event.coverImage) {
            await deleteFile(event.coverImage);
          }
          event.coverImage = ""; // Remove the coverImage
        } else if (!coverImage.startsWith("/api/image/")) {
          if (event.coverImage) {
            await deleteFile(event.coverImage);
          }
          event.coverImage = coverImage; // Update with the new coverImage
        }
      }
      if (events.title) event.title = events.title;
      if (events.description) event.description = events.description;
      if (events.date) event.date = events.date;

      // Save the updated category with the modified event
      await category.save();

      return category; // Return the updated category (or the event, depending on your needs)
    } catch (error) {
      throw error; // Handle errors (e.g., category not found, event not found, etc.)
    }
  }

  async deleteGalleryCategory(id: string): Promise<string> {
    try {
      const categoryToDelete = await GalleryCategory.findById(id);

      if (!categoryToDelete) {
        throw httpMessages.USER_NOT_FOUND("Gallery category");
      }

      for (const event of categoryToDelete.events) {
        if (event.coverImage) {
          await deleteFile(event.coverImage);
        }

        for (const image of event.images) {
          await deleteFile(image);
        }
      }

      await GalleryCategory.findByIdAndDelete(id);

      return `Gallery category with ID ${id} has been deleted`;
    } catch (error) {
      console.error("Error deleting gallery category:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async deleteEventImage(
    eventId: string,
    categoryId: string,
    images: string[]
  ): Promise<any> {
    try {
      const formatImageArray = images.map((image) =>
        image.replace("/api/image/", "")
      );
      const category = await GalleryCategory.findById(categoryId);
      if (!category) {
        throw httpMessages.USER_NOT_FOUND("Gallery category");
      }

      const event = category.events.find((event) => event.id === eventId);
      if (!event) {
        throw httpMessages.USER_NOT_FOUND("Gallery event");
      }

      const deletedFiles: string[] = [];
      const notFoundFiles: string[] = [];

      for (const image of formatImageArray) {
        const imageIndex = event.images.findIndex((img) => img === image);

        if (imageIndex === -1) {
          notFoundFiles.push(image);
        } else {
          try {
            await deleteFile(image);
            event.images.splice(imageIndex, 1);
            deletedFiles.push(image);
          } catch (error) {
            notFoundFiles.push(image);
          }
        }
      }

      await category.save();

      return {
        message: "File deletion process completed.",
        deletedFilesCount: deletedFiles.length,
        notFoundFilesCount: notFoundFiles.length,
        deletedFiles,
        notFoundFiles,
      };
    } catch (error) {
      console.error("Error deleting event image:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async deleteEvent(eventId: string, categoryId: string): Promise<any> {
    try {
      const category = await GalleryCategory.findById(categoryId);
      if (!category) {
        throw httpMessages.USER_NOT_FOUND("Gallery category");
      }

      const eventIndex = category.events.findIndex(
        (event) => event._id.toString() === eventId
      );
      if (eventIndex === -1) {
        throw httpMessages.USER_NOT_FOUND("Gallery event");
      }

      // Get the event for deletion
      const event = category.events[eventIndex];

      if (event.coverImage) {
        await deleteFile(event.coverImage);
      }

      for (const image of event.images) {
        await deleteFile(image);
      }
      category.events.splice(eventIndex, 1);

      await category.save();

      return "Event deletion process completed.";
    } catch (error) {
      console.error("Error deleting event image:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }
}

export const galleryCategoryService = new GalleryCategoryService();
