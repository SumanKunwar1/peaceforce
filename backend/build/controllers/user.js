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
exports.UserController = void 0;
const _services_1 = require("@services");
class UserController {
    // Controller for creating a new user
    static createUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const user = yield _services_1.userService.createUser(userData);
                res.locals.responseData = user;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Controller for getting all users
    static getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield _services_1.userService.getUsers();
                res.locals.responseData = { users };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Controller for getting a user by ID
    static getUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const user = yield _services_1.userService.getUserById(userId);
                res.locals.responseData = { user };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Controller for updating a user by ID
    static updateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const userData = req.body;
                const updatedUser = yield _services_1.userService.updateUser(userId, userData);
                res.locals.responseData = updatedUser;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Controller for deleting a user by ID
    static deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const deletedUser = yield _services_1.userService.deleteUser(userId);
                res.locals.responseData = deletedUser;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.UserController = UserController;
