import { NewsLetter, INewsLetter } from "@models";
import mongoose from "mongoose";

class NewsLetterService {
  async createNewsLetter(email: string): Promise<INewsLetter> {
    const newsLetter = new NewsLetter({
      email,
    });

    await newsLetter.save();

    return newsLetter;
  }

  async getNewsLetters(): Promise<INewsLetter[]> {
    return await NewsLetter.find();
  }

  async getNewsLetterById(newsLetterId: string): Promise<INewsLetter | null> {
    if (!mongoose.Types.ObjectId.isValid(newsLetterId)) {
      throw new Error("Invalid newsLetterId format.");
    }

    const newsLetter = await NewsLetter.findById(newsLetterId);
    if (!newsLetter) {
      throw new Error("NewsLetter not found.");
    }

    return newsLetter;
  }

  async deleteNewsLetter(newsLetterId: string): Promise<INewsLetter | null> {
    if (!mongoose.Types.ObjectId.isValid(newsLetterId)) {
      throw new Error("Invalid newsLetterId format.");
    }

    const newsLetterToDelete = await NewsLetter.findById(newsLetterId);

    if (!newsLetterToDelete) {
      throw new Error("NewsLetter not found.");
    }

    const deletedNewsLetter = await NewsLetter.findByIdAndDelete(newsLetterId);

    if (!deletedNewsLetter) {
      throw new Error("NewsLetter not found.");
    }

    return deletedNewsLetter;
  }
}

export const newsLetterService = new NewsLetterService();
