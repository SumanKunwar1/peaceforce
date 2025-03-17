import { IPageData, Page } from "../models";
import { httpMessages } from "../utils/HttpMessage";
import { IpageInput } from "../types";

class PageService {
  async createPage(pageData: IpageInput): Promise<IPageData> {
    try {
      const newPage = new Page(pageData);
      await newPage.save();
      return newPage.toObject();
    } catch (error) {
      console.error("Error creating page:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async getPages(): Promise<IPageData[] | null> {
    try {
      return await Page.find();
    } catch (error) {
      console.error("Error fetching pages:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async getPublishedPages(): Promise<IPageData[] | null> {
    try {
      return await Page.find({ status: "published" });
    } catch (error) {
      console.error("Error fetching pages:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async getPageBySlug(slug: string): Promise<IPageData | null> {
    try {
      console.log(
        "Fetch the page directly using findOne, which returns a single document"
      );
      const page = await this.getPublishedPages(); // assuming this returns an array of pages

      // If the page is not found, throw an error
      if (!page) {
        throw httpMessages.NOT_FOUND("Page not found");
      }

      // Find the page by slug from the array (if you're still fetching a list)
      const foundPage = page.find((p) => p.slug === slug);

      if (!foundPage) {
        throw httpMessages.NOT_FOUND("Page not found with the given slug");
      }

      // Return the found page as an object (no need for array methods)
      console.log("Page:", foundPage);
      return foundPage; // Return the found page object
    } catch (error) {
      console.error("Error fetching page by slug:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async updatePage(
    pageId: string,
    pageData: IpageInput
  ): Promise<IPageData | null> {
    try {
      const updatedPage = await Page.findByIdAndUpdate(pageId, pageData, {
        new: true,
      });
      if (!updatedPage) {
        throw httpMessages.NOT_FOUND("Page not found");
      }
      return updatedPage.toObject();
    } catch (error) {
      console.error("Error updating page:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async deletePage(pageId: string): Promise<IPageData | null> {
    try {
      const pageToDelete = await Page.findById(pageId);
      if (!pageToDelete) {
        throw httpMessages.NOT_FOUND("Page not found");
      }

      await Page.findByIdAndDelete(pageId);
      return pageToDelete.toObject();
    } catch (error) {
      console.error("Error deleting page:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }
}

export const pageService = new PageService();
