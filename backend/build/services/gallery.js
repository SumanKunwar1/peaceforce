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
exports.galleryCategoryService = void 0;
const _models_1 = require("@models");
const deleteFile_1 = require("@utils/deleteFile");
const HttpMessage_1 = require("@utils/HttpMessage");
class GalleryCategoryService {
    createGalleryCategory(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newGalleryCategory = new _models_1.GalleryCategory({
                    name,
                });
                yield newGalleryCategory.save();
                return newGalleryCategory;
            }
            catch (error) {
                console.error("Error creating gallery category:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    updateGalleryCategory(categoryId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newGalleryCategory = yield _models_1.GalleryCategory.findById(categoryId);
                if (!newGalleryCategory) {
                    throw HttpMessage_1.httpMessages.NOT_FOUND("Gallery Category ");
                }
                newGalleryCategory.name = name;
                yield newGalleryCategory.save();
                return newGalleryCategory;
            }
            catch (error) {
                console.error("Error updating gallery category:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    insertEventImages(eventId, categoryId, images) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingCategory = yield _models_1.GalleryCategory.findById(categoryId);
            if (!existingCategory) {
                throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Gallery category");
            }
            const event = existingCategory.events.find((e) => e.id === eventId);
            if (!event) {
                throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Gallery event");
            }
            event.images.push(...images);
            yield existingCategory.save();
            return `Successfully added ${images.length} images to event ${eventId}.`;
        });
    }
    getGalleryCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield _models_1.GalleryCategory.find();
                return categories.map((category) => {
                    const categoryObj = category.toObject();
                    return Object.assign(Object.assign({}, categoryObj), { events: (categoryObj.events || []).map((event) => (Object.assign(Object.assign({}, event), { coverImage: (event === null || event === void 0 ? void 0 : event.coverImage)
                                ? `/api/image/${event.coverImage}`
                                : "/placeholder.svg", images: ((event === null || event === void 0 ? void 0 : event.images) || []).map((image) => `/api/image/${image}`) }))) });
                });
            }
            catch (error) {
                console.error("Error fetching gallery categories:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    getGalleryCategoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield _models_1.GalleryCategory.findById(id);
                if (!category) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Gallery category");
                }
                const categoryObj = category.toObject();
                categoryObj.events = (categoryObj.events || []).map((event) => (Object.assign(Object.assign({}, event), { coverImage: (event === null || event === void 0 ? void 0 : event.coverImage)
                        ? `/api/image/${event.coverImage}`
                        : "/placeholder.svg", images: ((event === null || event === void 0 ? void 0 : event.images) || []).map((image) => `/api/image/${image}`) })));
                return categoryObj;
            }
            catch (error) {
                console.error("Error fetching gallery category by ID:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    getEventById(categoryId, eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield _models_1.GalleryCategory.findById(categoryId);
                if (!category) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Gallery category");
                }
                const event = category.events.find((event) => event._id.toString() === eventId);
                if (!event) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Event not found");
                }
                const eventObj = event.toObject();
                eventObj.coverImage = (event === null || event === void 0 ? void 0 : event.coverImage)
                    ? `/api/image/${event.coverImage}`
                    : "";
                eventObj.images = ((event === null || event === void 0 ? void 0 : event.images) || []).map((image) => `/api/image/${image}`);
                return eventObj;
            }
            catch (error) {
                console.error("Error fetching event by ID:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    insertGalleryEvent(categoryId, galleryCategoryData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Step 1: Find the existing category by ID
                const existingCategory = yield _models_1.GalleryCategory.findById(categoryId);
                if (!existingCategory) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Gallery category");
                }
                console.log("initially", existingCategory);
                // Step 2: Extract the event object from the provided data
                const { events } = galleryCategoryData;
                // Step 3: Push the event object into the events array
                existingCategory.events.push(events); // Just push the object directly
                console.log("updated but not saved", existingCategory);
                // Step 4: Save the updated category to the database
                const updatedCategory = yield existingCategory.save();
                console.log("updated and saved", updatedCategory);
                return updatedCategory;
            }
            catch (error) {
                console.error("Error updating gallery category:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    updateGalleryEvent(categoryId, eventId, galleryCategoryData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield _models_1.GalleryCategory.findById(categoryId);
                if (!category) {
                    throw new Error("Category not found");
                }
                const event = category.events.find((event) => event._id.toString() === eventId);
                if (!event) {
                    throw new Error("Event not found");
                }
                const { events } = galleryCategoryData;
                const { coverImage } = events;
                // Handle the coverImage logic
                if (coverImage) {
                    if (coverImage === "") {
                        // If the coverImage is set to an empty string, delete the existing one
                        if (event.coverImage) {
                            yield (0, deleteFile_1.deleteFile)(event.coverImage);
                        }
                        event.coverImage = ""; // Remove the coverImage
                    }
                    else if (!coverImage.startsWith("/api/image/")) {
                        if (event.coverImage) {
                            yield (0, deleteFile_1.deleteFile)(event.coverImage);
                        }
                        event.coverImage = coverImage; // Update with the new coverImage
                    }
                }
                if (events.title)
                    event.title = events.title;
                if (events.description)
                    event.description = events.description;
                if (events.date)
                    event.date = events.date;
                // Save the updated category with the modified event
                yield category.save();
                return category; // Return the updated category (or the event, depending on your needs)
            }
            catch (error) {
                throw error; // Handle errors (e.g., category not found, event not found, etc.)
            }
        });
    }
    deleteGalleryCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryToDelete = yield _models_1.GalleryCategory.findById(id);
                if (!categoryToDelete) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Gallery category");
                }
                for (const event of categoryToDelete.events) {
                    if (event.coverImage) {
                        yield (0, deleteFile_1.deleteFile)(event.coverImage);
                    }
                    for (const image of event.images) {
                        yield (0, deleteFile_1.deleteFile)(image);
                    }
                }
                yield _models_1.GalleryCategory.findByIdAndDelete(id);
                return `Gallery category with ID ${id} has been deleted`;
            }
            catch (error) {
                console.error("Error deleting gallery category:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    deleteEventImage(eventId, categoryId, images) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const formatImageArray = images.map((image) => image.replace("/api/image/", ""));
                const category = yield _models_1.GalleryCategory.findById(categoryId);
                if (!category) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Gallery category");
                }
                const event = category.events.find((event) => event.id === eventId);
                if (!event) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Gallery event");
                }
                const deletedFiles = [];
                const notFoundFiles = [];
                for (const image of formatImageArray) {
                    const imageIndex = event.images.findIndex((img) => img === image);
                    if (imageIndex === -1) {
                        notFoundFiles.push(image);
                    }
                    else {
                        try {
                            yield (0, deleteFile_1.deleteFile)(image);
                            event.images.splice(imageIndex, 1);
                            deletedFiles.push(image);
                        }
                        catch (error) {
                            notFoundFiles.push(image);
                        }
                    }
                }
                yield category.save();
                return {
                    message: "File deletion process completed.",
                    deletedFilesCount: deletedFiles.length,
                    notFoundFilesCount: notFoundFiles.length,
                    deletedFiles,
                    notFoundFiles,
                };
            }
            catch (error) {
                console.error("Error deleting event image:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    deleteEvent(eventId, categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield _models_1.GalleryCategory.findById(categoryId);
                if (!category) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Gallery category");
                }
                const eventIndex = category.events.findIndex((event) => event._id.toString() === eventId);
                if (eventIndex === -1) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Gallery event");
                }
                // Get the event for deletion
                const event = category.events[eventIndex];
                if (event.coverImage) {
                    yield (0, deleteFile_1.deleteFile)(event.coverImage);
                }
                for (const image of event.images) {
                    yield (0, deleteFile_1.deleteFile)(image);
                }
                category.events.splice(eventIndex, 1);
                yield category.save();
                return "Event deletion process completed.";
            }
            catch (error) {
                console.error("Error deleting event image:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
}
exports.galleryCategoryService = new GalleryCategoryService();
