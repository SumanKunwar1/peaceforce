import { ISliderInput } from "@src/types"; // Adjust the import as necessary
import { Slider } from "@models"; // Assuming you have a Slider model
import { deleteFile } from "@utils/deleteFile"; // Assuming you have a utility function for deleting files
import { httpMessages } from "@utils/HttpMessage"; // Custom error handling utility

class SliderService {
  // Create a new slider
  async createSlider(sliderData: ISliderInput): Promise<any> {
    try {
      const newSlider = new Slider({
        ...sliderData,
      });

      await newSlider.save();
      return newSlider;
    } catch (error) {
      console.error("Error creating slider:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  // Get all sliders
  async getSliders(): Promise<any[]> {
    try {
      const sliders = await Slider.find();

      return sliders.map((slider) => {
        const sliderObj = slider.toObject();
        sliderObj.image = sliderObj.image
          ? `/api/image/${sliderObj.image}`
          : sliderObj.image;
        return sliderObj;
      });
    } catch (error) {
      console.error("Error fetching sliders:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  // Get a slider by ID
  async getSliderById(id: string): Promise<any | null> {
    try {
      const slider = await Slider.findById(id);
      if (!slider) {
        throw httpMessages.USER_NOT_FOUND("Slider");
      }

      const sliderObj = slider.toObject();
      sliderObj.image = sliderObj.image
        ? `/api/image/${sliderObj.image}`
        : sliderObj.image;

      return sliderObj;
    } catch (error) {
      console.error("Error fetching slider by ID:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  // Update an existing slider
  async updateSlider(
    id: string,
    sliderData: ISliderInput
  ): Promise<any | null> {
    try {
      const existingSlider = await Slider.findById(id);
      if (!existingSlider) {
        throw httpMessages.USER_NOT_FOUND("Slider");
      }

      // If an image is provided, handle it like in the ProgramService
      if (sliderData.image) {
        if (sliderData.image === "") {
          if (existingSlider.image) {
            await deleteFile(existingSlider.image);
          }
          sliderData.image = ""; // Set empty string to remove image
        } else if (!sliderData.image.startsWith("/api/image/")) {
          // If it's a new image (not starting with /api/image/), delete the old one
          if (existingSlider.image) {
            await deleteFile(existingSlider.image);
          }
          sliderData.image = sliderData.image; // Update image
        }
      }

      // Update the slider and return the updated slider
      const updatedSlider = await Slider.findByIdAndUpdate(id, sliderData, {
        new: true,
      });

      if (!updatedSlider) {
        throw httpMessages.USER_NOT_FOUND("Slider");
      }

      return updatedSlider;
    } catch (error) {
      console.error("Error updating slider:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  // Delete a slider
  async deleteSlider(id: string): Promise<string> {
    try {
      const sliderToDelete = await Slider.findById(id);

      if (!sliderToDelete) {
        throw httpMessages.USER_NOT_FOUND("Slider");
      }

      // Delete the slider image
      if (sliderToDelete.image) {
        await deleteFile(sliderToDelete.image);
      }

      await Slider.findByIdAndDelete(id);

      return `Slider with ID ${id} has been deleted`;
    } catch (error) {
      console.error("Error deleting slider:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  // Change the visibility of a slider
  async updateSliderVisibility(
    id: string,
    isVisible: boolean
  ): Promise<any | null> {
    try {
      const updatedSlider = await Slider.findByIdAndUpdate(
        id,
        { isVisible },
        { new: true }
      );

      if (!updatedSlider) {
        throw httpMessages.USER_NOT_FOUND("Slider");
      }

      return updatedSlider;
    } catch (error) {
      console.error("Error updating slider visibility:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }
}

export const sliderService = new SliderService();
