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
exports.TestimonialController = void 0;
const _services_1 = require("@services");
class TestimonialController {
    // Get all testimonials
    static getTestimonials(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const testimonials = yield _services_1.testimonialService.getTestimonials();
                res.locals.responseData = testimonials;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Get testimonial by ID
    static getTestimonialById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const testimonial = yield _services_1.testimonialService.getTestimonialById(id);
                res.locals.responseData = testimonial;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Create a testimonial
    static createTestimonial(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const testimonialData = req.body;
                const createdTestimonial = yield _services_1.testimonialService.createTestimonial(testimonialData);
                res.locals.responseData = createdTestimonial;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Update a testimonial
    static updateTestimonial(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const testimonialData = req.body;
                const updatedTestimonial = yield _services_1.testimonialService.updateTestimonial(id, testimonialData);
                res.locals.responseData = updatedTestimonial;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Delete a testimonial
    static deleteTestimonial(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deletedTestimonial = yield _services_1.testimonialService.deleteTestimonial(id);
                res.locals.responseData = deletedTestimonial;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.TestimonialController = TestimonialController;
