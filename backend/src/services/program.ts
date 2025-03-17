import { IProgramInput } from "../types";
import { Program, IProgram, BookProgram } from "../models";
import { deleteFile } from "../utils/deleteFile";
import { httpMessages } from "../utils/HttpMessage";
import { bookProgramService } from "../services"; // You can modify this import based on your actual logic

class ProgramService {
  async createProgram(programData: IProgramInput): Promise<IProgram> {
    try {
      const newProgram = new Program({
        ...programData,
      });

      await newProgram.save();
      return newProgram;
    } catch (error) {
      console.error("Error creating program:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async getPrograms(): Promise<IProgram[]> {
    try {
      const programs = await Program.find();

      return programs.map((program) => {
        const programObj = program.toObject();
        return {
          ...programObj,
          image: programObj.image
            ? `/api/image/${programObj.image}`
            : programObj.image,
          gallery: programObj.gallery
            ? programObj.gallery.map((file) => `/api/image/${file}`)
            : [],
        } as IProgram;
      });
    } catch (error) {
      console.error("Error fetching programs:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async getProgramById(id: string): Promise<IProgram | null> {
    try {
      const program = await Program.findById(id);
      if (!program) {
        throw httpMessages.USER_NOT_FOUND("Program");
      }

      const programObj = program.toObject();
      programObj.image = programObj.image
        ? `/api/image/${programObj.image}`
        : programObj.image;
      programObj.gallery = programObj.gallery
        ? programObj.gallery.map((file) => `/api/image/${file}`)
        : [];

      return programObj;
    } catch (error) {
      console.error("Error fetching program by ID:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async updateProgram(
    id: string,
    programData: IProgramInput
  ): Promise<IProgram | null> {
    try {
      const existingProgram = await Program.findById(id);
      if (!existingProgram) {
        throw httpMessages.USER_NOT_FOUND("Program");
      }

      if (programData.image) {
        if (programData.image === "") {
          if (existingProgram.image) {
            await deleteFile(existingProgram.image);
          }
          programData.image = ""; // Set empty string
        } else if (!programData.image.startsWith("/api/image/")) {
          // If it's a plain string (new image filename), delete the old one and update
          if (existingProgram.image) {
            await deleteFile(existingProgram.image);
          }
          // Here, the image is assumed to be already saved, so we just update it
          programData.image = programData.image;
        }
      }

      // Handle gallery updates
      if (programData.gallery !== undefined) {
        // If the gallery is an empty array, delete all the existing files
        if (programData.gallery.length === 0) {
          if (existingProgram.gallery) {
            for (const file of existingProgram.gallery) {
              await deleteFile(file);
            }
          }
          programData.gallery = []; // Set to empty array
        } else if (
          !programData.gallery.every((file) => file.startsWith("/api/image/"))
        ) {
          if (existingProgram.gallery) {
            for (const file of existingProgram.gallery) {
              await deleteFile(file);
            }
          }
          programData.gallery = programData.gallery; // Replace with the new gallery items (filenames)
        }
      }

      // Update the program and return the updated program
      const updatedProgram = await Program.findByIdAndUpdate(id, programData, {
        new: true,
      });

      if (!updatedProgram) {
        throw httpMessages.USER_NOT_FOUND("Program");
      }

      return updatedProgram;
    } catch (error) {
      console.error("Error updating program:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  // Delete a program
  async deleteProgram(id: string): Promise<string> {
    try {
      const programToDelete = await Program.findById(id);

      if (!programToDelete) {
        throw httpMessages.USER_NOT_FOUND("Program");
      }

      // Delete the program image
      if (programToDelete.image) {
        await deleteFile(programToDelete.image);
      }

      // Delete gallery images
      if (programToDelete.gallery && programToDelete.gallery.length !== 0) {
        for (const file of programToDelete.gallery) {
          await deleteFile(file);
        }
      }

      const bookingFormsToDelete = await BookProgram.find({ programId: id });

      if (bookingFormsToDelete.length > 0) {
        for (const bookingForm of bookingFormsToDelete) {
          await bookProgramService.deleteBookProgram(
            bookingForm._id.toString()
          );
        }
      }

      await Program.findByIdAndDelete(id);

      return `Program with ID ${id} and its corresponding bookings have been deleted`;
    } catch (error) {
      console.error("Error deleting program:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }
}

export const programService = new ProgramService();
