import {
  EnrollmentForm,
  Course,
  IEnrollmentFormData,
  ICourse,
} from "../models";
import { userService } from "../services";
import { IEnrollmentFormInput, IEnrollementUpdate } from "../types";
import { httpMessages } from "../utils/HttpMessage";
import mongoose from "mongoose";
import { sendEmail } from "../config/BrevoMail";
import { ADMIN_EMAIL } from "../config/env";

class EnrollmentService {
  async createEnrollment(
    enrollmentData: IEnrollmentFormInput
  ): Promise<IEnrollmentFormData> {
    const { courseId, preferredLanguage, message } = enrollmentData;

    const course = await Course.findById(courseId);
    if (!course) {
      throw httpMessages.NOT_FOUND("Course category not found.");
    }

    const user = await userService.createUser({
      name: enrollmentData.name,
      email: enrollmentData.email,
      phoneNumber: enrollmentData.phoneNumber,
      address: enrollmentData.address,
      page: enrollmentData.page,
      pageTitle: enrollmentData.pageTitle,
    });

    // Create the enrollment record with user reference
    const enrollment = new EnrollmentForm({
      userId: user._id, // Associate the enrollment with the user
      preferredLanguage,
      message,
      courseId,
    });

    await enrollment.save();
    await this.sendEnrollmentEmail(
      user.name,
      user.email,
      course.title,
      course,
      "created"
    );

    return enrollment; // Return the created enrollment
  }

  async getEnrollments(): Promise<IEnrollmentFormData[]> {
    return await EnrollmentForm.find().populate("userId");
  }

  async getEnrollmentById(
    enrollmentId: string
  ): Promise<IEnrollmentFormData | null> {
    if (!mongoose.Types.ObjectId.isValid(enrollmentId)) {
      throw httpMessages.BAD_REQUEST("Invalid enrollmentId format.");
    }

    const enrollment = await EnrollmentForm.findById(enrollmentId).populate(
      "userId"
    );
    if (!enrollment) {
      throw httpMessages.NOT_FOUND("Enrollment not found.");
    }

    return enrollment;
  }

  async updateEnrollment(
    enrollmentId: string,
    enrollmentData: IEnrollementUpdate
  ): Promise<IEnrollmentFormData | null> {
    if (!mongoose.Types.ObjectId.isValid(enrollmentId)) {
      throw httpMessages.BAD_REQUEST("Invalid enrollmentId format.");
    }
    const { courseId } = enrollmentData;
    let courseTitle, course;
    if (courseId) {
      course = await Course.findById(courseId);
      if (!course) {
        throw httpMessages.NOT_FOUND("Course category not found.");
      }
      courseTitle = course.title;
    }

    const updatedEnrollment = await EnrollmentForm.findByIdAndUpdate(
      enrollmentId,
      enrollmentData,
      {
        new: true,
      }
    );

    if (!updatedEnrollment) {
      throw httpMessages.NOT_FOUND("Enrollment not found.");
    }

    const user = await userService.getUserById(
      updatedEnrollment.userId.toString()
    );

    await this.sendEnrollmentEmail(
      user!.name,
      user!.email,
      courseTitle!,
      course!,
      "updated"
    );

    return updatedEnrollment;
  }

  async deleteEnrollment(
    enrollmentId: string
  ): Promise<IEnrollmentFormData | null> {
    if (!mongoose.Types.ObjectId.isValid(enrollmentId)) {
      throw httpMessages.BAD_REQUEST("Invalid enrollmentId format.");
    }
    const enrollmentToDelete = await EnrollmentForm.findById(enrollmentId);

    if (!enrollmentToDelete) {
      throw httpMessages.NOT_FOUND("Enrollment not found.");
    }

    // await userService.deleteUser(enrollmentToDelete.userId.toString());

    const deletedEnrollment = await EnrollmentForm.findByIdAndDelete(
      enrollmentId
    );
    if (!deletedEnrollment) {
      throw httpMessages.NOT_FOUND("Enrollment not found.");
    }

    return deletedEnrollment;
  }

  private async sendEnrollmentEmail(
    receiverName: string,
    receiverEmail: string,
    categoryTitle: string,
    course: ICourse,
    action: "created" | "updated"
  ) {
    try {
      const subject =
        action === "created"
          ? `Welcome to ${course.title}`
          : `Enrollment Update: ${course.title}`;

      const emailData = {
        sender: { name: "B.T.M.C. Foundation", email: ADMIN_EMAIL },
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
            .course-details { padding: 15px !important; }
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
                          <h1 style="color: #ffffff; font-size: 24px; margin: 0;">B.T.M.C. Foundation</h1>
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
                            ${
                              action === "created"
                                ? "We're excited to confirm your enrollment in our educational program."
                                : "Your enrollment has been successfully updated."
                            }
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Course Details -->
                      <tr>
                        <td class="course-details" style="padding: 20px; background-color: #f8f9fa; border-radius: 6px; margin: 20px 0;">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="padding-bottom: 10px;">
                                <strong style="color: #b91c1c;">Course Information:</strong>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-bottom: 10px;">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                  <tr>
                                    <td style="padding: 5px 0; color: #666;">Course:</td>
                                    <td style="padding: 5px 0; color: #333; font-weight: bold;">${
                                      course.title
                                    }</td>
                                  </tr>
                                  <tr>
                                    <td style="padding: 5px 0; color: #666;">Category:</td>
                                    <td style="padding: 5px 0; color: #333; font-weight: bold;">${categoryTitle}</td>
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
                            <li style="margin-bottom: 10px;">Access your course materials in the learning portal</li>
                            <li style="margin-bottom: 10px;">Review the course schedule and important dates</li>
                            <li>Connect with your instructors and fellow students</li>
                          </ul>
                        </td>
                      </tr>
                      
                      
                      <!-- Learning Support -->
                      <tr>
                        <td style="padding-top: 30px; line-height: 1.6;">
                          <p style="color: #555; font-size: 16px; margin: 0;">
                            If you need any assistance or have questions about your course, our support team is here to help you succeed in your learning journey.
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Signature -->
                      <tr>
                        <td style="padding-top: 30px;">
                          <p style="color: #333; font-size: 16px; margin: 0;">Best regards,</p>
                          <p style="color: #b91c1c; font-weight: bold; font-size: 16px; margin: 5px 0 0 0;">The B.T.M.C. Foundation Team</p>
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
                            This email was sent to ${receiverEmail}. To manage your learning preferences, visit your student dashboard.
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
      console.log(`✅ Enrollment email (${action}) sent to ${receiverEmail}`);
    } catch (error) {
      console.error("Failed to send enrollment email:", error);
      throw error;
    }
  }
}

export const enrollmentService = new EnrollmentService();
