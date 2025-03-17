import { FAQ, IFAQ } from "@models";
import { httpMessages } from "@utils/HttpMessage";
import mongoose from "mongoose";
import { IFaqInput, IFaqUpdate } from "@typeInterface";

class FAQService {
  async createFAQ(faqData: IFaqInput): Promise<IFAQ> {
    const { question, answer, category } = faqData;

    if (!question || !answer) {
      throw httpMessages.BAD_REQUEST("Question and Answer are required.");
    }

    const faq = new FAQ({ question, answer, category });
    await faq.save();
    return faq;
  }

  // Get all FAQs
  async getFAQs(): Promise<IFAQ[]> {
    return await FAQ.find();
  }

  // Get a single FAQ by ID
  async getFAQById(faqId: string): Promise<IFAQ | null> {
    if (!mongoose.Types.ObjectId.isValid(faqId)) {
      throw httpMessages.BAD_REQUEST("Invalid FAQ ID format.");
    }

    const faq = await FAQ.findById(faqId);
    if (!faq) {
      throw httpMessages.NOT_FOUND("FAQ not found.");
    }

    return faq;
  }

  async updateFAQ(faqId: string, faqData: IFaqUpdate): Promise<IFAQ | null> {
    if (!mongoose.Types.ObjectId.isValid(faqId)) {
      throw httpMessages.BAD_REQUEST("Invalid FAQ ID format.");
    }

    const updatedFAQ = await FAQ.findByIdAndUpdate(faqId, faqData, {
      new: true,
    });

    if (!updatedFAQ) {
      throw httpMessages.NOT_FOUND("FAQ not found.");
    }

    return updatedFAQ;
  }

  async deleteFAQ(faqId: string): Promise<IFAQ | null> {
    if (!mongoose.Types.ObjectId.isValid(faqId)) {
      throw httpMessages.BAD_REQUEST("Invalid FAQ ID format.");
    }

    const deletedFAQ = await FAQ.findByIdAndDelete(faqId);

    if (!deletedFAQ) {
      throw httpMessages.NOT_FOUND("FAQ not found.");
    }

    return deletedFAQ;
  }
}

export const faqService = new FAQService();
