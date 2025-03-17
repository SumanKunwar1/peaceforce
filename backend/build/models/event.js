"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TicketTypeSchema = new mongoose_1.default.Schema({
    type: { type: String, enum: ["VVIP", "VIP", "Regular"], required: true },
    price: { type: Number, required: true },
    benefits: { type: [String], required: false },
    available: { type: Number, required: true },
}, { _id: false });
const EventSchema = new mongoose_1.default.Schema({
    title: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    fullDescription: { type: String, default: "" },
    date: { type: String, default: "" },
    time: { type: String, default: "" },
    image: { type: String, default: "" },
    location: { type: String, default: "" },
    venue: { type: String, default: "" },
    artist: { type: String, default: "" },
    ticketTypes: { type: [TicketTypeSchema], default: [] },
    gallery: { type: [String], default: [] },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeywords: { type: [String], default: [] },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
EventSchema.virtual("id").get(function () {
    return this._id.toHexString();
});
exports.Event = mongoose_1.default.model("Event", EventSchema);
