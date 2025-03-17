"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveFile = serveFile;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mime_types_1 = __importDefault(require("mime-types"));
const filePath_1 = require("@utils/filePath");
function serveFile(filename, res) {
    const filePath = path_1.default.join(filePath_1.uploadPath, filename);
    fs_1.default.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            return res.status(404).json({ error: "File not found" });
        }
        const mimeType = mime_types_1.default.lookup(filename);
        if (!mimeType) {
            return res.status(415).json({ error: "Unsupported file type" });
        }
        res.setHeader("Content-Type", mimeType);
        res.sendFile(filePath);
    });
}
