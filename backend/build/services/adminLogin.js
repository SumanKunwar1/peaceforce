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
exports.adminLoginService = void 0;
const _models_1 = require("@models");
const HttpMessage_1 = require("@utils/HttpMessage");
const password_1 = require("@utils/password");
const token_1 = require("@utils/token");
class AdminLoginService {
    loginAdmin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield _models_1.User.findOne({
                    email,
                    role: "admin",
                });
                if (!user) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Admin inactive or");
                }
                const isPasswordValid = yield (0, password_1.isPasswordMatch)(password, user.password);
                if (!isPasswordValid) {
                    throw HttpMessage_1.httpMessages.INVALID_CREDENTIALS;
                }
                const token = (0, token_1.GenerateAuthtoken)(user.email);
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token,
                };
            }
            catch (error) {
                console.error("Error logging in admin:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
}
exports.adminLoginService = new AdminLoginService();
