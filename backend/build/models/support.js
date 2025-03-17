"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Support = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const SupportSchema = new mongoose_1.default.Schema({
    hero: {
        title: { type: String },
        subtitle: { type: String },
        image: { type: String, default: "" },
    },
    impacts: [
        {
            icon: { type: String },
            number: { type: String },
            title: { type: String },
            description: { type: String },
        },
    ],
    waysToSupport: [
        {
            icon: { type: String },
            title: { type: String },
            description: { type: String },
            fullDescription: { type: String },
            benefits: { type: [String], default: [] },
        },
    ],
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
SupportSchema.virtual("id").get(function () {
    return this._id.toHexString();
});
exports.Support = mongoose_1.default.model("Support", SupportSchema);
