import { APIError } from "groq-sdk";
import { Article } from "../models/article.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { SignupNewsletter } from "../models/signup.newsletter.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import generateVerificationToken from "../utils/generatetoken.js";
import { Newsletter } from "../models/newsletter.model.js";
import dotenv from "dotenv";
import { ApiError } from "../utils/ApiError.js";
import { generateCategoryNewsletter } from "../Logic/newsletter.js";
import { sendNewsletter } from "../newsletter/generate.newsletter.js";
dotenv.config();

const signupForNewsLetter = asynchandler(async (req, res) => {
  const email = req.body.email;
  const interests = req.body.interests;

  const checkIfAlreadySignedUP = await SignupNewsletter.findOne({ email });
  if (checkIfAlreadySignedUP) {
    // Change the response here to send a JSON message
    return res.status(400).json({
      success: false,
      message: "The Email is already Signed UP!!!",
    });
  }

  const token = generateVerificationToken();
  const addedemail = new SignupNewsletter({
    email,
    interests,
    verificationToken: token,
  });

  await addedemail.save();

  const verificationLink = ` https://thesamachar.vercel.app/verify?token=${token}`;

  const subject = "Email Verification for Newsletter";
  const text = `Please click the following link to verify your email: ${verificationLink}`;

  await sendEmail(email, subject, "verification", {
    verificationLink: verificationLink,
  });

  return res.status(200).json({
    success: true,
    message: "Verification Link Sent to Email!!",
  });
});

const verify = asynchandler(async (req, res) => {
  const { token } = req.query;

  try {
    const user = await SignupNewsletter.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Successfully Verified Email!!",
    });
  } catch (error) {
    console.error("Error during email verification:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to Verify Email!!",
    });
  }
});
const unsubscribeNewsletter = asynchandler(async (req, res) => {
  const email = req.body.email;

  const user = SignupNewsletter.findOne({ email: email });
  if (!user) {
    throw new ApiError(500, "User is not Signed UP!!!");
  }

  try {
    await SignupNewsletter.findOneAndDelete({ email: email });
  } catch (error) {
    throw new ApiError(500, "unable to Unsubscribe!!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "The user Unsubscribed Sucessfully!!!"));
});

const getNewsletters = asynchandler(async (req, res) => {
  const newsletters = await Newsletter.find();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        newsletters,
        "Sucessfully fetched all news letters!!!"
      )
    );
});

const changeinterests = asynchandler(async (req, res) => {
  //TODO: Make users able to Change Interests!!
});

const sendEmailNewsletter = asynchandler(async (req, res) => {
  console.log(
    `Running scheduled newsletter job at ${new Date().toISOString()}`
  );

  try {
    // Await the generateCategoryNewsletter and sendNewsletter calls
    await generateCategoryNewsletter();

    // If everything goes well, send the newsletter
    await sendNewsletter();

    console.log("Newsletter generated and sent successfully");

    // Respond with success
    return res
      .status(200)
      .json(new ApiResponse(200, "Sent Email Newsletter!!!"));
  } catch (err) {
    // Log error and throw custom ApiError if something goes wrong
    console.log("ERROR IN Sending NewsLetters ", err);
    throw new ApiError(500, "Failed to Send News letter!!!");
  }
});

export {
  signupForNewsLetter,
  verify,
  unsubscribeNewsletter,
  getNewsletters,
  sendEmailNewsletter,
};
