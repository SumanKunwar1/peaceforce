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
exports.TourController = void 0;
const _services_1 = require("@services");
class TourController {
    static createTour(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tourData = req.body;
                const tour = yield _services_1.tourService.createTour(tourData);
                res.locals.responseData = tour;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getTours(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tours = yield _services_1.tourService.getTours();
                res.locals.responseData = { tours };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getTourById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tourId } = req.params;
                const tour = yield _services_1.tourService.getTourById(tourId);
                res.locals.responseData = { tour };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updateTour(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tourId } = req.params;
                const tourData = req.body;
                const updatedTour = yield _services_1.tourService.updateTour(tourId, tourData);
                res.locals.responseData = updatedTour;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteTour(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tourId } = req.params;
                const deletedTour = yield _services_1.tourService.deleteTour(tourId);
                res.locals.responseData = deletedTour;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.TourController = TourController;
