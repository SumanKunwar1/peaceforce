"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _controllers_1 = require("@controllers");
const multerConfig_1 = __importDefault(require("@config/multerConfig"));
const _middleware_1 = require("@middleware");
const router = (0, express_1.Router)();
router.put("/", _middleware_1.isAuthenticated, multerConfig_1.default.fields([{ name: "image", maxCount: 1 }]), (0, _middleware_1.trackFilesForDeletion)([{ fileField: "image" }]), (0, _middleware_1.parseJsonFields)(["hero", "impacts", "waysToSupport"]), (0, _middleware_1.appendFile)([{ fileField: "image", bodyField: "hero.image", isArray: false }]), _middleware_1.validateSupport, _controllers_1.SupportController.updateSupport);
router.get("/", _controllers_1.SupportController.getSupport);
router.delete("/", _middleware_1.isAuthenticated, _controllers_1.SupportController.deleteSupport // Controller method to delete support
);
exports.default = router;
