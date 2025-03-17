"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookEventController = void 0;
const _services_1 = require("@services");
class BookEventController {
    static createBookEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingData = req.body;
                const booking = yield _services_1.bookEventService.createBookEvent(bookingData);
                res.locals.responseData = booking;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Get a list of all bookings
    static getBookEvents(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield _services_1.bookEventService.getBookEvents();
                res.locals.responseData = { bookings };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Get a single booking by ID
    static getBookEventById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId } = req.params;
                const booking = yield _services_1.bookEventService.getBookEventById(bookingId);
                res.locals.responseData = { booking };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Update an event booking
    static updateBookEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId } = req.params;
                const bookingData = req.body;
                const updatedBookEvent = yield _services_1.bookEventService.updateBookEvent(bookingId, bookingData);
                res.locals.responseData = updatedBookEvent;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Delete an event booking
    static deleteBookEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId } = req.params;
                const deletedBookEvent = yield _services_1.bookEventService.deleteBookEvent(bookingId);
                res.locals.responseData = deletedBookEvent;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.BookEventController = BookEventController;
