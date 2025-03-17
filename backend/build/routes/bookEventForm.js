"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _controllers_1 = require("@controllers");
const _middleware_1 = require("@middleware");
const router = (0, express_1.Router)();
// Create a new booking form
router.post("/", _middleware_1.validateEventBookingForm, _controllers_1.BookEventController.createBookEvent);
// Update an existing booking form
router.patch("/:bookingId", _middleware_1.isAuthenticated, _middleware_1.validateEventBookingUpdate, _controllers_1.BookEventController.updateBookEvent);
// Get all booking forms
router.get("/", _middleware_1.isAuthenticated, _controllers_1.BookEventController.getBookEvents);
// Get a booking form by its ID
router.get("/:bookingId", _middleware_1.isAuthenticated, _controllers_1.BookEventController.getBookEventById);
// Delete a booking form
router.delete("/:bookingId", _middleware_1.isAuthenticated, _controllers_1.BookEventController.deleteBookEvent);
exports.default = router;
