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
exports.GalleryController = void 0;
const _services_1 = require("@services");
const HttpMessage_1 = require("@utils/HttpMessage");
class GalleryController {
    // Create a new gallery category
    static createGalleryCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.body;
                if (!name && typeof name === "string") {
                    next(HttpMessage_1.httpMessages.BAD_REQUEST("validation Error: name is required or must be string "));
                }
                const galleryCategory = yield _services_1.galleryCategoryService.createGalleryCategory(name);
                res.locals.responseData = galleryCategory;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updateGalleryCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.params;
                const { name } = req.body;
                if (!name && typeof name === "string") {
                    next(HttpMessage_1.httpMessages.BAD_REQUEST("validation Error: name is required or must be string "));
                }
                const galleryCategory = yield _services_1.galleryCategoryService.updateGalleryCategory(categoryId, name);
                res.locals.responseData = galleryCategory;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Get all gallery categories
    static getGalleryCategories(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const galleryCategories = yield _services_1.galleryCategoryService.getGalleryCategories();
                res.locals.responseData = { galleryCategories };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Get a gallery category by ID
    static getGalleryCategoryById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.params;
                const galleryCategory = yield _services_1.galleryCategoryService.getGalleryCategoryById(categoryId);
                res.locals.responseData = { galleryCategory };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Update a gallery category
    static insertGalleryEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.params;
                const galleryCategoryData = req.body;
                const updatedGalleryCategory = yield _services_1.galleryCategoryService.insertGalleryEvent(categoryId, galleryCategoryData);
                res.locals.responseData = updatedGalleryCategory;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updateGalleryEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId, eventId } = req.params;
                const galleryCategoryData = req.body;
                const updatedGalleryCategory = yield _services_1.galleryCategoryService.updateGalleryEvent(categoryId, eventId, galleryCategoryData);
                res.locals.responseData = updatedGalleryCategory;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Delete a gallery category
    static deleteGalleryCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.params;
                const deletedGalleryCategory = yield _services_1.galleryCategoryService.deleteGalleryCategory(categoryId);
                res.locals.responseData = deletedGalleryCategory;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Insert images into an event
    static insertEventImages(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId, eventId } = req.params;
                const { images } = req.body;
                if (!images) {
                    throw HttpMessage_1.httpMessages.BAD_REQUEST("validation error: images is required");
                }
                if (!Array.isArray(images)) {
                    throw new Error("Images must be an array.");
                }
                const response = yield _services_1.galleryCategoryService.insertEventImages(eventId, categoryId, images);
                res.locals.responseData = response;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getEventById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId, eventId } = req.params;
                const response = yield _services_1.galleryCategoryService.getEventById(categoryId, eventId);
                res.locals.responseData = response;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Delete images from an event
    static deleteEventImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId, eventId } = req.params;
                const { images } = req.body;
                if (!Array.isArray(images)) {
                    throw new Error("Images must be an array.");
                }
                const response = yield _services_1.galleryCategoryService.deleteEventImage(eventId, categoryId, images);
                res.locals.responseData = response;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId, eventId } = req.params;
                const response = yield _services_1.galleryCategoryService.deleteEvent(eventId, categoryId);
                res.locals.responseData = response;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.GalleryController = GalleryController;
