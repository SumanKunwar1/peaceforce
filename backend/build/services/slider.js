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
exports.sliderService = void 0;
const _models_1 = require("@models"); // Assuming you have a Slider model
const deleteFile_1 = require("@utils/deleteFile"); // Assuming you have a utility function for deleting files
const HttpMessage_1 = require("@utils/HttpMessage"); // Custom error handling utility
class SliderService {
    // Create a new slider
    createSlider(sliderData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newSlider = new _models_1.Slider(Object.assign({}, sliderData));
                yield newSlider.save();
                return newSlider;
            }
            catch (error) {
                console.error("Error creating slider:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    // Get all sliders
    getSliders() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sliders = yield _models_1.Slider.find();
                return sliders.map((slider) => {
                    const sliderObj = slider.toObject();
                    sliderObj.image = sliderObj.image
                        ? `/api/image/${sliderObj.image}`
                        : sliderObj.image;
                    return sliderObj;
                });
            }
            catch (error) {
                console.error("Error fetching sliders:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    // Get a slider by ID
    getSliderById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const slider = yield _models_1.Slider.findById(id);
                if (!slider) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Slider");
                }
                const sliderObj = slider.toObject();
                sliderObj.image = sliderObj.image
                    ? `/api/image/${sliderObj.image}`
                    : sliderObj.image;
                return sliderObj;
            }
            catch (error) {
                console.error("Error fetching slider by ID:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    // Update an existing slider
    updateSlider(id, sliderData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingSlider = yield _models_1.Slider.findById(id);
                if (!existingSlider) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Slider");
                }
                // If an image is provided, handle it like in the ProgramService
                if (sliderData.image) {
                    if (sliderData.image === "") {
                        if (existingSlider.image) {
                            yield (0, deleteFile_1.deleteFile)(existingSlider.image);
                        }
                        sliderData.image = ""; // Set empty string to remove image
                    }
                    else if (!sliderData.image.startsWith("/api/image/")) {
                        // If it's a new image (not starting with /api/image/), delete the old one
                        if (existingSlider.image) {
                            yield (0, deleteFile_1.deleteFile)(existingSlider.image);
                        }
                        sliderData.image = sliderData.image; // Update image
                    }
                }
                // Update the slider and return the updated slider
                const updatedSlider = yield _models_1.Slider.findByIdAndUpdate(id, sliderData, {
                    new: true,
                });
                if (!updatedSlider) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Slider");
                }
                return updatedSlider;
            }
            catch (error) {
                console.error("Error updating slider:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    // Delete a slider
    deleteSlider(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sliderToDelete = yield _models_1.Slider.findById(id);
                if (!sliderToDelete) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Slider");
                }
                // Delete the slider image
                if (sliderToDelete.image) {
                    yield (0, deleteFile_1.deleteFile)(sliderToDelete.image);
                }
                yield _models_1.Slider.findByIdAndDelete(id);
                return `Slider with ID ${id} has been deleted`;
            }
            catch (error) {
                console.error("Error deleting slider:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    // Change the visibility of a slider
    updateSliderVisibility(id, isVisible) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedSlider = yield _models_1.Slider.findByIdAndUpdate(id, { isVisible }, { new: true });
                if (!updatedSlider) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Slider");
                }
                return updatedSlider;
            }
            catch (error) {
                console.error("Error updating slider visibility:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
}
exports.sliderService = new SliderService();
