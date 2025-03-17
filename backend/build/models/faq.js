"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FAQ = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const FAQSchema = new mongoose_1.default.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: "General" },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeywords: { type: [String], default: [] },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
FAQSchema.virtual("id").get(function () {
    return this._id.toHexString();
});
exports.FAQ = mongoose_1.default.model("FAQ", FAQSchema);
