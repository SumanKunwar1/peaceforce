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
exports.contactService = void 0;
const _models_1 = require("@models");
const _services_1 = require("@services");
const mongoose_1 = __importDefault(require("mongoose"));
class ContactService {
    createContact(contactData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, phoneNumber, message, page, pageTitle } = contactData;
            // Create a user associated with the contact
            const user = yield _services_1.userService.createUser({
                name,
                email,
                phoneNumber,
                page,
                pageTitle,
            });
            const contact = new _models_1.Contact({
                userId: user._id,
                message,
            });
            yield contact.save();
            return contact;
        });
    }
    getContacts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _models_1.Contact.find().populate("userId");
        });
    }
    getContactById(contactId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(contactId)) {
                throw new Error("Invalid contactId format.");
            }
            const contact = yield _models_1.Contact.findById(contactId).populate("userId");
            if (!contact) {
                throw new Error("Contact not found.");
            }
            return contact;
        });
    }
    deleteContact(contactId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(contactId)) {
                throw new Error("Invalid contactId format.");
            }
            const contactToDelete = yield _models_1.Contact.findById(contactId);
            if (!contactToDelete) {
                throw new Error("Contact not found.");
            }
            const deletedContact = yield _models_1.Contact.findByIdAndDelete(contactId);
            if (!deletedContact) {
                throw new Error("Contact not found.");
            }
            // Optionally delete the associated user
            yield _services_1.userService.deleteUser(contactToDelete.userId.toString());
            return deletedContact;
        });
    }
}
exports.contactService = new ContactService();
