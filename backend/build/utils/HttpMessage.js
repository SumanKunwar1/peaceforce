"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpMessages = void 0;
exports.httpMessages = {
    NOT_FOUND: (resource = "Data") => ({
        statusCode: 404,
        message: `${resource} not found`,
    }),
    ALREADY_PRESENT: (resource = "Data") => ({
        statusCode: 409,
        message: `${resource} already exists`,
    }),
    INVALID_CREDENTIALS: {
        statusCode: 401,
        message: "Invalid email or password",
    },
    FORBIDDEN: (reason = "Request") => ({
        statusCode: 403,
        message: `${reason}`,
    }),
    UNAUTHORIZED: (message = "Unauthorized access") => ({
        statusCode: 401,
        message: message,
    }),
    UNAUTHORIZED_NO_DATA: (message = "Unable to verify credentials from the token") => ({
        statusCode: 401,
        message: message,
    }),
    UNAUTHORIZED_NO_TOKEN: {
        statusCode: 401,
        message: "Unauthorized access: No token provided",
    },
    UNAUTHORIZED_INVALID_TOKEN: {
        statusCode: 401,
        message: "Unauthorized access: Invalid token",
    },
    UNAUTHORIZED_TOKEN_EXPIRED: {
        statusCode: 401,
        message: "Unauthorized access: expired token",
    },
    BAD_REQUEST: (details = "") => ({
        statusCode: 400,
        message: `Bad request${details ? `: ${details}` : ""}`,
    }),
    INTERNAL_SERVER_ERROR: {
        statusCode: 500,
        message: "Internal server error",
    },
    USER_NOT_FOUND: (userType = "User") => ({
        statusCode: 404,
        message: `${userType} not found`,
    }),
};
