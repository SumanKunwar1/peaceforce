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
// Create a new event
router.post("/", _middleware_1.isAuthenticated, multerConfig_1.default.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
]), (0, _middleware_1.trackFilesForDeletion)([{ fileField: "image" }, { fileField: "gallery" }]), (0, _middleware_1.parseJsonFields)(["ticketTypes", "metaKeywords"]), (0, _middleware_1.appendFile)([
    { fileField: "image", bodyField: "image", isArray: false },
    { fileField: "gallery", bodyField: "gallery", isArray: true },
]), _middleware_1.validateEvent, _controllers_1.EventController.createEvent);
// Update an existing event
router.patch("/:eventId", _middleware_1.isAuthenticated, multerConfig_1.default.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
]), (0, _middleware_1.trackFilesForDeletion)([{ fileField: "image" }, { fileField: "gallery" }]), (0, _middleware_1.parseJsonFields)(["ticketTypes", "metaKeywords"]), (0, _middleware_1.appendFile)([
    { fileField: "image", bodyField: "image", isArray: false },
    { fileField: "gallery", bodyField: "gallery", isArray: true }, // Assuming we update gallery too
]), (0, _middleware_1.parseJsonFields)(["gallery"]), _middleware_1.validateEvent, _controllers_1.EventController.updateEvent);
// Get all events
router.get("/", _controllers_1.EventController.getEvents);
// Get a specific event by ID
router.get("/:eventId", _controllers_1.EventController.getEventById);
// Delete an event
router.delete("/:eventId", _middleware_1.isAuthenticated, _controllers_1.EventController.deleteEvent);
exports.default = router;
