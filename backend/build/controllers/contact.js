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
exports.ContactController = void 0;
const _services_1 = require("@services");
class ContactController {
    static createContact(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contactData = req.body;
                const contact = yield _services_1.contactService.createContact(contactData);
                res.locals.responseData = contact;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getContacts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contacts = yield _services_1.contactService.getContacts();
                res.locals.responseData = { contacts };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getContactById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { contactId } = req.params;
                const contact = yield _services_1.contactService.getContactById(contactId);
                res.locals.responseData = { contact };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteContact(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { contactId } = req.params;
                const deletedContact = yield _services_1.contactService.deleteContact(contactId);
                res.locals.responseData = deletedContact;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ContactController = ContactController;
