import { Article } from "../models/article.model.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getArticlesFromKathmanduPost = asynchandler(async (req, res) => {
  const articles = await Article.find({
    source: "The Kathmandu Post",
  });

  if (!articles || articles.lenght == 0) {
    throw new ApiError(404, "NO Articles from The Kathmandu Post");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        articles,
        "Sucessfully fetched all articles from The Kathmandu Post"
      )
    );
});

const getArticlesFromRisingNepal = asynchandler(async (req, res) => {
  const articles = await Article.find({
    source: "The Rising Nepal",
  });

  if (!articles || articles.lenght == 0) {
    throw new ApiError(404, "NO Articles from The Rising Nepal");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        articles,
        "Sucessfully fetched all articles from The Rising Nepal"
      )
    );
});

export { getArticlesFromKathmanduPost, getArticlesFromRisingNepal };
