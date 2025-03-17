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
exports.SliderController = void 0;
const _services_1 = require("@services");
class SliderController {
    // Create a new slider
    static createSlider(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sliderData = req.body;
                const slider = yield _services_1.sliderService.createSlider(sliderData);
                res.locals.responseData = slider;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Get all sliders
    static getSliders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sliders = yield _services_1.sliderService.getSliders();
                res.locals.responseData = { sliders };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Get a specific slider by ID
    static getSliderById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sliderId } = req.params;
                const slider = yield _services_1.sliderService.getSliderById(sliderId);
                res.locals.responseData = { slider };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Update an existing slider
    static updateSlider(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sliderId } = req.params;
                const sliderData = req.body;
                const updatedSlider = yield _services_1.sliderService.updateSlider(sliderId, sliderData);
                res.locals.responseData = updatedSlider;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Delete a slider
    static deleteSlider(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sliderId } = req.params;
                const deletedSlider = yield _services_1.sliderService.deleteSlider(sliderId);
                res.locals.responseData = deletedSlider;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Change the visibility of a slider
    static changeSliderVisibility(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sliderId } = req.params;
                const { isVisible } = req.body;
                const updatedSlider = yield _services_1.sliderService.updateSliderVisibility(sliderId, isVisible);
                res.locals.responseData = updatedSlider;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.SliderController = SliderController;
