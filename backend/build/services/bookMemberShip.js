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
exports.bookMembershipService = void 0;
const _models_1 = require("@models");
const _services_1 = require("@services");
const HttpMessage_1 = require("@utils/HttpMessage");
const deleteFile_1 = require("@utils/deleteFile"); // Utility to delete old images
const mongoose_1 = __importDefault(require("mongoose"));
const BrevoMail_1 = require("@config/BrevoMail");
const env_1 = require("@config/env");
class BookMembershipService {
    createBookMembership(bookMembershipData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, phoneNumber, page, pageTitle, membershipId, amount, paymentMethod, mailingAddress, image, paymentScreenshot, } = bookMembershipData;
            const membership = yield _models_1.Membership.findById(membershipId);
            if (!membership) {
                throw HttpMessage_1.httpMessages.NOT_FOUND("Membership not found.");
            }
            const user = yield _services_1.userService.createUser({
                name,
                email,
                phoneNumber,
                page,
                pageTitle,
            });
            // Create membership booking
            const bookMembership = new _models_1.BookMembership({
                userId: user._id,
                image,
                paymentScreenshot,
                membershipId,
                amount,
                paymentMethod,
                mailingAddress,
            });
            yield bookMembership.save();
            yield this.sendBookMembershipEmail(user.name, user.email, membership.name, amount, paymentMethod, "created");
            return this.formatBookMembership(bookMembership);
        });
    }
    // Get all membership bookings
    getBookMemberships() {
        return __awaiter(this, void 0, void 0, function* () {
            const memberships = yield _models_1.BookMembership.find()
                .populate("userId")
                .populate("membershipId");
            return memberships.map(this.formatBookMembership);
        });
    }
    // Get a single membership booking by ID
    getBookMembershipById(bookMembershipId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(bookMembershipId)) {
                throw HttpMessage_1.httpMessages.BAD_REQUEST("Invalid bookMembershipId format.");
            }
            const bookMembership = yield _models_1.BookMembership.findById(bookMembershipId)
                .populate("userId")
                .populate("membershipId");
            if (!bookMembership) {
                throw HttpMessage_1.httpMessages.NOT_FOUND("Membership booking not found.");
            }
            return this.formatBookMembership(bookMembership);
        });
    }
    // Update a membership booking by ID
    updateBookMembership(bookMembershipId, bookMembershipData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(bookMembershipId)) {
                throw HttpMessage_1.httpMessages.BAD_REQUEST("Invalid bookMembershipId format.");
            }
            const existingMembership = yield _models_1.BookMembership.findById(bookMembershipId);
            if (!existingMembership) {
                throw HttpMessage_1.httpMessages.NOT_FOUND("Membership booking not found.");
            }
            // Handle image updates (delete old image if new one is provided)
            if (bookMembershipData.image) {
                if (bookMembershipData.image === "") {
                    // If empty string is sent, remove existing image
                    if (existingMembership.image) {
                        yield (0, deleteFile_1.deleteFile)(existingMembership.image);
                    }
                    bookMembershipData.image = ""; // Set empty
                }
                else if (!bookMembershipData.image.startsWith("/api/image/")) {
                    // If a new image is uploaded, delete the old one
                    if (existingMembership.image) {
                        yield (0, deleteFile_1.deleteFile)(existingMembership.image);
                    }
                }
            }
            // Handle paymentScreenshot updates similarly
            if (bookMembershipData.paymentScreenshot) {
                if (bookMembershipData.paymentScreenshot === "") {
                    if (existingMembership.paymentScreenshot) {
                        yield (0, deleteFile_1.deleteFile)(existingMembership.paymentScreenshot);
                    }
                    bookMembershipData.paymentScreenshot = "";
                }
                else if (!bookMembershipData.paymentScreenshot.startsWith("/api/image/")) {
                    if (existingMembership.paymentScreenshot) {
                        yield (0, deleteFile_1.deleteFile)(existingMembership.paymentScreenshot);
                    }
                }
            }
            // Validate membershipId if being updated
            let memberShipName;
            if (bookMembershipData.membershipId) {
                const membership = yield _models_1.Membership.findById(bookMembershipData.membershipId);
                if (!membership) {
                    throw HttpMessage_1.httpMessages.NOT_FOUND("Membership not found.");
                }
                memberShipName = membership.name;
            }
            const updatedBookMembership = yield _models_1.BookMembership.findByIdAndUpdate(bookMembershipId, bookMembershipData, { new: true });
            if (!updatedBookMembership) {
                throw HttpMessage_1.httpMessages.NOT_FOUND("Membership booking not found.");
            }
            const user = yield _services_1.userService.getUserById(updatedBookMembership.userId.toString());
            yield this.sendBookMembershipEmail(user.name, user.email, memberShipName, updatedBookMembership.amount, updatedBookMembership.paymentMethod, "updated");
            return this.formatBookMembership(updatedBookMembership);
        });
    }
    // Delete a membership booking by ID
    deleteBookMembership(bookMembershipId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(bookMembershipId)) {
                throw HttpMessage_1.httpMessages.BAD_REQUEST("Invalid bookMembershipId format.");
            }
            const bookMembershipToDelete = yield _models_1.BookMembership.findById(bookMembershipId);
            if (!bookMembershipToDelete) {
                throw HttpMessage_1.httpMessages.NOT_FOUND("Membership booking not found.");
            }
            // Delete images before deleting the membership
            if (bookMembershipToDelete.image) {
                yield (0, deleteFile_1.deleteFile)(bookMembershipToDelete.image);
            }
            if (bookMembershipToDelete.paymentScreenshot) {
                yield (0, deleteFile_1.deleteFile)(bookMembershipToDelete.paymentScreenshot);
            }
            const deletedBookMembership = yield _models_1.BookMembership.findByIdAndDelete(bookMembershipId);
            if (!deletedBookMembership) {
                throw HttpMessage_1.httpMessages.NOT_FOUND("Membership booking not found.");
            }
            yield _services_1.userService.deleteUser(deletedBookMembership.userId.toString());
            return deletedBookMembership;
        });
    }
    sendBookMembershipEmail(receiverName, receiverEmail, membershipTitle, amount, paymentMethod, action) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subject = action === "created"
                    ? `Welcome to ${membershipTitle}`
                    : `Membership Update: ${membershipTitle}`;
                const emailData = {
                    sender: { name: "B.T.M.C. Memberships", email: env_1.ADMIN_EMAIL },
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
            .membership-details { padding: 15px !important; }
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
                          <h1 style="color: #ffffff; font-size: 24px; margin: 0;">B.T.M.C. Memberships</h1>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Main Content -->
                <tr>
                  <td class="mobile-padding" style="padding: 40px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <!-- Welcome Message -->
                      <tr>
                        <td style="padding-bottom: 20px;">
                          <h2 style="color: #b91c1c; font-size: 20px; margin: 0;">Welcome, ${receiverName}!</h2>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 20px; line-height: 1.6;">
                          <p style="font-size: 16px; color: #333; margin: 0;">
                            ${action === "created"
                        ? `Thank you for becoming a member of our ${membershipTitle} program.`
                        : `Your ${membershipTitle} membership has been successfully updated.`}
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Membership Details -->
                      <tr>
                        <td class="membership-details" style="padding: 20px; background-color: #f8f9fa; border-radius: 6px; margin: 20px 0;">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="padding-bottom: 10px;">
                                <strong style="color: #b91c1c;">Membership Details:</strong>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-bottom: 10px;">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                  <tr>
                                    <td style="padding: 5px 0; color: #666;">Membership Type:</td>
                                    <td style="padding: 5px 0; color: #333; font-weight: bold;">${membershipTitle}</td>
                                  </tr>
                                  <tr>
                                    <td style="padding: 5px 0; color: #666;">Amount Paid:</td>
                                    <td style="padding: 5px 0; color: #333; font-weight: bold;">$${amount}</td>
                                  </tr>
                                  <tr>
                                    <td style="padding: 5px 0; color: #666;">Payment Method:</td>
                                    <td style="padding: 5px 0; color: #333; font-weight: bold;">${paymentMethod}</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      
                      <!-- Next Steps -->
                      <tr>
                        <td style="padding-top: 20px; line-height: 1.6;">
                          <p style="color: #555; font-size: 16px; margin: 0 0 20px 0;">
                            Here's what you can do next:
                          </p>
                          <ul style="color: #555; font-size: 16px; margin: 0 0 20px 20px; padding: 0;">
                            <li style="margin-bottom: 10px;">Access your member dashboard to view your benefits</li>
                            <li style="margin-bottom: 10px;">Update your preferences in your profile</li>
                            <li>Explore exclusive member content and offers</li>
                          </ul>
                        </td>
                      </tr>
                      
                      
                      <!-- Signature -->
                      <tr>
                        <td style="padding-top: 30px;">
                          <p style="color: #333; font-size: 16px; margin: 0;">Best regards,</p>
                          <p style="color: #b91c1c; font-weight: bold; font-size: 16px; margin: 5px 0 0 0;">B.T.M.C. Membership Team</p>
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
                            This email was sent to ${receiverEmail}. To update your email preferences, visit your account settings.
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
                console.log(`✅ Membership email (${action}) sent to ${receiverEmail}`);
            }
            catch (error) {
                console.error("Failed to send membership email:", error);
                throw error;
            }
        });
    }
    // Format membership with image URLs
    formatBookMembership(membership) {
        const membershipObj = membership.toObject();
        return Object.assign(Object.assign({}, membershipObj), { image: membershipObj.image ? `/api/image/${membershipObj.image}` : null, paymentScreenshot: membershipObj.paymentScreenshot
                ? `/api/image/${membershipObj.paymentScreenshot}`
                : null });
    }
}
exports.bookMembershipService = new BookMembershipService();
