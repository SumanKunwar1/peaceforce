"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Page = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PageSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    location: {
        type: String,
        enum: ["header", "footer"],
        required: true,
    },
    parentPage: {
        type: String,
        required: false,
    },
    content: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["draft", "published"],
        deafult: "draft",
    },
    metaTitle: {
        type: String,
        required: false,
    },
    metaKeywords: {
        type: String,
        required: false,
    },
    metaDescription: {
        type: String,
        required: false,
    },
}, { timestamps: true, toJson: { virtuals: true }, toObject: { virtuals: true } });
PageSchema.virtual("id").get(function () {
    return this._id.toHexString();
});
PageSchema.virtual("lastUpdated").get(function () {
    return this.updatedAt.toDateString;
});
exports.Page = mongoose_1.default.model("Page", PageSchema);
