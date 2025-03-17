"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cors_2 = require("@config/cors");
const _routes_1 = __importDefault(require("@routes"));
const handleResponse_1 = require("@utils/handleResponse"); // Import handleResponse
const handleError_1 = require("@utils/handleError");
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "10mb" })); // Increase limit for JSON payload to 10MB
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
// Middleware setup
app.use((0, cors_1.default)(cors_2.corsOptions));
app.use("/api", _routes_1.default);
app.use(handleResponse_1.handleResponse);
app.use(handleError_1.handleError);
// Root endpoint
app.get("/", (req, res) => {
    console.log("Root endpoint hit (GET /)");
    res.send("Hello, World!");
});
exports.default = app;
