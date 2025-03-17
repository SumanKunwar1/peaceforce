"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serveFile_1 = require("@utils/serveFile");
const router = (0, express_1.Router)();
router.get("/:filename", (req, res) => {
    const { filename } = req.params;
    (0, serveFile_1.serveFile)(filename, res);
});
exports.default = router;
