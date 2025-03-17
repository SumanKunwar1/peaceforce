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
exports.BookProgramController = void 0;
const _services_1 = require("@services");
class BookProgramController {
    // Create a new program booking
    static createBookProgram(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingData = req.body;
                const booking = yield _services_1.bookProgramService.createBookProgram(bookingData);
                res.locals.responseData = booking;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Get a list of all program bookings
    static getBookPrograms(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield _services_1.bookProgramService.getBookPrograms();
                res.locals.responseData = { bookings };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Get a single program booking by ID
    static getBookProgramById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId } = req.params;
                const booking = yield _services_1.bookProgramService.getBookProgramById(bookingId);
                res.locals.responseData = { booking };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Update a program booking
    static updateBookProgram(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId } = req.params;
                const bookingData = req.body;
                const updatedBooking = yield _services_1.bookProgramService.updateBookProgram(bookingId, bookingData);
                res.locals.responseData = updatedBooking;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Delete a program booking
    static deleteBookProgram(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId } = req.params;
                const deletedBooking = yield _services_1.bookProgramService.deleteBookProgram(bookingId);
                res.locals.responseData = deletedBooking;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.BookProgramController = BookProgramController;
