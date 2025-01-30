import { Article } from "../models/article.model.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getArticles = asynchandler(async (req, res) => {
  const articles = await Article.find({}).sort({ scraptedAt: -1 }).exec();
  if (!articles || articles.length === 0) {
    throw new ApiError(404, "No articles found!");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, articles, "Successfully retrieved articles!"));
});

const getSpecificArticle = asynchandler(async (req, res) => {
  const id = req.params.id;
  const article = await Article.findById(id).exec();
  if (!article || article.length === 0) {
    throw new ApiError(404, "No article found!");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, article, "Successfully retrieved the article!"));
});

export { getArticles, getSpecificArticle };
