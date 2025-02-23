import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import ejs from "ejs";

dotenv.config();

const loadTemplate = async (templateName, replacements) => {
  try {
    const templatePath = path.join(
      process.cwd(),
      "emailTemplates",
      `${templateName}.ejs`
    );

    // Render EJS template with provided replacements
    return await ejs.renderFile(templatePath, replacements);
  } catch (error) {
    console.error("Error loading EJS email template:", error);
    return null;
  }
};

const sendEmail = async (email, subject, templateName, replacements = {}) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const htmlContent = await loadTemplate(templateName, replacements);
    if (!htmlContent) throw new Error("Template rendering failed");

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      html: htmlContent,
    });

    console.log(`Successfully sent ${templateName} email to ${email}`);
  } catch (error) {
    console.error("Failed to send the email:", error);
  }
};

export { sendEmail };
