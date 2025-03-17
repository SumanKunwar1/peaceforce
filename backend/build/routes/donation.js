"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _controllers_1 = require("@controllers");
const _middleware_1 = require("@middleware");
const multerConfig_1 = __importDefault(require("@config/multerConfig"));
const _middleware_2 = require("@middleware");
const router = (0, express_1.Router)();
router.post("/", multerConfig_1.default.fields([{ name: "screenshot", maxCount: 1 }]), (0, _middleware_2.trackFilesForDeletion)([{ fileField: "screenshot" }]), (0, _middleware_2.appendFile)([
    { fileField: "screenshot", bodyField: "screenshot", isArray: false },
]), _middleware_1.validateDonation, _controllers_1.DonationController.createDonation);
router.get("/", _middleware_1.isAuthenticated, _controllers_1.DonationController.getDonations);
router.get("/:donationId", _middleware_1.isAuthenticated, _controllers_1.DonationController.getDonationById);
router.delete("/:donationId", _middleware_1.isAuthenticated, _controllers_1.DonationController.deleteDonation);
exports.default = router;
