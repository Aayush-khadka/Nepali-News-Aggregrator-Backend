import express from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Article } from "../models/article.model.js";

const searchArticles = asynchandler(async (req, res) => {
  const searchQuery = req.query.q;

  if (!searchQuery) {
    return res.status(400).json({ message: "Search query is required!" });
  }

  const results = await Article.aggregate([
    {
      $search: {
        index: "News-Aggregrator",
        text: {
          query: searchQuery,
          path: ["title", "articleText"],
          fuzzy: { maxEdits: 2 },
        },
      },
    },
    {
      $addFields: {
        searchScore: { $meta: "searchScore" },
      },
    },
    {
      $sort: { publishedAt: -1, searchScore: -1 },
    },
    {
      $limit: 10,
    },
  ]);

  if (!results) {
    throw new ApiError(500, "Failed to Query Search!!!");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, results, "Successfully fetched Data!"));
});

export { searchArticles };
