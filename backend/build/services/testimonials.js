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
exports.testimonialService = void 0;
const _models_1 = require("@models");
const HttpMessage_1 = require("@utils/HttpMessage");
class TestimonialService {
    // Get all testimonials
    getTestimonials() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield _models_1.Testimonial.find();
            }
            catch (error) {
                console.error("Error fetching testimonials:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    // Get a testimonial by ID
    getTestimonialById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const testimonial = yield _models_1.Testimonial.findById(id);
                if (!testimonial) {
                    throw HttpMessage_1.httpMessages.NOT_FOUND("Testimonial");
                }
                return testimonial;
            }
            catch (error) {
                console.error("Error fetching testimonial by ID:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    // Create a new testimonial
    createTestimonial(testimonialData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newTestimonial = new _models_1.Testimonial(testimonialData);
                return yield newTestimonial.save();
            }
            catch (error) {
                console.error("Error creating testimonial:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    // Update a testimonial
    updateTestimonial(id, testimonialData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedTestimonial = yield _models_1.Testimonial.findByIdAndUpdate(id, testimonialData, { new: true });
                if (!updatedTestimonial) {
                    throw HttpMessage_1.httpMessages.NOT_FOUND("Testimonial");
                }
                return updatedTestimonial;
            }
            catch (error) {
                console.error("Error updating testimonial:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    // Delete a testimonial
    deleteTestimonial(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedTestimonial = yield _models_1.Testimonial.findById(id);
                if (!deletedTestimonial) {
                    throw HttpMessage_1.httpMessages.NOT_FOUND("Testimonial");
                }
                yield _models_1.Testimonial.deleteOne({ _id: id });
                return deletedTestimonial;
            }
            catch (error) {
                console.error("Error deleting testimonial:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
}
exports.testimonialService = new TestimonialService();
