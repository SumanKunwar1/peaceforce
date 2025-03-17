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
exports.eventService = void 0;
const _models_1 = require("@models");
const deleteFile_1 = require("@utils/deleteFile");
const HttpMessage_1 = require("@utils/HttpMessage");
const bookEventForm_1 = require("./bookEventForm");
class EventService {
    // Create a new event
    createEvent(eventData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Directly create new event without saving images
                const newEvent = new _models_1.Event(Object.assign({}, eventData));
                yield newEvent.save();
                return newEvent;
            }
            catch (error) {
                console.error("Error creating event:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    // Get all events
    getEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const events = yield _models_1.Event.find();
                return events.map((event) => {
                    const eventObj = event.toObject();
                    return Object.assign(Object.assign({}, eventObj), { image: eventObj.image
                            ? `/api/image/${eventObj.image}`
                            : eventObj.image, gallery: eventObj.gallery
                            ? eventObj.gallery.map((file) => `/api/image/${file}`)
                            : [] });
                });
            }
            catch (error) {
                console.error("Error fetching events:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    // Get an event by ID
    getEventById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const event = yield _models_1.Event.findById(id);
                if (!event) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Event");
                }
                const eventObj = event.toObject();
                eventObj.image = eventObj.image
                    ? `/api/image/${eventObj.image}`
                    : eventObj.image;
                eventObj.gallery = eventObj.gallery
                    ? eventObj.gallery.map((file) => `/api/image/${file}`)
                    : [];
                return eventObj;
            }
            catch (error) {
                console.error("Error fetching event by ID:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    // Update an existing event
    updateEvent(id, eventData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingEvent = yield _models_1.Event.findById(id);
                if (!existingEvent) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Event");
                }
                // Handle image updates (if it's an empty string, delete it)
                if (eventData.image) {
                    if (eventData.image === "") {
                        // Delete the existing image if new one is empty
                        if (existingEvent.image) {
                            yield (0, deleteFile_1.deleteFile)(existingEvent.image);
                        }
                        eventData.image = ""; // Set empty string
                    }
                    else if (!eventData.image.startsWith("/api/image/")) {
                        // If it's a plain string (new image filename), delete the old one and update
                        if (existingEvent.image) {
                            yield (0, deleteFile_1.deleteFile)(existingEvent.image);
                        }
                        // Here, the image is assumed to be already saved, so we just update it
                        eventData.image = eventData.image;
                    }
                }
                // Handle gallery updates
                if (eventData.gallery !== undefined) {
                    // If the gallery is an empty array, delete all the existing files
                    if (eventData.gallery.length === 0) {
                        if (existingEvent.gallery) {
                            for (const file of existingEvent.gallery) {
                                yield (0, deleteFile_1.deleteFile)(file);
                            }
                        }
                        eventData.gallery = []; // Set to empty array
                    }
                    else if (!eventData.gallery.every((file) => file.startsWith("/api/image/"))) {
                        if (existingEvent.gallery) {
                            for (const file of existingEvent.gallery) {
                                yield (0, deleteFile_1.deleteFile)(file);
                            }
                        }
                        eventData.gallery = eventData.gallery; // Replace with the new gallery items (filenames)
                    }
                }
                // Update the event and return the updated event
                const updatedEvent = yield _models_1.Event.findByIdAndUpdate(id, eventData, {
                    new: true,
                });
                if (!updatedEvent) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Event");
                }
                return updatedEvent;
            }
            catch (error) {
                console.error("Error updating event:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    // Delete an event
    deleteEvent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const eventToDelete = yield _models_1.Event.findById(id);
                if (!eventToDelete) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Event");
                }
                // Delete the event image
                if (eventToDelete.image) {
                    yield (0, deleteFile_1.deleteFile)(eventToDelete.image);
                }
                // Delete gallery images
                if (eventToDelete.gallery && eventToDelete.gallery.length !== 0) {
                    for (const file of eventToDelete.gallery) {
                        yield (0, deleteFile_1.deleteFile)(file);
                    }
                }
                const bookingFormsToDelete = yield _models_1.BookEvent.find({ eventId: id });
                if (bookingFormsToDelete.length > 0) {
                    for (const bookingForm of bookingFormsToDelete) {
                        yield bookEventForm_1.bookEventService.deleteBookEvent(bookingForm._id.toString());
                    }
                }
                yield _models_1.Event.findByIdAndDelete(id);
                return `Event with ID ${id} and its corresponding bookings has been deleted`;
            }
            catch (error) {
                console.error("Error deleting event:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
}
exports.eventService = new EventService();
