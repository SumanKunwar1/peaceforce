"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const _controllers_1 = require("@controllers");
const _middleware_1 = require("@middleware");
const router = express_1.default.Router();
router.get("/", _controllers_1.SeoMetaController.getSeoMeta);
router.get("/:pageTitle", _controllers_1.SeoMetaController.getSeoMetaByPage);
router.post("/", _middleware_1.isAuthenticated, _middleware_1.validateSeoMeta, _controllers_1.SeoMetaController.createSeoMeta);
router.patch("/:seoMetaId", _middleware_1.isAuthenticated, _middleware_1.validateSeoMetaUpdate, _controllers_1.SeoMetaController.updateSeoMeta);
router.delete("/:seoMetaId", _middleware_1.isAuthenticated, _controllers_1.SeoMetaController.deleteSeoMeta);
exports.default = router;
