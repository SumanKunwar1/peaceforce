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
exports.bookingFormService = void 0;
const _models_1 = require("@models");
const _services_1 = require("@services");
const HttpMessage_1 = require("@utils/HttpMessage");
const mongoose_1 = __importDefault(require("mongoose"));
const BrevoMail_1 = require("@config/BrevoMail");
const env_1 = require("@config/env");
class BookingFormService {
    createBookingForm(bookingFormData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { participants, specialRequests, tourId, name, email, phoneNumber, page, pageTitle, } = bookingFormData;
            // Validate the tourId
            const tour = yield _models_1.Tour.findById(tourId);
            if (!tour) {
                throw HttpMessage_1.httpMessages.NOT_FOUND("Tour not found.");
            }
            const user = yield _services_1.userService.createUser({
                name,
                email,
                phoneNumber,
                page,
                pageTitle,
            });
            const bookingForm = new _models_1.BookingForm({
                userId: user._id,
                participants,
                specialRequests,
                tourId,
            });
            yield bookingForm.save();
            const BookingFormDataMail = yield this.getBookingFormById(bookingForm._id.toString());
            // Send booking confirmation email
            yield this.sendBookingConfirmationEmail(user.name, user.email, tour, BookingFormDataMail, "created");
            return bookingForm;
        });
    }
    getBookingForms() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _models_1.BookingForm.find().populate("userId");
        });
    }
    getBookingFormById(bookingFormId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(bookingFormId)) {
                throw HttpMessage_1.httpMessages.BAD_REQUEST("Invalid bookingFormId format.");
            }
            const bookingForm = yield _models_1.BookingForm.findById(bookingFormId).populate("userId");
            if (!bookingForm) {
                throw HttpMessage_1.httpMessages.NOT_FOUND("Booking form not found.");
            }
            return bookingForm;
        });
    }
    updateBookingForm(bookingFormId, bookingFormData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(bookingFormId)) {
                throw HttpMessage_1.httpMessages.BAD_REQUEST("Invalid bookingFormId format.");
            }
            if (bookingFormData.tourId) {
                const tour = yield _models_1.Tour.findById(bookingFormData.tourId);
                if (!tour) {
                    throw HttpMessage_1.httpMessages.NOT_FOUND("Tour not found.");
                }
            }
            const updatedBookingForm = yield _models_1.BookingForm.findByIdAndUpdate(bookingFormId, bookingFormData, { new: true });
            if (!updatedBookingForm) {
                throw HttpMessage_1.httpMessages.NOT_FOUND("Booking form not found.");
            }
            // Send booking update confirmation email
            const user = yield _services_1.userService.getUserById(updatedBookingForm.userId.toString());
            const tour = yield _models_1.Tour.findById(updatedBookingForm.tourId);
            const BookingFormDataMail = yield this.getBookingFormById(updatedBookingForm._id.toString());
            yield this.sendBookingConfirmationEmail(user.name, user.email, tour, BookingFormDataMail, "updated");
            return updatedBookingForm;
        });
    }
    deleteBookingForm(bookingFormId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(bookingFormId)) {
                throw HttpMessage_1.httpMessages.BAD_REQUEST("Invalid bookingFormId format.");
            }
            const bookingFormToDelete = yield _models_1.BookingForm.findById(bookingFormId);
            if (!bookingFormToDelete) {
                throw HttpMessage_1.httpMessages.NOT_FOUND("Booking form not found.");
            }
            const deletedBookingForm = yield _models_1.BookingForm.findByIdAndDelete(bookingFormId);
            if (!deletedBookingForm) {
                throw HttpMessage_1.httpMessages.NOT_FOUND("Booking form not found.");
            }
            return deletedBookingForm;
        });
    }
    sendBookingConfirmationEmail(receiverName, receiverEmail, tour, bookingData, action) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subject = action === "created"
                    ? `Tour Confirmation: ${tour.title}`
                    : `Booking Update: ${tour.title}`;
                const emailData = {
                    sender: { name: "B.T.M.C. Tours", email: env_1.ADMIN_EMAIL },
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
            .booking-details { padding: 15px !important; }
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
                  <td style="padding: 30px 40px; background: linear-gradient(135deg, #2E86C1 0%, #1a5276 100%); border-radius: 8px 8px 0 0;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td>
                          <h1 style="color: #ffffff; font-size: 24px; margin: 0;">B.T.M.C. Tours</h1>
                        </td>
                      </tr>
                    </table>
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
                            We're delighted to confirm that your booking for the <strong>${tour.title}</strong> tour has been successfully ${action}.
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Booking Details -->
                      <tr>
                        <td class="booking-details" style="padding: 20px; background-color: #f8f9fa; border-radius: 6px; margin: 20px 0;">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="padding-bottom: 10px;">
                                <strong style="color: #b91c1c;">Tour Details:</strong>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-bottom: 10px; line-height: 1.6;">
                                <p style="margin: 0;">Start Date: ${tour.startDate}</p>
                                <p style="margin: 0;">Tour: ${tour.title}</p>
                              </td>

                            </tr>
                            <tr>
                              <td style="padding-bottom: 10px; line-height: 1.6;">                              
                                <p style="margin: 0;">Days: ${tour.days}</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-bottom: 10px; line-height: 1.6;">                              
                                <p style="margin: 0;">Days: ${tour.duration}</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-bottom: 10px; line-height: 1.6;">                              
                                <p style="margin: 0;">Days: ${tour.location}</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-bottom: 10px; line-height: 1.6;">
                                <p style="margin: 0;">Participants: ${bookingData.participants}</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-bottom: 10px; line-height: 1.6;">
                                <p style="margin: 0;">Special Requests: ${bookingData.specialRequests || "None"}</p>
                              </td>
                              </tr>
                          </table>
                        </td>
                      </tr>
                      
                      <!-- Additional Information -->
                      <tr>
                        <td style="padding-top: 20px; line-height: 1.6;">
                          <p style="color: #555; font-size: 16px; margin: 0 0 20px 0;">
                            Please keep this email for your records. If you need to make any changes to your booking or have any questions, our customer service team is here to help.
                          </p>
                          <p style="color: #555; font-size: 16px; margin: 0;">
                            We look forward to providing you with an unforgettable tour experience.
                          </p>
                        </td>
                      </tr>
                      
                    
                      
                      <!-- Signature -->
                      <tr>
                        <td style="padding-top: 30px;">
                          <p style="color: #333; font-size: 16px; margin: 0;">Best regards,</p>
                          <p style="color: #b91c1c; font-weight: bold; font-size: 16px; margin: 5px 0 0 0;">The B.T.M.C. Foundation</p>
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
                          <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} B.T.M.C. Foundation. All rights reserved.</p>
                          <p style="margin: 0; font-size: 12px;">
                            This email was sent to ${receiverEmail}. Please do not reply to this email.
                          </p>
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
                yield (0, BrevoMail_1.sendEmail)(emailData);
                console.log(`✅ Tour booking email (${action}) sent to ${receiverEmail}`);
            }
            catch (error) {
                console.error("Failed to send tour booking email:", error);
                throw error;
            }
        });
    }
}
exports.bookingFormService = new BookingFormService();
