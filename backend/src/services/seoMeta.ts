import { SeoMeta, ISeoMeta } from "../models";
import { httpMessages } from "../utils/HttpMessage";
import { ISeoMetaInput, ISeoMetaUpdate } from "../types";

class SeoMetaService {
  async getSeoMeta(): Promise<ISeoMeta[] | null> {
    try {
      return await SeoMeta.find();
    } catch (error) {
      console.error("Error fetching SEO Meta:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async getSeoMetaByPage(pageTitle: string): Promise<ISeoMeta[] | null> {
    try {
      return await SeoMeta.findOne({ pageTitle });
    } catch (error) {
      console.error("Error fetching SEO Meta:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async updateSeoMeta(
    seoMetaId: string,
    seoMetaData: ISeoMetaUpdate
  ): Promise<ISeoMeta | null> {
    try {
      let seoMeta = await SeoMeta.findById(seoMetaId);

      if (!seoMeta) {
        throw httpMessages.NOT_FOUND("SEO Meta");
      }

      await SeoMeta.findByIdAndUpdate(seoMetaId, seoMetaData);

      return seoMeta;
    } catch (error) {
      console.error("Error updating SEO Meta:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async createSeoMeta(seoMetaData: ISeoMetaInput): Promise<ISeoMeta | null> {
    try {
      const seoMeta = new SeoMeta(seoMetaData);
      await seoMeta.save();

      return seoMeta;
    } catch (error) {
      console.error("Error updating SEO Meta:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async deleteSeoMeta(seoMetaId: string): Promise<ISeoMeta | null> {
    try {
      const seoMetaToDelete = await SeoMeta.findById(seoMetaId);
      if (!seoMetaToDelete) {
        throw httpMessages.NOT_FOUND("SEO Meta");
      }

      await SeoMeta.deleteOne();
      return seoMetaToDelete.toObject();
    } catch (error) {
      console.error("Error deleting SEO Meta:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }
}

export const seoMetaService = new SeoMetaService();
