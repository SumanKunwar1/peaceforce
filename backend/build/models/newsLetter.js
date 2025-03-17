"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsLetter = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const NewsLetterSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
// Virtual ID to return the ObjectId as a string
NewsLetterSchema.virtual("id").get(function () {
    return this._id.toHexString();
});
// Create the NewsLetter model
exports.NewsLetter = mongoose_1.default.model("NewsLetter", NewsLetterSchema);
