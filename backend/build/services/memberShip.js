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
exports.membershipService = void 0;
const _models_1 = require("@models");
const HttpMessage_1 = require("@utils/HttpMessage");
class MembershipService {
    createMembership(membershipData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newMembership = new _models_1.Membership(Object.assign({}, membershipData));
                yield newMembership.save();
                return newMembership;
            }
            catch (error) {
                console.error("Error creating membership:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    getMemberships() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const memberships = yield _models_1.Membership.find();
                return memberships;
            }
            catch (error) {
                console.error("Error fetching memberships:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    getMembershipById(membershipId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const membership = yield _models_1.Membership.findById(membershipId);
                if (!membership) {
                    throw HttpMessage_1.httpMessages.NOT_FOUND("MemberShip");
                }
                return membership;
            }
            catch (error) {
                console.error("Error fetching membership by ID:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    updateMembership(membershipId, membershipData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedMembership = yield _models_1.Membership.findByIdAndUpdate(membershipId, membershipData, {
                    new: true,
                });
                if (!updatedMembership) {
                    throw HttpMessage_1.httpMessages.NOT_FOUND("MemberShip");
                }
                return updatedMembership;
            }
            catch (error) {
                console.error("Error updating membership:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    deleteMembership(membershipId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const membership = yield _models_1.Membership.findById(membershipId);
                if (!membership) {
                    throw HttpMessage_1.httpMessages.NOT_FOUND("MemberShip");
                }
                const deletedMembership = yield _models_1.Membership.findByIdAndDelete(membershipId);
                if (!deletedMembership) {
                    throw HttpMessage_1.httpMessages.NOT_FOUND("MemberShip");
                }
                return deletedMembership;
            }
            catch (error) {
                console.error("Error deleting membership:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
}
exports.membershipService = new MembershipService();
