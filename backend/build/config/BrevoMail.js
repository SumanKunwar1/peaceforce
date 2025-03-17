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
exports.sendEmail = sendEmail;
var SibApiV3Sdk = require("sib-api-v3-typescript");
const env_1 = require("./env");
// Update the sendEmail function to accept dynamic parameters for email
function sendEmail(dataToMail) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Initializing Brevo API...");
            // Create API instance
            const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
            console.log("API instance created:", apiInstance);
            // Set API Key
            apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, env_1.BREVO_API_KEY);
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
            const response = yield apiInstance.sendTransacEmail(emailData);
            console.log("✅ Email sent successfully:", JSON.stringify(response, null, 2));
        }
        catch (error) {
            console.error("❌ Error sending email:", error);
        }
    });
}
