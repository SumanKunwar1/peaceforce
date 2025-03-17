import { BookEvent, IBookEventData, Event, IUser } from "../models";
import { userService } from "../services/index";
import { IBookEventFormInput, IBookEventFormUpdate } from "../types";
import { httpMessages } from "../utils/HttpMessage";
import mongoose from "mongoose";
import { sendEmail } from "../config/BrevoMail";
import { ADMIN_EMAIL } from "../config/env";

class BookEventFormService {
  async createBookEvent(
    bookingData: IBookEventFormInput
  ): Promise<IBookEventData> {
    const { eventId, ticketType, quantity, specialRequirements } = bookingData;

    const event = await Event.findById(eventId);
    if (!event) {
      throw httpMessages.NOT_FOUND("Event category not found.");
    }
    let ticket;
    if (event.ticketTypes) {
      ticket = event.ticketTypes.find((t) => t.type === ticketType);
    }
    if (!ticket) {
      throw httpMessages.NOT_FOUND(
        `Ticket type ${ticketType} not available for this event.`
      );
    }

    if (ticket.available < quantity) {
      throw httpMessages.BAD_REQUEST(
        `Not enough tickets available for the ${ticketType} type.`
      );
    }

    ticket.available -= quantity;

    const user = await userService.createUser({
      name: bookingData.name,
      email: bookingData.email,
      phoneNumber: bookingData.phoneNumber,
      page: bookingData.page,
      pageTitle: bookingData.pageTitle,
    });

    // Create the booking form
    const bookingForm = new BookEvent({
      userId: user._id, // Associate the booking with the user
      eventId,
      ticketType,
      quantity,
      specialRequirements,
    });

    await bookingForm.save();
    await event.save();

    await this.sendBookEventEmail(
      user.name,
      user.email,
      event.title!,
      ticketType,
      quantity,
      "created"
    );

    return bookingForm;
  }

  // Get all event booking forms
  async getBookEvents(): Promise<IBookEventData[]> {
    const bookEvent = await BookEvent.find().populate("userId");
    return bookEvent;
  }

  // Get an event booking form by ID
  async getBookEventById(bookingId: string): Promise<IBookEventData | null> {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw httpMessages.BAD_REQUEST("Invalid bookingId format.");
    }

    const bookingForm = await BookEvent.findById(bookingId).populate("userId");

