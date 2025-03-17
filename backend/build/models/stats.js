"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stats = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const StatsSchema = new mongoose_1.default.Schema({
    icon: { type: String, default: "" },
    endValue: { type: Number, default: 0 },
    label: { type: String, default: "" },
    description: { type: String, default: "" },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
StatsSchema.virtual("id").get(function () {
    return this._id.toHexString();
});
exports.Stats = mongoose_1.default.model("Facts", StatsSchema);
