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
exports.statsService = void 0;
const _models_1 = require("@models");
const HttpMessage_1 = require("@utils/HttpMessage");
class StatsService {
    createStat(statData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newStat = new _models_1.Stats(statData);
                yield newStat.save();
                return newStat.toObject();
            }
            catch (error) {
                console.error("Error creating stat:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    getStats() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield _models_1.Stats.find();
            }
            catch (error) {
                console.error("Error fetching stats:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    getStatById(statId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stat = yield _models_1.Stats.findById(statId);
                if (!stat) {
                    throw HttpMessage_1.httpMessages.NOT_FOUND("Stat not found");
                }
                return stat.toObject();
            }
            catch (error) {
                console.error("Error fetching stat by ID:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    updateStat(statId, statData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedStat = yield _models_1.Stats.findByIdAndUpdate(statId, statData, {
                    new: true,
                });
                if (!updatedStat) {
                    throw HttpMessage_1.httpMessages.NOT_FOUND("Stat not found");
                }
                return updatedStat.toObject();
            }
            catch (error) {
                console.error("Error updating stat:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    deleteStat(statId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const statToDelete = yield _models_1.Stats.findById(statId);
                if (!statToDelete) {
                    throw HttpMessage_1.httpMessages.NOT_FOUND("Stat not found");
                }
                yield _models_1.Stats.findByIdAndDelete(statId);
                return statToDelete.toObject();
            }
            catch (error) {
                console.error("Error deleting stat:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
}
exports.statsService = new StatsService();
