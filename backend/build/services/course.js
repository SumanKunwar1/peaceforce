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
exports.courseCategoryService = void 0;
const _models_1 = require("@models");
const deleteFile_1 = require("@utils/deleteFile");
const HttpMessage_1 = require("@utils/HttpMessage");
const _services_1 = require("@services");
class CourseCategoryService {
    // Create a new course category
    createCourseCategory(courseCategoryData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Directly create new category without saving images
                const newCourseCategory = new _models_1.Course(Object.assign({}, courseCategoryData));
                yield newCourseCategory.save();
                return newCourseCategory;
            }
            catch (error) {
                console.error("Error creating course category:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    // Get all course categories
    getCourseCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield _models_1.Course.find();
                return courses.map((course) => {
                    var _a;
                    const courseObj = course.toObject();
                    return Object.assign(Object.assign({}, courseObj), { image: courseObj.image
                            ? `/api/image/${courseObj.image}`
                            : courseObj.image, instructor: Object.assign(Object.assign({}, courseObj.instructor), { image: ((_a = courseObj.instructor) === null || _a === void 0 ? void 0 : _a.image)
                                ? `/api/image/${courseObj.instructor.image}`
                                : courseObj.instructor.image }) });
                });
            }
            catch (error) {
                console.error("Error fetching courses:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    getCourseById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const course = yield _models_1.Course.findById(id);
                if (!course) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Course");
                }
                const courseObj = course.toObject();
                return Object.assign(Object.assign({}, courseObj), { image: courseObj.image
                        ? `/api/image/${courseObj.image}`
                        : courseObj.image, instructor: Object.assign(Object.assign({}, courseObj.instructor), { image: ((_a = courseObj.instructor) === null || _a === void 0 ? void 0 : _a.image)
                            ? `/api/image/${courseObj.instructor.image}`
                            : courseObj.instructor.image }) });
            }
            catch (error) {
                console.error("Error fetching course by ID:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    // Update an existing course category
    //todo: check the way the data is sent from teh frontend for the update for courses and update the logic for the course updates opr replacement and enrollement form deletion
    updateCourseCategory(id, courseData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const existingCourse = yield _models_1.Course.findById(id);
                if (!existingCourse) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Course");
                }
                if (courseData.image !== undefined) {
                    if (courseData.image === "" && existingCourse.image) {
                        yield (0, deleteFile_1.deleteFile)(existingCourse.image);
                        courseData.image = "";
                    }
                    else if (!courseData.image.startsWith("/api/image/")) {
                        if (existingCourse.image) {
                            yield (0, deleteFile_1.deleteFile)(existingCourse.image);
                        }
                    }
                }
                if (((_a = courseData.instructor) === null || _a === void 0 ? void 0 : _a.image) !== undefined) {
                    if (courseData.instructor.image === "" &&
                        existingCourse.instructor.image) {
                        yield (0, deleteFile_1.deleteFile)(existingCourse.instructor.image);
                        courseData.instructor.image = "";
                    }
                    else if (!courseData.instructor.image.startsWith("/api/image/")) {
                        if (existingCourse.instructor.image) {
                            yield (0, deleteFile_1.deleteFile)(existingCourse.instructor.image);
                        }
                    }
                }
                const updatedCourse = yield _models_1.Course.findByIdAndUpdate(id, courseData, {
                    new: true,
                });
                if (!updatedCourse) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Course");
                }
                return updatedCourse;
            }
            catch (error) {
                console.error("Error updating course:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    // Delete a course category
    deleteCourseCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const courseToDelete = yield _models_1.Course.findById(id);
                if (!courseToDelete) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Course category");
                }
                if (courseToDelete.image) {
                    yield (0, deleteFile_1.deleteFile)(courseToDelete.image);
                }
                if ((_a = courseToDelete.instructor) === null || _a === void 0 ? void 0 : _a.image) {
                    yield (0, deleteFile_1.deleteFile)(courseToDelete.instructor.image);
                }
                // Delete the course category
                yield _models_1.Course.findByIdAndDelete(id);
                const enrollments = yield _models_1.EnrollmentForm.find({
                    courseId: { $in: courseToDelete._id },
                });
                for (const enrollment of enrollments) {
                    yield _services_1.enrollmentService.deleteEnrollment(enrollment._id.toString());
                }
                return `Course category with ID ${id} has been deleted`;
            }
            catch (error) {
                console.error("Error deleting course category:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
}
exports.courseCategoryService = new CourseCategoryService();
