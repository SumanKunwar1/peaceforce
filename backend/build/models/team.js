"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TeamSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        deafult: "",
    },
    role: {
        type: String,
        deafult: "",
    },
    image: {
        type: String,
        deafult: "",
    },
    bio: {
        type: String,
        deafult: "",
    },
    socialLinks: {
        instagram: {
            type: String,
            deafult: "",
        },
        facebook: {
            type: String,
            deafult: "",
        },
        twitter: {
            type: String,
            deafult: "",
        },
        linkedin: {
            type: String,
            deafult: "",
        },
    },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeywords: { type: [String], default: [] },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
// Virtual field to match frontend `id`
TeamSchema.virtual("id").get(function () {
    return this._id.toHexString();
});
// Create the model
exports.Team = mongoose_1.default.model("Team", TeamSchema);
