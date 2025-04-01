const { createClient } = require("smtpexpress");
const validator = require("validator");
const logger = require("./logger");

const smtpexpressClient = createClient({
  projectId: process.env.SMTPEXPRESS_PROJECT_ID,
  projectSecret: process.env.SMTPEXPRESS_PROJECT_SECRET,
});

const requiredEnvVars = ["FROM_NAME", "FROM_EMAIL"];
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

const sendEmail = async (options) => {
  if (!validator.isEmail(options.email)) {
    throw new Error("Invalid email address");
  }

  const emailData = {
    recipients: { email: options.email, name: options.name || "User " },
    sender: {
      name: process.env.FROM_NAME || "Default Sender Name",
      email: process.env.FROM_EMAIL || "default@example.com",
    },
    subject: options.subject,
    message: options.isHtml ? undefined : options.message,
    htmlMessage: options.isHtml ? options.message : undefined,
  };

  if (!emailData.message && !emailData.htmlMessage) {
    throw new Error("Email body is missing. Please provide a valid message or htmlMessage.");
  }

  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await smtpexpressClient.sendApi.sendMail(emailData);
      logger.info("Email sent successfully");
      return;
    } catch (err) {
      retries++;
      logger.error(`Attempt ${retries}: SMTPExpress sendMail failed:`, err.response?.data || err.message || err);
      if (retries === maxRetries) {
        throw new Error("Email sending failed after multiple attempts");
      }
    }
  }
};
module.exports = sendEmail;
