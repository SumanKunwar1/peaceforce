"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.About = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Schema for AboutContent (with icon)
const AboutContentSchema = new mongoose_1.default.Schema({
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
}, { _id: false });
// Schema for AboutHeroContent (without icon)
const AboutHeroContentSchema = new mongoose_1.default.Schema({
    title: { type: String, default: "" },
    description: { type: String, default: "" },
}, { _id: false });
const AboutSchema = new mongoose_1.default.Schema({
    image: { type: String },
    aboutHero: { type: AboutHeroContentSchema, default: {} },
    aboutContent: { type: [AboutContentSchema], default: [] },
    missionsSection: { type: [AboutContentSchema], default: [] },
    servicesSection: { type: [AboutContentSchema], default: [] },
    visionSection: { type: [AboutContentSchema], default: [] },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
AboutSchema.virtual("id").get(function () {
    return this._id.toHexString();
});
exports.About = mongoose_1.default.model("About", AboutSchema);
