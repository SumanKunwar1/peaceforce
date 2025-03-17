"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Testimonial = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TestimonialSchema = new mongoose_1.default.Schema({
    quote: { type: String, default: "" },
    author: { type: String, default: "" },
    role: { type: String, default: "" },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
TestimonialSchema.virtual("id").get(function () {
    return this._id.toHexString();
});
exports.Testimonial = mongoose_1.default.model("Testimonial", TestimonialSchema);
