import { Testimonial, ITestimonial } from "@models";
import { httpMessages } from "@utils/HttpMessage";
import { ITestimonialInput } from "@typeInterface";

class TestimonialService {
  // Get all testimonials
  async getTestimonials(): Promise<ITestimonial[]> {
    try {
      return await Testimonial.find();
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  // Get a testimonial by ID
  async getTestimonialById(id: string): Promise<ITestimonial | null> {
    try {
      const testimonial = await Testimonial.findById(id);
      if (!testimonial) {
        throw httpMessages.NOT_FOUND("Testimonial");
      }
      return testimonial;
    } catch (error) {
      console.error("Error fetching testimonial by ID:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  // Create a new testimonial
  async createTestimonial(
    testimonialData: ITestimonialInput
  ): Promise<ITestimonial> {
    try {
      const newTestimonial = new Testimonial(testimonialData);
      return await newTestimonial.save();
    } catch (error) {
      console.error("Error creating testimonial:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  // Update a testimonial
  async updateTestimonial(
    id: string,
    testimonialData: ITestimonialInput
  ): Promise<ITestimonial | null> {
    try {
      const updatedTestimonial = await Testimonial.findByIdAndUpdate(
        id,
        testimonialData,
        { new: true }
      );
      if (!updatedTestimonial) {
        throw httpMessages.NOT_FOUND("Testimonial");
      }
      return updatedTestimonial;
    } catch (error) {
      console.error("Error updating testimonial:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  // Delete a testimonial
  async deleteTestimonial(id: string): Promise<ITestimonial | null> {
    try {
      const deletedTestimonial = await Testimonial.findById(id);
      if (!deletedTestimonial) {
        throw httpMessages.NOT_FOUND("Testimonial");
      }
      await Testimonial.deleteOne({ _id: id });
      return deletedTestimonial;
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }
}

export const testimonialService = new TestimonialService();
