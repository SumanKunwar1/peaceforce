"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Program = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ProgramSchema = new mongoose_1.default.Schema({
    title: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    fullDescription: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    time: { type: String, default: "" },
    venue: { type: String, default: "" },
    location: { type: String, default: "" },
    capacity: { type: Number, default: 0 },
    instructor: { type: String, default: "" },
    schedule: { type: String, default: "" },
    requirements: { type: [String], default: [] },
    image: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    programGoals: { type: [String], default: [] },
    ticketTypes: { type: String, default: "" },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeywords: { type: [String], default: [] },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
ProgramSchema.virtual("id").get(function () {
    return this._id.toHexString();
});
exports.Program = mongoose_1.default.model("Program", ProgramSchema);
