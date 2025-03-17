"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tour = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TourSchema = new mongoose_1.default.Schema({
    location: { type: String, default: "" },
    title: { type: String, default: "" },
    duration: { type: String, default: "" },
    days: { type: Number, default: 0 },
    image: { type: String, default: "" },
    startDate: { type: String, default: "" },
    status: {
        type: String,
        enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"],
        default: "Upcoming",
    },
    activities: { type: [String], default: [] },
    inclusions: { type: [String], default: [] },
    description: { type: String, default: "" },
    highlights: { type: [String], default: [] },
    itinerary: {
        type: [
            {
                day: { type: Number, default: 0 },
                description: { type: String, default: "" },
            },
        ],
        default: [],
    },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeywords: { type: [String], default: [] },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
TourSchema.virtual("id").get(function () {
    return this._id.toHexString();
});
exports.Tour = mongoose_1.default.model("Tour", TourSchema);
