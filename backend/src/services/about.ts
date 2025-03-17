import { IAbout, About } from "../models/index"; // Assuming these are your models
import { IAboutInput } from "../types/index"; // Interface for input data
import { httpMessages } from "../utils/HttpMessage";
import { deleteFile } from "../utils/deleteFile";

class AboutService {
  // Create a new About section
  async createAbout(aboutData: IAboutInput): Promise<IAbout> {
    try {
      const newAbout = new About(aboutData);
      await newAbout.save();
      return newAbout;
    } catch (error) {
      console.error("Error creating About section:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async getAbout(): Promise<IAbout[]> {
    try {
      const aboutSections = await About.find();

      return aboutSections.map((about) => {
        const aboutObj = about.toObject();
        // Format image URL if image exists
        aboutObj.image = aboutObj.image
          ? `/api/image/${aboutObj.image}`
          : aboutObj.image;

        return aboutObj;
      });
    } catch (error) {
      console.error("Error fetching About sections:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async getAboutById(aboutId: string): Promise<IAbout | null> {
    try {
      const about = await About.findById(aboutId);
      if (!about) {
        throw httpMessages.USER_NOT_FOUND("About section");
      }

      const aboutObj = about.toObject();
      aboutObj.image = aboutObj.image
        ? `/api/image/${aboutObj.image}`
        : aboutObj.image;

      return aboutObj;
    } catch (error) {
      console.error("Error fetching About section by ID:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async updateAbout(aboutData: IAboutInput): Promise<IAbout> {
    try {
      let existingAbout = await About.findOne(); // Find the only About document

      if (aboutData.image) {
        if (aboutData.image === "") {
          if (existingAbout?.image) {
            await deleteFile(existingAbout.image);
          }
          aboutData.image = ""; // Set empty string
        } else if (!aboutData.image.startsWith("/api/image/")) {
          if (existingAbout?.image) {
            await deleteFile(existingAbout.image);
          }
        }
      }

      if (existingAbout) {
        existingAbout.set(aboutData);
        await existingAbout.save();
        return existingAbout;
      } else {
        const newAbout = new About(aboutData);
        await newAbout.save();
        return newAbout;
      }
    } catch (error) {
      console.error("Error updating/creating About section:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  // Delete an About section
  async deleteAbout(aboutId: string): Promise<IAbout | null> {
    try {
      const deletedAbout = await About.findByIdAndDelete(aboutId);
      if (!deletedAbout) {
        throw httpMessages.USER_NOT_FOUND("About section");
      }
      return deletedAbout;
    } catch (error) {
      console.error("Error deleting About section:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }
}

// Export an instance of AboutService
export const aboutService = new AboutService();
