"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfoSection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const InfoSectionSchema = new mongoose_1.default.Schema({
    location: {
        type: String,
        deafult: "",
    },
    email: {
        type: String,
        deafult: "",
    },
    phoneNumber: {
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
        youtube: {
            type: String,
            deafult: "",
        },
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
// Virtual field to match frontend `id`
InfoSectionSchema.virtual("id").get(function () {
    return this._id.toHexString();
});
// Create the model
exports.InfoSection = mongoose_1.default.model("InfoSection", InfoSectionSchema);
