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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.donationService = void 0;
const _models_1 = require("@models");
const _services_1 = require("@services");
const HttpMessage_1 = require("@utils/HttpMessage");
const mongoose_1 = __importDefault(require("mongoose"));
class DonationFormService {
    createDonation(donationData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { amount, name, email, phoneNumber, page, pageTitle, screenshot } = donationData;
            const user = yield _services_1.userService.createUser({
                name,
                email,
                phoneNumber,
                page,
                pageTitle,
                role: "donator",
            });
            const donationForm = new _models_1.Donation({
                userId: user._id,
                amount,
                screenshot,
            });
            yield donationForm.save();
            return donationForm;
        });
    }
    getDonations() {
        return __awaiter(this, void 0, void 0, function* () {
            const donations = yield _models_1.Donation.find().populate("userId");
            return donations.map((donation) => {
                const donationObj = donation.toObject();
                return Object.assign(Object.assign({}, donationObj), { screenshot: donationObj.screenshot
                        ? `/api/image/${donationObj.screenshot}`
                        : donationObj.screenshot });
            });
        });
    }
    getDonationById(donationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(donationId)) {
                throw HttpMessage_1.httpMessages.BAD_REQUEST("Invalid donationId format.");
            }
            const donationForm = yield _models_1.Donation.findById(donationId).populate("userId");
            if (!donationForm) {
                throw HttpMessage_1.httpMessages.NOT_FOUND("Donation form not found.");
            }
            const donationObj = donationForm.toObject();
            donationObj.screenshot = donationObj.screenshot
                ? `/api/image/${donationObj.screenshot}`
                : donationObj.screenshot;
            return donationForm;
        });
    }
    deleteDonation(donationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(donationId)) {
                throw HttpMessage_1.httpMessages.BAD_REQUEST("Invalid donationId format.");
            }
            const donationFormToDelete = yield _models_1.Donation.findById(donationId);
            if (!donationFormToDelete) {
                throw HttpMessage_1.httpMessages.NOT_FOUND("Donation form not found.");
            }
            const deletedDonationForm = yield _models_1.Donation.findByIdAndDelete(donationId);
            if (!deletedDonationForm) {
                throw HttpMessage_1.httpMessages.NOT_FOUND("Donation form not found.");
            }
            // await userService.deleteUser(donationFormToDelete.userId!.toString());
            return deletedDonationForm;
        });
    }
}
exports.donationService = new DonationFormService();
