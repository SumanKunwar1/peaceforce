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
exports.initializeAdminUser = void 0;
const _services_1 = require("@services");
const models_1 = require("../models");
const adminUserData = {
    name: "btmc foundation",
    email: "btmcfoundation@gmail.com",
    phoneNumber: "9851042257",
    role: "admin",
    password: "BTMC@Foundation",
    isActive: true,
};
const initializeAdminUser = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingAdmin = yield models_1.User.findOne({ role: "admin" });
        if (existingAdmin) {
            console.log("✌ Admin user already exists.✌");
            return;
        }
        yield _services_1.userService.createUser(adminUserData);
        console.log("✌ Admin user created successfully.✌");
    }
    catch (error) {
        console.error("Error initializing admin user:", error);
    }
});
exports.initializeAdminUser = initializeAdminUser;
