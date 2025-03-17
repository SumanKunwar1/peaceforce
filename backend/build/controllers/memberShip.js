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
exports.MembershipController = void 0;
const _services_1 = require("@services");
class MembershipController {
    static createMembership(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const membershipData = req.body;
                const membership = yield _services_1.membershipService.createMembership(membershipData);
                res.locals.responseData = membership;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getMemberships(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const memberships = yield _services_1.membershipService.getMemberships();
                res.locals.responseData = { memberships };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getMembershipById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { membershipId } = req.params;
                const membership = yield _services_1.membershipService.getMembershipById(membershipId);
                res.locals.responseData = { membership };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updateMembership(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { membershipId } = req.params;
                const membershipData = req.body;
                const updatedMembership = yield _services_1.membershipService.updateMembership(membershipId, membershipData);
                res.locals.responseData = updatedMembership;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteMembership(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { membershipId } = req.params;
                const deletedMembership = yield _services_1.membershipService.deleteMembership(membershipId);
                res.locals.responseData = deletedMembership;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.MembershipController = MembershipController;
