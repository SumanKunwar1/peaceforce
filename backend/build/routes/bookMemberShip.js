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
// Create a new membership with image & payment screenshot upload
router.post("/", multerConfig_1.default.fields([
    { name: "image", maxCount: 1 },
    { name: "paymentScreenshot", maxCount: 1 },
]), (0, _middleware_1.trackFilesForDeletion)([
    { fileField: "image" },
    { fileField: "paymentScreenshot" },
]), (0, _middleware_1.appendFile)([
    { fileField: "image", bodyField: "image", isArray: false },
    {
        fileField: "paymentScreenshot",
        bodyField: "paymentScreenshot",
        isArray: false,
    },
]), _middleware_1.validateBookMembership, _controllers_1.BookMembershipController.createBookMembership);
// Update a membership with new images if provided
router.patch("/:bookMembershipId", _middleware_1.isAuthenticated, multerConfig_1.default.fields([
    { name: "image", maxCount: 1 },
    { name: "paymentScreenshot", maxCount: 1 },
]), (0, _middleware_1.trackFilesForDeletion)([
    { fileField: "image" },
    { fileField: "paymentScreenshot" },
]), (0, _middleware_1.appendFile)([
    { fileField: "image", bodyField: "image", isArray: false },
    {
        fileField: "paymentScreenshot",
        bodyField: "paymentScreenshot",
        isArray: false,
    },
]), _middleware_1.validateBookMembershipUpdate, _controllers_1.BookMembershipController.updateBookMembership);
// Get all membership bookings
router.get("/", _middleware_1.isAuthenticated, _controllers_1.BookMembershipController.getBookMemberships);
// Get a single membership booking by ID
router.get("/:bookMembershipId", _middleware_1.isAuthenticated, _controllers_1.BookMembershipController.getBookMembershipById);
// Delete a membership booking
router.delete("/:bookMembershipId", _middleware_1.isAuthenticated, _controllers_1.BookMembershipController.deleteBookMembership);
exports.default = router;
