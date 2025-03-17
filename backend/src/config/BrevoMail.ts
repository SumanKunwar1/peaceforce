var SibApiV3Sdk = require("sib-api-v3-typescript");
import { BREVO_API_KEY } from "./env";

// Update the sendEmail function to accept dynamic parameters for email
export async function sendEmail(dataToMail: {
  sender: { name: string; email: string };
  recipient: { email: string; name: string };
  subject: string;
  htmlContent: string;
}) {
  try {
    console.log("Initializing Brevo API...");

    // Create API instance
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    console.log("API instance created:", apiInstance);

    // Set API Key
    apiInstance.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      BREVO_API_KEY
    );
    console.log("API Key set successfully.");

    // Define email parameters dynamically
    const emailData = {
      sender: dataToMail.sender,
      to: [dataToMail.recipient], // Recipient info
      subject: dataToMail.subject, // Dynamic subject
      htmlContent: dataToMail.htmlContent, // Dynamic HTML content
    };

    console.log("Email data prepared:", emailData);

    // Send email
    const response = await apiInstance.sendTransacEmail(emailData);
    console.log(
      "✅ Email sent successfully:",
      JSON.stringify(response, null, 2)
    );
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
}
