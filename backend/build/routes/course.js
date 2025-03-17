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
router.post("/", _middleware_1.isAuthenticated, multerConfig_1.default.fields([
    { name: "image", maxCount: 1 },
    { name: "instructorImage", maxCount: 10 },
]), (0, _middleware_1.trackFilesForDeletion)([
    { fileField: "image" },
    { fileField: "instructorImage" },
]), (0, _middleware_1.parseJsonFields)([
    "metaKeywords",
    "instructor",
    "language",
    "highlights",
    "materials",
]), (0, _middleware_1.appendFile)([
    { fileField: "image", bodyField: "image", isArray: false },
    {
        fileField: "instructorImage",
        bodyField: "instructor.image",
        isArray: false,
    },
]), _middleware_1.validateCourseCategory, _controllers_1.CourseController.createCourseCategory);
// Update an existing course category
router.patch("/:categoryId", _middleware_1.isAuthenticated, multerConfig_1.default.fields([
    { name: "image", maxCount: 1 },
    { name: "instructorImage", maxCount: 10 },
]), (0, _middleware_1.trackFilesForDeletion)([
    { fileField: "image" },
    { fileField: "instructorImage" },
]), (0, _middleware_1.parseJsonFields)([
    "metaKeywords",
    "instructor",
    "language",
    "highlights",
    "materials",
]), (0, _middleware_1.appendFile)([
    { fileField: "image", bodyField: "image", isArray: false },
    {
        fileField: "instructorImage",
        bodyField: "instructor.image",
        isArray: false,
    },
]), _middleware_1.validateCourseCategory, _controllers_1.CourseController.updateCourseCategory);
router.get("/", _controllers_1.CourseController.getCourseCategories);
router.get("/:categoryId", _controllers_1.CourseController.getCourseCategoryById);
router.delete("/:categoryId", _middleware_1.isAuthenticated, _controllers_1.CourseController.deleteCourseCategory);
exports.default = router;
