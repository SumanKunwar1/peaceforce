"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeoMeta = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const SeoMetaSchema = new mongoose_1.default.Schema({
    pageTitle: { type: String, required: true, unique: true }, // This could be 'About Us', 'Blog Post', etc.
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeywords: { type: [String], default: [] },
    canonicalUrl: { type: String, default: "" },
    robotsMeta: { type: String, default: "index, follow" },
    ogTitle: { type: String, default: "" },
    ogDescription: { type: String, default: "" },
    ogImage: { type: String, default: "" },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
SeoMetaSchema.virtual("id").get(function () {
    return this._id.toHexString();
});
exports.SeoMeta = mongoose_1.default.model("SeoMeta", SeoMetaSchema);
