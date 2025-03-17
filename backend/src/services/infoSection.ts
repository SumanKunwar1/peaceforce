import { IInfoSectionData, InfoSection } from "@models";
import { httpMessages } from "@utils/HttpMessage";
import { IInfoSectionInput } from "@typeInterface";

class InfoSectionService {
  async getInfoSection(): Promise<IInfoSectionData | null> {
    try {
      return await InfoSection.findOne();
    } catch (error) {
      console.error("Error fetching info section:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async updateInfoSection(
    infoSectionData: IInfoSectionInput
  ): Promise<IInfoSectionData | null> {
    try {
      let infoSection = await InfoSection.findOne();

      if (!infoSection) {
        infoSection = new InfoSection(infoSectionData);
        await infoSection.save();
      } else {
        infoSection = await InfoSection.findOneAndUpdate({}, infoSectionData, {
          new: true,
        });
      }

      if (!infoSection) {
        throw httpMessages.NOT_FOUND("Info section");
      }

      return infoSection.toObject();
    } catch (error) {
      console.error("Error updating info section:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async deleteInfoSection(): Promise<IInfoSectionData | null> {
    try {
      const infoSectionToDelete = await InfoSection.findOne();
      if (!infoSectionToDelete) {
        throw httpMessages.NOT_FOUND("Info section");
      }

      await InfoSection.deleteOne();

      return infoSectionToDelete.toObject();
    } catch (error) {
      console.error("Error deleting info section:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }
}

export const infoSectionService = new InfoSectionService();
