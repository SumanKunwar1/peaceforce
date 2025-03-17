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
exports.BookingFormController = void 0;
const _services_1 = require("@services");
class BookingFormController {
    static createBookingForm(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingFormData = req.body;
                const bookingForm = yield _services_1.bookingFormService.createBookingForm(bookingFormData);
                res.locals.responseData = bookingForm;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getBookingForms(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingForms = yield _services_1.bookingFormService.getBookingForms();
                res.locals.responseData = { bookingForms };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getBookingFormById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingFormId } = req.params;
                const bookingForm = yield _services_1.bookingFormService.getBookingFormById(bookingFormId);
                res.locals.responseData = { bookingForm };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updateBookingForm(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingFormId } = req.params;
                const bookingFormData = req.body;
                const updatedBookingForm = yield _services_1.bookingFormService.updateBookingForm(bookingFormId, bookingFormData);
                res.locals.responseData = updatedBookingForm;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteBookingForm(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingFormId } = req.params;
                const deletedBookingForm = yield _services_1.bookingFormService.deleteBookingForm(bookingFormId);
                res.locals.responseData = deletedBookingForm;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.BookingFormController = BookingFormController;
