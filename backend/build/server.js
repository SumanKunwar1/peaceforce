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
require("module-alias/register");
const _app_1 = __importDefault(require("@app"));
const env_1 = require("@config/env");
const db_1 = __importDefault(require("@config/db"));
const filePath_1 = require("@utils/filePath");
const initializeAdmin_1 = require("./utils/initializeAdmin");
_app_1.default.listen(env_1.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.default)();
    yield (0, filePath_1.ensureUploadFolderExists)();
    yield (0, initializeAdmin_1.initializeAdminUser)();
    console.log(`Server running at http://localhost:${env_1.PORT}`);
}));
