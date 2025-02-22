// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// import fs from "fs";
// import path from "path";

// dotenv.config();

// const loadTemplate = (templateName) => {
//   try {
//     const templatePath = path.join(
//       process.cwd(),
//       "emailTemplates",
//       `${templateName}.html`
//     );
//     return fs.readFileSync(templatePath, "utf8");
//   } catch (error) {
//     console.error("Error loading email template:", error);
//     return null;
//   }
// };

// const sendEmail = async (email, subject, templateName, replacements = {}) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: process.env.HOST,
//       service: process.env.SERVICE,
//       port: Number(process.env.PORT),
//       secure: Boolean(process.env.SECURE),
//       auth: {
//         user: process.env.USER,
//         pass: process.env.PASS,
//       },
//     });

//     let htmlContent = loadTemplate(templateName);
//     if (!htmlContent) throw new Error("Template not found");

//     Object.keys(replacements).forEach((key) => {
//       const regex = new RegExp(`{{${key}}}`, "g");
//       htmlContent = htmlContent.replace(regex, replacements[key]);
//     });

//     await transporter.sendMail({
//       from: process.env.USER,
//       to: email,
//       subject: subject,
//       html: htmlContent,
//     });

//     console.log(`Successfully sent ${templateName} email to ${email}`);
//   } catch (error) {
//     console.error("Failed to send the email:", error);
//   }
// };

// export { sendEmail };

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
