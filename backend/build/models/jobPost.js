"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobPost = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const JobPostSchema = new mongoose_1.default.Schema({
    title: { type: String, default: "" },
    department: { type: String, default: "" },
    location: { type: String, default: "" },
    type: {
        type: String,
        enum: ["Full-time", "Part-time", "Contract"],
        default: "Full-time",
    },
    description: { type: String, default: "" },
    requirements: { type: [String], default: [] },
    responsibilities: { type: [String], default: [] },
    benefits: { type: [String], default: [] },
    postedDate: { type: String, default: Date.now() },
    deadline: { type: String, default: "" },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeywords: { type: [String], default: [] },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
// Virtual fields
JobPostSchema.virtual("id").get(function () {
    return this._id.toHexString();
});
exports.JobPost = mongoose_1.default.model("JobPost", JobPostSchema);
