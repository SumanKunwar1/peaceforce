"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _controllers_1 = require("@controllers");
const router = (0, express_1.Router)();
router.post("/", _controllers_1.AdminLoginController.loginAdmin);
exports.default = router;
