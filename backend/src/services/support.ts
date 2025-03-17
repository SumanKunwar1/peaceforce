import { ISupportInput } from "../types";
import { Support, ISupport } from "../models";
import { deleteFile } from "../utils/deleteFile";
import { httpMessages } from "../utils/HttpMessage";

class SupportService {
  // Fetch the single support document
  async getSupport(): Promise<ISupport | null> {
    try {
      const support = await Support.findOne(); // Since there's only one document
      if (!support) {
        return null;
      }

      const supportObj = support.toObject();
      supportObj.hero.image = supportObj.hero.image
        ? `/api/image/${supportObj.hero.image}`
        : supportObj.hero.image;

      return supportObj;
    } catch (error) {
      console.error("Error fetching support:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  // Update the single support document
  async updateSupport(supportData: ISupportInput): Promise<ISupport | null> {
    try {
      let existingSupport = await Support.findOne();

      if (!existingSupport) {
        existingSupport = new Support(); // Create a new document if none exists
      }

      if (supportData.hero?.image) {
        if (supportData.hero?.image === "") {
          if (existingSupport.hero.image) {
            await deleteFile(existingSupport.hero.image);
          }
          supportData.hero.image = "";
        } else if (!supportData.hero.image.startsWith("/api/image/")) {
          if (existingSupport.hero.image) {
            await deleteFile(existingSupport.hero.image);
          }
        }
      }

      Object.assign(existingSupport, supportData); // Merge new data with existing data
      await existingSupport.save();

      return existingSupport;
    } catch (error) {
      console.error("Error updating support:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  // Delete the single support document
  async deleteSupport(): Promise<string> {
    try {
      const supportToDelete = await Support.findOne();

      if (!supportToDelete) {
        throw httpMessages.USER_NOT_FOUND("Support");
      }

      if (supportToDelete.hero?.image) {
        await deleteFile(supportToDelete.hero.image);
      }

      await Support.findByIdAndDelete(supportToDelete._id);

      return `Support document has been deleted`;
    } catch (error) {
      console.error("Error deleting support:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }
}

export const supportService = new SupportService();
