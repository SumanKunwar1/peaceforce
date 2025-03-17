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
exports.EnrollmentController = void 0;
const _services_1 = require("@services");
class EnrollmentController {
    static createEnrollment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const enrollmentData = req.body;
                const enrollment = yield _services_1.enrollmentService.createEnrollment(enrollmentData);
                res.locals.responseData = enrollment;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getEnrollments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const enrollments = yield _services_1.enrollmentService.getEnrollments();
                res.locals.responseData = { enrollments };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getEnrollmentById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { enrollmentId } = req.params;
                const enrollment = yield _services_1.enrollmentService.getEnrollmentById(enrollmentId);
                res.locals.responseData = { enrollment };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updateEnrollment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { enrollmentId } = req.params;
                const enrollmentData = req.body;
                const updatedEnrollment = yield _services_1.enrollmentService.updateEnrollment(enrollmentId, enrollmentData);
                res.locals.responseData = updatedEnrollment;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteEnrollment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { enrollmentId } = req.params;
                const deletedEnrollment = yield _services_1.enrollmentService.deleteEnrollment(enrollmentId);
                res.locals.responseData = deletedEnrollment;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.EnrollmentController = EnrollmentController;
