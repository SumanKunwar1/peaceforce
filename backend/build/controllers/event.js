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
exports.EventController = void 0;
const _services_1 = require("@services"); // Importing the event service
class EventController {
    // Create a new event
    static createEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const eventData = req.body;
                const event = yield _services_1.eventService.createEvent(eventData);
                res.locals.responseData = event;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Get all events
    static getEvents(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const events = yield _services_1.eventService.getEvents();
                res.locals.responseData = { events };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Get an event by ID
    static getEventById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { eventId } = req.params; // Assuming eventId is the parameter
                const event = yield _services_1.eventService.getEventById(eventId);
                res.locals.responseData = { event };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Update an existing event
    static updateEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { eventId } = req.params; // Assuming eventId is the parameter
                const eventData = req.body;
                const updatedEvent = yield _services_1.eventService.updateEvent(eventId, eventData);
                res.locals.responseData = updatedEvent;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Delete an event
    static deleteEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { eventId } = req.params; // Assuming eventId is the parameter
                const deletedEvent = yield _services_1.eventService.deleteEvent(eventId);
                res.locals.responseData = deletedEvent;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.EventController = EventController;
