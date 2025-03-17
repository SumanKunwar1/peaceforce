import { ITour, Tour, BookingForm } from "@models";
import { ITourInput } from "@typeInterface";
import { httpMessages } from "@utils/HttpMessage";
import { deleteFile } from "@utils/deleteFile";
import { bookingFormService } from "./bookingForm";

class TourService {
  async createTour(tourData: ITourInput): Promise<ITour> {
    try {
      const newTour = new Tour({
        ...tourData,
      });

      await newTour.save();
      return newTour;
    } catch (error) {
      console.error("Error creating tour:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async getTours(): Promise<ITour[]> {
    try {
      const tours = await Tour.find();
      return tours.map((tour) => {
        const tourObj = tour.toObject();
        return {
          ...tourObj,
          image: tourObj.image ? `/api/image/${tourObj.image}` : tourObj.image,
        } as ITour;
      });
    } catch (error) {
      console.error("Error fetching tours:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async getTourById(tourId: string): Promise<ITour | null> {
    try {
      const tour = await Tour.findById(tourId);
      if (!tour) {
        throw httpMessages.USER_NOT_FOUND("Tour");
      }

      const tourObj = tour.toObject();
      if (tourObj.image) {
        tourObj.image = `/api/image/${tourObj.image}`;
      }

      return tourObj;
    } catch (error) {
      console.error("Error fetching tour by ID:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async updateTour(
    tourId: string,
    tourData: ITourInput
  ): Promise<ITour | null> {
    try {
      const existingTour = await Tour.findById(tourId);
      if (!existingTour) {
        throw httpMessages.USER_NOT_FOUND("Tour");
      }

      // Handle image field
      if (tourData.image) {
        console.log("Processing image field...");

        if (tourData.image === "") {
          console.log(
            "Image field is empty. Deleting existing image if present..."
          );

          if (existingTour.image) {
            console.log(`Deleting existing image: ${existingTour.image}`);
            await deleteFile(existingTour.image);
          }
          tourData.image = ""; // Set empty string
          console.log(
            "Image has been cleared. New image is set to an empty string."
          );
        } else if (!tourData.image.startsWith("/api/image/")) {
          console.log(
            "Image URL seems to be a new file path, updating image..."
          );

          if (existingTour.image) {
            console.log(`Deleting old image: ${existingTour.image}`);
            await deleteFile(existingTour.image);
          }

          // Save new image filename (assuming it's already saved somewhere)
          console.log(`New image file: ${tourData.image}`);
          tourData.image = tourData.image;
        }
      }

      // Update the tour in the database
      const updatedTour = await Tour.findByIdAndUpdate(tourId, tourData, {
        new: true,
      });

      if (!updatedTour) {
        throw httpMessages.USER_NOT_FOUND("Tour");
      }

      return updatedTour;
    } catch (error) {
      console.error("Error updating tour:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async deleteTour(tourId: string): Promise<ITour | null> {
    try {
      const tourToDelete = await Tour.findById(tourId);
      if (!tourToDelete) {
        throw httpMessages.USER_NOT_FOUND("Tour");
      }

      // Delete image file if it exists
      if (tourToDelete.image) {
        await deleteFile(tourToDelete.image);
      }

      const tourBookingToDelete = await BookingForm.find({
        tourId: tourToDelete._id,
      });

      if (tourBookingToDelete.length > 0) {
        for (const bookingForm of tourBookingToDelete) {
          await bookingFormService.deleteBookingForm(
            bookingForm._id.toString()
          );
        }
      }

      // Delete the tour itself
      await Tour.findByIdAndDelete(tourId);

      return tourToDelete;
    } catch (error) {
      console.error("Error deleting tour:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }
}

export const tourService = new TourService();
