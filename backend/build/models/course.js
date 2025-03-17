"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CourseSchema = new mongoose_1.default.Schema({
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    duration: { type: String, default: "" },
    language: { type: [String], default: [] },
    instructor: {
        name: { type: String, default: "" },
        title: { type: String, default: "" },
        bio: { type: String, default: "" },
        image: { type: String, default: "" },
    },
    highlights: { type: [String], default: [] },
    materials: { type: [String], default: [] },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeywords: { type: [String], default: [] },
    image: { type: String, default: "" },
});
// Virtual field to get `id`
CourseSchema.virtual("id").get(function () {
    return this._id.toHexString();
});
exports.Course = mongoose_1.default.model("Course", CourseSchema);
