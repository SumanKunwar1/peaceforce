import { IEventInput } from "../types";
import { Event, IEvent, BookEvent } from "../models";
import { deleteFile } from "../utils/deleteFile";
import { httpMessages } from "../utils/HttpMessage";
import { bookEventService } from "./bookEventForm";

class EventService {
  // Create a new event
  async createEvent(eventData: IEventInput): Promise<IEvent> {
    try {
      // Directly create new event without saving images
      const newEvent = new Event({
        ...eventData,
      });

      await newEvent.save();
      return newEvent;
    } catch (error) {
      console.error("Error creating event:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  // Get all events
  async getEvents(): Promise<IEvent[]> {
    try {
      const events = await Event.find();

      return events.map((event) => {
        const eventObj = event.toObject();
        return {
          ...eventObj,
          image: eventObj.image
            ? `/api/image/${eventObj.image}`
            : eventObj.image,
          gallery: eventObj.gallery
            ? eventObj.gallery.map((file) => `/api/image/${file}`)
            : [],
        } as IEvent;
      });
    } catch (error) {
      console.error("Error fetching events:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  // Get an event by ID
  async getEventById(id: string): Promise<IEvent | null> {
    try {
      const event = await Event.findById(id);
      if (!event) {
        throw httpMessages.USER_NOT_FOUND("Event");
      }

      const eventObj = event.toObject();
      eventObj.image = eventObj.image
        ? `/api/image/${eventObj.image}`
        : eventObj.image;
      eventObj.gallery = eventObj.gallery
        ? eventObj.gallery.map((file) => `/api/image/${file}`)
        : [];

      return eventObj;
    } catch (error) {
      console.error("Error fetching event by ID:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  // Update an existing event
  async updateEvent(
    id: string,
    eventData: IEventInput
  ): Promise<IEvent | null> {
    try {
      const existingEvent = await Event.findById(id);
      if (!existingEvent) {
        throw httpMessages.USER_NOT_FOUND("Event");
      }

      // Handle image updates (if it's an empty string, delete it)
      if (eventData.image) {
        if (eventData.image === "") {
          // Delete the existing image if new one is empty
          if (existingEvent.image) {
            await deleteFile(existingEvent.image);
          }
          eventData.image = ""; // Set empty string
        } else if (!eventData.image.startsWith("/api/image/")) {
          // If it's a plain string (new image filename), delete the old one and update
          if (existingEvent.image) {
            await deleteFile(existingEvent.image);
          }
          // Here, the image is assumed to be already saved, so we just update it
          eventData.image = eventData.image;
        }
      }

      // Handle gallery updates
      if (eventData.gallery !== undefined) {
        // If the gallery is an empty array, delete all the existing files
        if (eventData.gallery.length === 0) {
          if (existingEvent.gallery) {
            for (const file of existingEvent.gallery) {
              await deleteFile(file);
            }
          }
          eventData.gallery = []; // Set to empty array
        } else if (
          !eventData.gallery.every((file) => file.startsWith("/api/image/"))
        ) {
          if (existingEvent.gallery) {
            for (const file of existingEvent.gallery) {
              await deleteFile(file);
            }
          }
          eventData.gallery = eventData.gallery; // Replace with the new gallery items (filenames)
        }
      }

      // Update the event and return the updated event
      const updatedEvent = await Event.findByIdAndUpdate(id, eventData, {
        new: true,
      });

      if (!updatedEvent) {
        throw httpMessages.USER_NOT_FOUND("Event");
      }

      return updatedEvent;
    } catch (error) {
      console.error("Error updating event:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  // Delete an event
  async deleteEvent(id: string): Promise<string> {
    try {
      const eventToDelete = await Event.findById(id);

      if (!eventToDelete) {
        throw httpMessages.USER_NOT_FOUND("Event");
      }

      // Delete the event image
      if (eventToDelete.image) {
        await deleteFile(eventToDelete.image);
      }

      // Delete gallery images
      if (eventToDelete.gallery && eventToDelete.gallery.length !== 0) {
        for (const file of eventToDelete.gallery) {
          await deleteFile(file);
        }
      }
      const bookingFormsToDelete = await BookEvent.find({ eventId: id });

      if (bookingFormsToDelete.length > 0) {
        for (const bookingForm of bookingFormsToDelete) {
          await bookEventService.deleteBookEvent(bookingForm._id.toString());
        }
      }
      await Event.findByIdAndDelete(id);

      return `Event with ID ${id} and its corresponding bookings has been deleted`;
    } catch (error) {
      console.error("Error deleting event:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }
}

export const eventService = new EventService();
