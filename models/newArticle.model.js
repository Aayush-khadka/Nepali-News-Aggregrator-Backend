import mongoose, { Schema } from "mongoose";

const newArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  publishedTime: {
    type: String,
  },
});

export const NewArticle = mongoose.model("NewArticle", newArticleSchema);
