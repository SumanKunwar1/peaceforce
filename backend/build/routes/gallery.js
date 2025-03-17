"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _controllers_1 = require("@controllers");
const multerConfig_1 = __importDefault(require("@config/multerConfig"));
const _middleware_1 = require("@middleware");
const router = (0, express_1.Router)();
// Create a new gallery category name
router.post("/", _middleware_1.isAuthenticated, _controllers_1.GalleryController.createGalleryCategory);
//edit the category name
router.patch("/:categoryId", _middleware_1.isAuthenticated, _controllers_1.GalleryController.updateGalleryCategory);
//insert event to the category
router.patch("/event/:categoryId", _middleware_1.isAuthenticated, multerConfig_1.default.fields([{ name: "coverImage", maxCount: 1 }]), (0, _middleware_1.trackFilesForDeletion)([{ fileField: "coverImage" }]), (0, _middleware_1.parseJsonFields)(["events"]), (0, _middleware_1.appendFile)([
    { fileField: "coverImage", bodyField: "events.coverImage", isArray: false },
]), _middleware_1.validateGalleryEventInsert, _controllers_1.GalleryController.insertGalleryEvent);
//edit one event of the category
router.patch("/:categoryId/event/:eventId", _middleware_1.isAuthenticated, multerConfig_1.default.fields([{ name: "coverImage", maxCount: 1 }]), (0, _middleware_1.trackFilesForDeletion)([{ fileField: "coverImage" }]), (0, _middleware_1.parseJsonFields)(["events"]), (0, _middleware_1.appendFile)([
    { fileField: "coverImage", bodyField: "events.coverImage", isArray: false },
]), _middleware_1.validateGalleryEventInsert, _controllers_1.GalleryController.updateGalleryEvent);
//get all the gallery category
router.get("/", _controllers_1.GalleryController.getGalleryCategories);
//get all dta of specific category
router.get("/:categoryId", _controllers_1.GalleryController.getGalleryCategoryById);
router.get("/:categoryId/event/:eventId", _controllers_1.GalleryController.getEventById);
//delete entire category
router.delete("/:categoryId", _middleware_1.isAuthenticated, _controllers_1.GalleryController.deleteGalleryCategory);
//insert image to teh event
router.patch("/:categoryId/event/:eventId/images", _middleware_1.isAuthenticated, multerConfig_1.default.fields([{ name: "images", maxCount: 30 }]), (0, _middleware_1.trackFilesForDeletion)([{ fileField: "images" }]), (0, _middleware_1.appendFile)([{ fileField: "images", bodyField: "images", isArray: true }]), _controllers_1.GalleryController.insertEventImages);
// Delete images from an event
router.delete("/:categoryId/event/:eventId/images", _middleware_1.isAuthenticated, _controllers_1.GalleryController.deleteEventImage);
//delete entire event of a categroy
router.delete("/:categoryId/event/:eventId", _middleware_1.isAuthenticated, _controllers_1.GalleryController.deleteEvent);
exports.default = router;
