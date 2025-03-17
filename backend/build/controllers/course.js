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
exports.CourseController = void 0;
const _services_1 = require("@services"); // This should be the updated import
class CourseController {
    // Create a new course category
    static createCourseCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseCategoryData = req.body;
                const courseCategory = yield _services_1.courseCategoryService.createCourseCategory(courseCategoryData);
                res.locals.responseData = courseCategory;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Get all course categories
    static getCourseCategories(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseCategories = yield _services_1.courseCategoryService.getCourseCategories();
                res.locals.responseData = { courseCategories };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Get a course category by ID
    static getCourseCategoryById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.params; // Assuming categoryId is the parameter
                const courseCategory = yield _services_1.courseCategoryService.getCourseById(categoryId);
                res.locals.responseData = { courseCategory };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Update an existing course category
    static updateCourseCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.params; // Assuming categoryId is the parameter
                const courseCategoryData = req.body;
                const updatedCourseCategory = yield _services_1.courseCategoryService.updateCourseCategory(categoryId, courseCategoryData);
                res.locals.responseData = updatedCourseCategory;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Delete a course category
    static deleteCourseCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.params; // Assuming categoryId is the parameter
                const deletedCourseCategory = yield _services_1.courseCategoryService.deleteCourseCategory(categoryId);
                res.locals.responseData = deletedCourseCategory;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.CourseController = CourseController;
