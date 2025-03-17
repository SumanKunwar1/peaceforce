"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.programService = void 0;
const _models_1 = require("@models");
const deleteFile_1 = require("@utils/deleteFile");
const HttpMessage_1 = require("@utils/HttpMessage");
const _services_1 = require("@services"); // You can modify this import based on your actual logic
class ProgramService {
    createProgram(programData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newProgram = new _models_1.Program(Object.assign({}, programData));
                yield newProgram.save();
                return newProgram;
            }
            catch (error) {
                console.error("Error creating program:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    getPrograms() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const programs = yield _models_1.Program.find();
                return programs.map((program) => {
                    const programObj = program.toObject();
                    return Object.assign(Object.assign({}, programObj), { image: programObj.image
                            ? `/api/image/${programObj.image}`
                            : programObj.image, gallery: programObj.gallery
                            ? programObj.gallery.map((file) => `/api/image/${file}`)
                            : [] });
                });
            }
            catch (error) {
                console.error("Error fetching programs:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    getProgramById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const program = yield _models_1.Program.findById(id);
                if (!program) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Program");
                }
                const programObj = program.toObject();
                programObj.image = programObj.image
                    ? `/api/image/${programObj.image}`
                    : programObj.image;
                programObj.gallery = programObj.gallery
                    ? programObj.gallery.map((file) => `/api/image/${file}`)
                    : [];
                return programObj;
            }
            catch (error) {
                console.error("Error fetching program by ID:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    updateProgram(id, programData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingProgram = yield _models_1.Program.findById(id);
                if (!existingProgram) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Program");
                }
                if (programData.image) {
                    if (programData.image === "") {
                        if (existingProgram.image) {
                            yield (0, deleteFile_1.deleteFile)(existingProgram.image);
                        }
                        programData.image = ""; // Set empty string
                    }
                    else if (!programData.image.startsWith("/api/image/")) {
                        // If it's a plain string (new image filename), delete the old one and update
                        if (existingProgram.image) {
                            yield (0, deleteFile_1.deleteFile)(existingProgram.image);
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
                                yield (0, deleteFile_1.deleteFile)(file);
                            }
                        }
                        programData.gallery = []; // Set to empty array
                    }
                    else if (!programData.gallery.every((file) => file.startsWith("/api/image/"))) {
                        if (existingProgram.gallery) {
                            for (const file of existingProgram.gallery) {
                                yield (0, deleteFile_1.deleteFile)(file);
                            }
                        }
                        programData.gallery = programData.gallery; // Replace with the new gallery items (filenames)
                    }
                }
                // Update the program and return the updated program
                const updatedProgram = yield _models_1.Program.findByIdAndUpdate(id, programData, {
                    new: true,
                });
                if (!updatedProgram) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Program");
                }
                return updatedProgram;
            }
            catch (error) {
                console.error("Error updating program:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    // Delete a program
    deleteProgram(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const programToDelete = yield _models_1.Program.findById(id);
                if (!programToDelete) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Program");
                }
                // Delete the program image
                if (programToDelete.image) {
                    yield (0, deleteFile_1.deleteFile)(programToDelete.image);
                }
                // Delete gallery images
                if (programToDelete.gallery && programToDelete.gallery.length !== 0) {
                    for (const file of programToDelete.gallery) {
                        yield (0, deleteFile_1.deleteFile)(file);
                    }
                }
                const bookingFormsToDelete = yield _models_1.BookProgram.find({ programId: id });
                if (bookingFormsToDelete.length > 0) {
                    for (const bookingForm of bookingFormsToDelete) {
                        yield _services_1.bookProgramService.deleteBookProgram(bookingForm._id.toString());
                    }
                }
                yield _models_1.Program.findByIdAndDelete(id);
                return `Program with ID ${id} and its corresponding bookings have been deleted`;
            }
            catch (error) {
                console.error("Error deleting program:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
}
exports.programService = new ProgramService();
