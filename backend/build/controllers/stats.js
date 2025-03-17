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
exports.StatsController = void 0;
const _services_1 = require("@services");
class StatsController {
    // Create a new stat
    static createStat(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const statData = req.body;
                const newStat = yield _services_1.statsService.createStat(statData);
                res.locals.responseData = newStat;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Get all stats
    static getStats(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stats = yield _services_1.statsService.getStats();
                res.locals.responseData = { stats };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Get a single stat by ID
    static getStatById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { statId } = req.params;
                const stat = yield _services_1.statsService.getStatById(statId);
                res.locals.responseData = stat;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Update a stat by ID
    static updateStat(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { statId } = req.params;
                const statData = req.body;
                const updatedStat = yield _services_1.statsService.updateStat(statId, statData);
                res.locals.responseData = updatedStat;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Delete a stat by ID
    static deleteStat(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { statId } = req.params;
                const deletedStat = yield _services_1.statsService.deleteStat(statId);
                res.locals.responseData = deletedStat;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.StatsController = StatsController;
