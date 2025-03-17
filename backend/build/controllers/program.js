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
exports.ProgramController = void 0;
const _services_1 = require("@services"); // Importing the program service
class ProgramController {
    static createProgram(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const programData = req.body;
                const program = yield _services_1.programService.createProgram(programData);
                res.locals.responseData = program;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getPrograms(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const programs = yield _services_1.programService.getPrograms();
                res.locals.responseData = { programs };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getProgramById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { programId } = req.params;
                const program = yield _services_1.programService.getProgramById(programId);
                res.locals.responseData = { program };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updateProgram(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { programId } = req.params;
                const programData = req.body;
                const updatedProgram = yield _services_1.programService.updateProgram(programId, programData);
                res.locals.responseData = updatedProgram;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteProgram(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { programId } = req.params;
                const deletedProgram = yield _services_1.programService.deleteProgram(programId);
                res.locals.responseData = deletedProgram;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ProgramController = ProgramController;
