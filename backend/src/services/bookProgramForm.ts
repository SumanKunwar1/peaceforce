import { BookProgram, IBookProgramData, IUser, Program } from "../models";
import { userService, programService } from "../services";
import { IBookProgramFormInput, IBookProgramFormUpdate } from "../types";
import { httpMessages } from "../utils/HttpMessage";
import mongoose from "mongoose";

import { sendEmail } from "../config/BrevoMail";
import { ADMIN_EMAIL } from "../config/env";

class BookProgramFormService {
  async createBookProgram(
    bookingData: IBookProgramFormInput
  ): Promise<IBookProgramData> {
    const { programId, participants, specialRequirements } = bookingData;

    const program = await Program.findById(programId);
    if (!Program) {
      throw httpMessages.NOT_FOUND("Program");
    }

    const user = await userService.createUser({
      name: bookingData.name,
      email: bookingData.email,
      phoneNumber: bookingData.phoneNumber,
      page: bookingData.page,
      pageTitle: bookingData.pageTitle,
    });

    const bookingForm = new BookProgram({
      userId: user._id,
      programId,
      participants,
      specialRequirements,
    });

    await bookingForm.save();

    await this.sendBookProgramEmail(
      user.name,
      user.email,
      program!.title,
      bookingForm.participants,
      "created"
    );

    return bookingForm;
  }

  async getBookPrograms(): Promise<IBookProgramData[]> {
    return await BookProgram.find().populate("userId");
  }

  async getBookProgramById(
    bookingId: string
  ): Promise<IBookProgramData | null> {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw httpMessages.BAD_REQUEST("Invalid bookingId format.");
    }

    const bookingForm = await BookProgram.findById(bookingId).populate(
      "userId"
    );
    if (!bookingForm) {
      throw httpMessages.NOT_FOUND("BookProgram form not found.");
    }

    return bookingForm;
  }

  async updateBookProgram(
    bookingId: string,
    bookingData: IBookProgramFormUpdate
  ): Promise<IBookProgramData | null> {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw httpMessages.BAD_REQUEST("Invalid bookingId format.");
    }

    const updatedBookingForm = await BookProgram.findByIdAndUpdate(
      bookingId,
      bookingData,
      {
        new: true,
      }
    );

    if (!updatedBookingForm) {
      throw httpMessages.NOT_FOUND("BookProgram form not found.");
    }

    const user = await userService.getUserById(
      updatedBookingForm.userId.toString()
    );
    const program = await programService.getProgramById(
      updatedBookingForm.toString()
    );

    // Send email notification for update
    await this.sendBookProgramEmail(
      user!.name,
      user!.email,
      program!.title,
      updatedBookingForm.participants,
      "updated"
    );
    return updatedBookingForm;
  }

  async deleteBookProgram(bookingId: string): Promise<IBookProgramData | null> {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw httpMessages.BAD_REQUEST("Invalid bookingId format.");
    }

    const bookingFormToDelete = await BookProgram.findById(bookingId);
    if (!bookingFormToDelete) {
      throw httpMessages.NOT_FOUND("BookProgram form not found.");
    }

    const deletedBookingForm = await BookProgram.findByIdAndDelete(bookingId);
    if (!deletedBookingForm) {
      throw httpMessages.NOT_FOUND("BookProgram form not found.");
    }

    // await userService.deleteUser(bookingFormToDelete.userId!.toString());

    return deletedBookingForm;
  }

  private async sendBookProgramEmail(
    receiverName: string,
    receiverEmail: string,
    programTitle: string,
    participants: number,
    action: "created" | "updated"
  ) {
    try {
      const subject =
        action === "created"
          ? `Program Confirmation: ${programTitle}`
          : `Program Update: ${programTitle}`;

      const emailData = {
        sender: { name: "B.T.M.C. Programs", email: ADMIN_EMAIL },
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
            .program-details { padding: 15px !important; }
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
                          <h1 style="color: #ffffff; font-size: 24px; margin: 0;">B.T.M.C. Programs</h1>
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
                          <h2 style="color: #b91c1c; font-size: 20px; margin: 0;">Dear ${receiverName},</h2>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 20px; line-height: 1.6;">
                          <p style="font-size: 16px; color: #333; margin: 0;">
                            ${
                              action === "created"
                                ? `Thank you for registering for our ${programTitle} program.`
                                : `Your registration for ${programTitle} has been successfully updated.`
                            }
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Program Details -->
                      <tr>
                        <td class="program-details" style="padding: 20px; background-color: #f8f9fa; border-radius: 6px; margin: 20px 0;">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="padding-bottom: 10px;">
                                <strong style="color: #b91c1c;">Program Details:</strong>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-bottom: 10px;">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                  <tr>
                                    <td style="padding: 5px 0; color: #666;">Program:</td>
                                    <td style="padding: 5px 0; color: #333; font-weight: bold;">${programTitle}</td>
                                  </tr>
                                  <tr>
                                    <td style="padding: 5px 0; color: #666;">Number of Participants:</td>
                                    <td style="padding: 5px 0; color: #333; font-weight: bold;">${participants}</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      
                      <!-- Important Information -->
                      <tr>
                        <td style="padding-top: 20px; line-height: 1.6;">
                          <p style="color: #555; font-size: 16px; margin: 0 0 20px 0;">
                            Important Information:
                          </p>
                          <ul style="color: #555; font-size: 16px; margin: 0 0 20px 20px; padding: 0;">
                            <li style="margin-bottom: 10px;">Please arrive 15 minutes before the scheduled start time</li>
                            <li style="margin-bottom: 10px;">Bring any required materials or equipment</li>
                            <li>Feel free to contact us if you have any questions</li>
                          </ul>
                        </td>
                      </tr>
                      
                      
                      <!-- Signature -->
                      <tr>
                        <td style="padding-top: 30px;">
                          <p style="color: #333; font-size: 16px; margin: 0;">Best regards,</p>
                          <p style="color: #b91c1c; font-weight: bold; font-size: 16px; margin: 5px 0 0 0;">The B.T.M.C. Programs Team</p>
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
                            This email was sent to ${receiverEmail}. To manage your program registrations, visit your account settings.
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

      await sendEmail(emailData);
      console.log(
        `✅ Program booking email (${action}) sent to ${receiverEmail}`
      );
    } catch (error) {
      console.error("Failed to send program booking email:", error);
      throw error;
    }
  }
}

export const bookProgramService = new BookProgramFormService();
