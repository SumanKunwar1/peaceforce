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
exports.DonationController = void 0;
const _services_1 = require("@services");
class DonationController {
    // Create a new donation
    static createDonation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const donationData = req.body;
                const donation = yield _services_1.donationService.createDonation(donationData);
                res.locals.responseData = donation;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Get a list of all donations
    static getDonations(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const donations = yield _services_1.donationService.getDonations();
                res.locals.responseData = { donations };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Get a single donation by ID
    static getDonationById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { donationId } = req.params;
                const donation = yield _services_1.donationService.getDonationById(donationId);
                res.locals.responseData = { donation };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Delete a donation
    static deleteDonation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { donationId } = req.params;
                const deletedDonation = yield _services_1.donationService.deleteDonation(donationId);
                res.locals.responseData = deletedDonation;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.DonationController = DonationController;
