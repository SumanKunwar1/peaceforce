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
exports.teamService = void 0;
const _models_1 = require("@models");
const HttpMessage_1 = require("@utils/HttpMessage");
const deleteFile_1 = require("@utils/deleteFile");
class TeamService {
    createTeamMember(teamMemberData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newTeamMember = new _models_1.Team(Object.assign({}, teamMemberData));
                yield newTeamMember.save();
                return newTeamMember;
            }
            catch (error) {
                console.error("Error creating team member:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    getTeamMembers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const teamMembers = yield _models_1.Team.find();
                return teamMembers.map((member) => {
                    const teamMember = member.toObject();
                    return Object.assign(Object.assign({}, teamMember), { image: teamMember.image
                            ? `/api/image/${teamMember.image}`
                            : teamMember.image });
                });
            }
            catch (error) {
                console.error("Error fetching team members:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    getTeamMemberById(teamMemberId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const teamMember = yield _models_1.Team.findById(teamMemberId);
                if (!teamMember) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Team member");
                }
                const teamMemberObj = teamMember.toObject();
                if (teamMemberObj.image) {
                    teamMemberObj.image = `/api/image/${teamMemberObj.image}`;
                }
                return teamMemberObj;
            }
            catch (error) {
                console.error("Error fetching team member by ID:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    updateTeamMember(teamMemberId, teamMemberData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingTeamMember = yield _models_1.Team.findById(teamMemberId);
                if (!existingTeamMember) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Team member");
                }
                // Handle image field
                if (teamMemberData.image) {
                    console.log("Processing image field...");
                    if (teamMemberData.image === "") {
                        console.log("Image field is empty. Deleting existing image if present...");
                        if (existingTeamMember.image) {
                            console.log(`Deleting existing image: ${existingTeamMember.image}`);
                            yield (0, deleteFile_1.deleteFile)(existingTeamMember.image);
                        }
                        teamMemberData.image = ""; // Set empty string
                        console.log("Image has been cleared.");
                    }
                    else if (!teamMemberData.image.startsWith("/api/image/")) {
                        console.log("Image URL seems to be a new file path, updating image...");
                        if (existingTeamMember.image) {
                            console.log(`Deleting old image: ${existingTeamMember.image}`);
                            yield (0, deleteFile_1.deleteFile)(existingTeamMember.image);
                        }
                        console.log(`New image file: ${teamMemberData.image}`);
                    }
                }
                // Update the team member in the database
                const updatedTeamMember = yield _models_1.Team.findByIdAndUpdate(teamMemberId, teamMemberData, { new: true });
                if (!updatedTeamMember) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Team member");
                }
                return updatedTeamMember;
            }
            catch (error) {
                console.error("Error updating team member:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    deleteTeamMember(teamMemberId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const teamMemberToDelete = yield _models_1.Team.findById(teamMemberId);
                if (!teamMemberToDelete) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Team member");
                }
                // Delete image file if it exists
                if (teamMemberToDelete.image) {
                    yield (0, deleteFile_1.deleteFile)(teamMemberToDelete.image);
                }
                // Delete the team member itself
                yield _models_1.Team.findByIdAndDelete(teamMemberId);
                return teamMemberToDelete;
            }
            catch (error) {
                console.error("Error deleting team member:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
}
exports.teamService = new TeamService();
