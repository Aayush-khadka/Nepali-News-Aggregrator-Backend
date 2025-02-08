import { Article } from "../models/article.model.js";
import { Trending } from "../models/trending.model.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getTrending = asynchandler(async (req, res) => {
  // Fetch trending titles
  const trendingTitles = await Trending.find({}, { title: 1 }).lean();
  if (!trendingTitles.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No trending articles found!"));
  }

  // Extract title list
  const titles = trendingTitles.map((article) => article.title);

  // Fetch matching articles in one query
  let trendingArticles = await Article.find({ title: { $in: titles } }).lean();

  // If less than 10 articles were found, fill with other recent articles
  if (trendingArticles.length < 10) {
    const additionalArticles = await Article.find({ title: { $nin: titles } })
      .sort({ createdAt: -1 }) // Get the most recent articles
      .limit(10 - trendingArticles.length)
      .lean();

    trendingArticles = [...trendingArticles, ...additionalArticles];
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        trendingArticles,
        "Successfully fetched trending articles!"
      )
    );
});

export { getTrending };
