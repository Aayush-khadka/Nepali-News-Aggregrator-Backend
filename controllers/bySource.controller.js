import { Article } from "../models/article.model.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getArticlesFromKathmanduPost = asynchandler(async (req, res) => {
  const page = parseInt(req.params.page) || 1;
  const limit = parseInt(req.params.limit) || 10;

  const articles = {};
  articles.result = await Article.find({
    source: "The Kathmandu Post",
  })
    .skip((page - 1) * limit)
    .limit(limit);

  const totalDocuments = await Article.countDocuments();
  if (page * limit < totalDocuments) {
    articles.next = {
      page: page + 1,
      limit: limit,
    };
  }
  if (page < 1) {
    articles.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  if (!articles.result || articles.result.length == 0) {
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
  const page = parseInt(req.params.page) || 1;
  const limit = parseInt(req.params.limit) || 10;
  const articles = {};
  articles.result = await Article.find({
    source: "The Rising Nepal",
  })
    .skip((page - 1) * limit)
    .limit(limit);
  const totalDocuments = await Article.countDocuments();
  if (page * limit < totalDocuments) {
    articles.next = {
      page: page + 1,
      limit: limit,
    };
  }
  if (page < 1) {
    articles.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  if (!articles.result || articles.result.length == 0) {
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
