"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Membership = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MembershipSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        default: "",
    },
    duration: {
        type: String,
        required: true,
    },
    fee: {
        type: Number,
        required: true,
    },
    benefits: {
        type: [String],
        default: [],
    },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeywords: { type: [String], default: [] },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
MembershipSchema.virtual("id").get(function () {
    return this._id.toHexString();
});
exports.Membership = mongoose_1.default.model("Membership", MembershipSchema);
