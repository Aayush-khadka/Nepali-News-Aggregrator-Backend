import mongoose, { Schema } from "mongoose";

const signupNewsletterScheam = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  interests: {
    type: Array,
    required: true,
    trim: true,
  },
  verificationToken: {
    type: String,
  },
});

export const SignupNewsletter = mongoose.model(
  "SignupNewsletter",
  signupNewsletterScheam
);
