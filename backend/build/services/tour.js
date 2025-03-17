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
exports.tourService = void 0;
const _models_1 = require("@models");
const HttpMessage_1 = require("@utils/HttpMessage");
const deleteFile_1 = require("@utils/deleteFile");
const bookingForm_1 = require("./bookingForm");
class TourService {
    createTour(tourData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newTour = new _models_1.Tour(Object.assign({}, tourData));
                yield newTour.save();
                return newTour;
            }
            catch (error) {
                console.error("Error creating tour:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    getTours() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tours = yield _models_1.Tour.find();
                return tours.map((tour) => {
                    const tourObj = tour.toObject();
                    return Object.assign(Object.assign({}, tourObj), { image: tourObj.image ? `/api/image/${tourObj.image}` : tourObj.image });
                });
            }
            catch (error) {
                console.error("Error fetching tours:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    getTourById(tourId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tour = yield _models_1.Tour.findById(tourId);
                if (!tour) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Tour");
                }
                const tourObj = tour.toObject();
                if (tourObj.image) {
                    tourObj.image = `/api/image/${tourObj.image}`;
                }
                return tourObj;
            }
            catch (error) {
                console.error("Error fetching tour by ID:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    updateTour(tourId, tourData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingTour = yield _models_1.Tour.findById(tourId);
                if (!existingTour) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Tour");
                }
                // Handle image field
                if (tourData.image) {
                    console.log("Processing image field...");
                    if (tourData.image === "") {
                        console.log("Image field is empty. Deleting existing image if present...");
                        if (existingTour.image) {
                            console.log(`Deleting existing image: ${existingTour.image}`);
                            yield (0, deleteFile_1.deleteFile)(existingTour.image);
                        }
                        tourData.image = ""; // Set empty string
                        console.log("Image has been cleared. New image is set to an empty string.");
                    }
                    else if (!tourData.image.startsWith("/api/image/")) {
                        console.log("Image URL seems to be a new file path, updating image...");
                        if (existingTour.image) {
                            console.log(`Deleting old image: ${existingTour.image}`);
                            yield (0, deleteFile_1.deleteFile)(existingTour.image);
                        }
                        // Save new image filename (assuming it's already saved somewhere)
                        console.log(`New image file: ${tourData.image}`);
                        tourData.image = tourData.image;
                    }
                }
                // Update the tour in the database
                const updatedTour = yield _models_1.Tour.findByIdAndUpdate(tourId, tourData, {
                    new: true,
                });
                if (!updatedTour) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Tour");
                }
                return updatedTour;
            }
            catch (error) {
                console.error("Error updating tour:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    deleteTour(tourId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tourToDelete = yield _models_1.Tour.findById(tourId);
                if (!tourToDelete) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Tour");
                }
                // Delete image file if it exists
                if (tourToDelete.image) {
                    yield (0, deleteFile_1.deleteFile)(tourToDelete.image);
                }
                const tourBookingToDelete = yield _models_1.BookingForm.find({
                    tourId: tourToDelete._id,
                });
                if (tourBookingToDelete.length > 0) {
                    for (const bookingForm of tourBookingToDelete) {
                        yield bookingForm_1.bookingFormService.deleteBookingForm(bookingForm._id.toString());
                    }
                }
                // Delete the tour itself
                yield _models_1.Tour.findByIdAndDelete(tourId);
                return tourToDelete;
            }
            catch (error) {
                console.error("Error deleting tour:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
}
exports.tourService = new TourService();
