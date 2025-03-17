"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const env_1 = require("./env");
exports.corsOptions = process.env.NODE_ENV === "production"
    ? {
        origin: env_1.DOMAIN_NAME,
        methods: ["GET", "POST", "PUT", "DELETE"],
    }
    : {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
    };