    return bookingForm;
  }

  async updateBookEvent(
    bookingId: string,
    bookingData: IBookEventFormUpdate
  ): Promise<IBookEventData | null> {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw httpMessages.BAD_REQUEST("Invalid bookingId format.");
    }

    // Fetch the current booking form
    const bookingForm = await BookEvent.findById(bookingId);
    if (!bookingForm) {
      throw httpMessages.NOT_FOUND("BookEvent form not found.");
    }

    // Fetch the related event
    const event = await Event.findById(bookingForm.eventId);
    if (!event) {
      throw httpMessages.NOT_FOUND("Event not found.");
    }

    if (bookingData.quantity) {
      let ticketType;
      if (event.ticketTypes) {
        ticketType = event.ticketTypes.find(
          (ticket) => ticket.type === bookingForm.ticketType
        );
      }
      if (!ticketType) {
        throw httpMessages.BAD_REQUEST("Not tickets available.");
      }

      const quantityUpdateDiffrence =
        bookingData.quantity - bookingForm.quantity;

      if (quantityUpdateDiffrence > 0) {
        //which would mean that new quantity is larger so we must cjeck the availability
        if (ticketType && quantityUpdateDiffrence > ticketType.available) {
          throw httpMessages.BAD_REQUEST("Not enough tickets available.");
        }
      }

      ticketType.available += bookingForm.quantity; // Release the previously booked tickets
      ticketType.available -= bookingData.quantity;

      await event.save();
    }

    // Update the booking form with the valid data
    const updatedBookEventForm = await BookEvent.findByIdAndUpdate(
      bookingId,
      bookingData,
      {
        new: true,
      }
    );

    if (!updatedBookEventForm) {
      throw httpMessages.NOT_FOUND("BookEvent form not found.");
    }
    // Fetch user details for email
    const user = await userService.getUserById(
      updatedBookEventForm.userId.toString()
    );

    // Send email notification for booking update
    await this.sendBookEventEmail(
      user!.name,
      user!.email,
      event.title!,
      bookingForm.ticketType,
      bookingData.quantity || bookingForm.quantity,
      "updated"
    );

    return updatedBookEventForm;
  }

  async deleteBookEvent(bookingId: string): Promise<IBookEventData | null> {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw httpMessages.BAD_REQUEST("Invalid bookingId format.");
    }

    const bookingFormToDelete = await BookEvent.findById(bookingId);
    if (!bookingFormToDelete) {
      throw httpMessages.NOT_FOUND("BookEvent form not found.");
    }

    const event = await Event.findById(bookingFormToDelete.eventId);
    if (!event) {
      throw httpMessages.NOT_FOUND("Event not found.");
    }

    const ticketType = event.ticketTypes?.find(
      (ticket) => ticket.type === bookingFormToDelete.ticketType
    );
    if (!ticketType) {
      throw httpMessages.BAD_REQUEST("Ticket type not found in event.");
    }

    ticketType.available += bookingFormToDelete.quantity;

    await event.save();

    // await userService.deleteUser(bookingFormToDelete.userId!.toString());

    const deletedBookEventForm = await BookEvent.findByIdAndDelete(bookingId);
    if (!deletedBookEventForm) {
      throw httpMessages.NOT_FOUND("BookEvent form not found.");
    }

    return deletedBookEventForm;
  }

  private async sendBookEventEmail(
    receiverName: string,
    receiverEmail: string,
    eventTitle: string,
    ticketType: string,
    quantity: number,
    action: "created" | "updated"
  ) {
    try {
      const subject =
        action === "created"
          ? `Event Confirmation: ${eventTitle}`
          : `Booking Update: ${eventTitle}`;

      const emailData = {
        sender: { name: "B.T.M.C. Events", email: ADMIN_EMAIL },
        recipient: { email: receiverEmail, name: receiverName },
        subject,
        htmlContent: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style type="text/css">
          /* Reset styles */
          body, table, td, div, p, a { margin: 0; padding: 0; }
          body { width: 100% !important; }
          
          /* Responsive styles */
          @media screen and (max-width: 600px) {
            .wrapper { width: 100% !important; }
            .mobile-padding { padding: 15px !important; }
            .logo { width: 120px !important; height: auto !important; }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f9fc;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table class="wrapper" role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <!-- Header -->
                <tr>
                  <td style="padding: 30px 40px; background-color: #b91c1c; border-radius: 8px 8px 0 0;">
                    <h1 style="color: #ffffff; font-size: 24px; margin: 0;">BTMC Events</h1>
                  </td>
                </tr>
                
                <!-- Main Content -->
                <tr>
                  <td class="mobile-padding" style="padding: 40px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 20px;">
                          <h2 style="color: #b91c1c; font-size: 20px; margin: 0;">Dear ${receiverName},</h2>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 20px; line-height: 1.6;">
                          <p style="font-size: 16px; color: #333; margin: 0;">
                            We're pleased to confirm that your booking for <strong>${eventTitle}</strong> has been successfully ${action}.
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Booking Details -->
                      <tr>
                        <td style="padding: 20px; background-color: #f8f9fa; border-radius: 6px; margin: 20px 0;">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="padding-bottom: 10px;">
                                <strong style="color: #b91c1c;">Booking Details:</strong>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-bottom: 5px;">
                                <span style="color: #666;">Ticket Type:</span> 
                                <strong style="color: #333;">${ticketType}</strong>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span style="color: #666;">Quantity:</span> 
                                <strong style="color: #333;">${quantity}</strong>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      
                      <!-- Additional Information -->
                      <tr>
                        <td style="padding-top: 20px; line-height: 1.6;">
                          <p style="color: #555; font-size: 16px; margin: 0;">
                            We're delighted to have you join us for this event. If you have any questions or need to make changes to your booking, please don't hesitate to contact our support team.
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Signature -->
                      <tr>
                        <td style="padding-top: 30px;">
                          <p style="color: #333; font-size: 16px; margin: 0;">Best regards,</p>
                          <p style="color: #b91c1c; font-weight: bold; font-size: 16px; margin: 5px 0 0 0;">The BTMC Events Team</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 20px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #eee;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" style="color: #666; font-size: 14px;">
                          <p style="margin: 0;">© ${new Date().getFullYear()} B.T.M.C. Foundation. All rights reserved.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
      };

      await sendEmail(emailData);
      console.log(
        `✅ Event booking email (${action}) sent to ${receiverEmail}`
      );
    } catch (error) {
      console.error("❌ Failed to send event booking email:", error);
    }
  }
}

export const bookEventService = new BookEventFormService();
