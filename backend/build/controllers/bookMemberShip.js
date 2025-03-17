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
exports.BookMembershipController = void 0;
const _services_1 = require("@services");
class BookMembershipController {
    // Create a new membership booking
    static createBookMembership(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookMembershipData = req.body;
                const bookMembership = yield _services_1.bookMembershipService.createBookMembership(bookMembershipData);
                res.locals.responseData = bookMembership;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Get all membership bookings
    static getBookMemberships(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookMemberships = yield _services_1.bookMembershipService.getBookMemberships();
                res.locals.responseData = { bookMemberships };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Get a single membership booking by ID
    static getBookMembershipById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookMembershipId } = req.params;
                const bookMembership = yield _services_1.bookMembershipService.getBookMembershipById(bookMembershipId);
                res.locals.responseData = { bookMembership };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Update a membership booking by ID
    static updateBookMembership(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookMembershipId } = req.params;
                const bookMembershipData = req.body;
                const updatedBookMembership = yield _services_1.bookMembershipService.updateBookMembership(bookMembershipId, bookMembershipData);
                res.locals.responseData = updatedBookMembership;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Delete a membership booking by ID
    static deleteBookMembership(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookMembershipId } = req.params;
                const deletedBookMembership = yield _services_1.bookMembershipService.deleteBookMembership(bookMembershipId);
                res.locals.responseData = deletedBookMembership;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.BookMembershipController = BookMembershipController;
