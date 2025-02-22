import mongoose, { Schema } from "mongoose";

const newsletterSchema = new Schema({
  newsletter: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

export const Newsletter = mongoose.model("Newsletter", newsletterSchema);
