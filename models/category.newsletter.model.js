import mongoose, { Schema } from "mongoose";

const newsletterCategorySchema = new Schema({
  newsletter: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

export const CategoryNewsletter = mongoose.model(
  "CategoryNewsletter",
  newsletterCategorySchema
);
