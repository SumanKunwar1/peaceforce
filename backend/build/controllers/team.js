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
exports.TeamController = void 0;
const _services_1 = require("@services");
class TeamController {
    static createTeamMember(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const teamMemberData = req.body;
                const teamMember = yield _services_1.teamService.createTeamMember(teamMemberData);
                res.locals.responseData = teamMember;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getTeamMembers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const teamMembers = yield _services_1.teamService.getTeamMembers();
                res.locals.responseData = { teamMembers };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getTeamMemberById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { teamMemberId } = req.params;
                const teamMember = yield _services_1.teamService.getTeamMemberById(teamMemberId);
                res.locals.responseData = { teamMember };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updateTeamMember(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { teamMemberId } = req.params;
                const teamMemberData = req.body;
                const updatedTeamMember = yield _services_1.teamService.updateTeamMember(teamMemberId, teamMemberData);
                res.locals.responseData = updatedTeamMember;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteTeamMember(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { teamMemberId } = req.params;
                const deletedTeamMember = yield _services_1.teamService.deleteTeamMember(teamMemberId);
                res.locals.responseData = deletedTeamMember;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.TeamController = TeamController;
