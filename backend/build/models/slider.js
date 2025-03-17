"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slider = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const SliderSchema = new mongoose_1.default.Schema({
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    buttons: [
        {
            text: { type: String, default: "" },
            link: { type: String, default: "" },
            bgColor: { type: String, default: "" },
        },
    ],
    isVisible: { type: Boolean, default: true }, // Default value set to true
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
// Virtual ID field for easier access
SliderSchema.virtual("id").get(function () {
    return this._id.toHexString();
});
// Exporting the Slider model
exports.Slider = mongoose_1.default.model("Slider", SliderSchema);
