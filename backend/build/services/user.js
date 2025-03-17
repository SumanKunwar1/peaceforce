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
exports.userService = void 0;
const _models_1 = require("@models");
const HttpMessage_1 = require("@utils/HttpMessage");
const deleteFile_1 = require("@utils/deleteFile");
class UserService {
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = new _models_1.User(Object.assign({}, userData));
                yield newUser.save();
                return newUser;
            }
            catch (error) {
                console.error("Error creating user:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield _models_1.User.find();
                // Format cv and coverLetter to URLs if present
                const formattedUsers = users.map((user) => {
                    if (user.cv) {
                        user.cv = `/api/image/${user.cv}`;
                    }
                    if (user.coverLetter) {
                        user.coverLetter = `/api/image/${user.coverLetter}`;
                    }
                    return user;
                });
                return formattedUsers;
            }
            catch (error) {
                console.error("Error fetching users:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield _models_1.User.findById(userId);
                if (!user) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND();
                }
                // Format cv and coverLetter to URLs if present
                if (user.cv) {
                    user.cv = `/api/image/cv/${user.cv}`;
                }
                if (user.coverLetter) {
                    user.coverLetter = `/api/image/coverletter/${user.coverLetter}`;
                }
                return user;
            }
            catch (error) {
                console.error("Error fetching user by ID:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    updateUser(userId, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield _models_1.User.findByIdAndUpdate(userId, userData, {
                    new: true,
                });
                if (!updatedUser) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND();
                }
                return updatedUser;
            }
            catch (error) {
                console.error("Error updating user:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield _models_1.User.findById(userId);
                if (!user) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND();
                }
                if (user.cv)
                    yield (0, deleteFile_1.deleteFile)(user.cv);
                if (user.coverLetter)
                    yield (0, deleteFile_1.deleteFile)(user.coverLetter);
                const deletedUser = yield _models_1.User.findByIdAndDelete(userId);
                if (!deletedUser) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND();
                }
                return deletedUser;
            }
            catch (error) {
                console.error("Error deleting user:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
}
exports.userService = new UserService();
