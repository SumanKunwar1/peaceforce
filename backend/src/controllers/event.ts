import { Request, Response, NextFunction } from "express";
import { eventService } from "@services"; // Importing the event service

export class EventController {
  // Create a new event
  static async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const eventData = req.body;
      const event = await eventService.createEvent(eventData);
      res.locals.responseData = event;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Get all events
  static async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const events = await eventService.getEvents();
      res.locals.responseData = { events };
      next();
    } catch (error) {
      next(error);
    }
  }

  // Get an event by ID
  static async getEventById(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params; // Assuming eventId is the parameter
      const event = await eventService.getEventById(eventId);
      res.locals.responseData = { event };
      next();
    } catch (error) {
      next(error);
    }
  }

  // Update an existing event
  static async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params; // Assuming eventId is the parameter
      const eventData = req.body;
      const updatedEvent = await eventService.updateEvent(eventId, eventData);
      res.locals.responseData = updatedEvent;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Delete an event
  static async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params; // Assuming eventId is the parameter
      const deletedEvent = await eventService.deleteEvent(eventId);
      res.locals.responseData = deletedEvent;
      next();
    } catch (error) {
      next(error);
    }
  }
}
