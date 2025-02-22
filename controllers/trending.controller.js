import { Article } from "../models/article.model.js";
import { Trending } from "../models/trending.model.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getTrendingArticles = asynchandler(async (req, res) => {
  const trendingTitles = await Trending.find({}, { title: 1, order: 1 })
    .sort({ order: 1 })
    .lean();

  if (!trendingTitles.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No trending articles found!"));
  }

  const titles = trendingTitles.map((article) =>
    article.title.replace(/^\d+\.\s*/, "")
  );

  let trendingArticles = await Article.find({ title: { $in: titles } }).lean();

  trendingArticles.sort((a, b) => {
    const indexA = titles.indexOf(a.title);
    const indexB = titles.indexOf(b.title);
    return indexA - indexB;
  });

  trendingArticles = [...trendingArticles];

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

export { getTrendingArticles };
