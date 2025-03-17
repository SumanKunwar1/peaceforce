"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryCategory = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const GalleryEventSchema = new mongoose_1.default.Schema({
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    date: { type: Date, default: "" },
    coverImage: { type: String, default: "" },
    images: { type: [String], default: [] },
});
const GalleryCategorySchema = new mongoose_1.default.Schema({
    name: { type: String, default: "" },
    events: { type: [GalleryEventSchema], default: [] },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
GalleryCategorySchema.virtual("id").get(function () {
    return this._id.toHexString();
});
exports.GalleryCategory = mongoose_1.default.model("GalleryCategory", GalleryCategorySchema);
