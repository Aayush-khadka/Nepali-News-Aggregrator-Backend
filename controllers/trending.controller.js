import { Article } from "../models/article.model.js";

import { Trending } from "../models/trending.model.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getTrending = asynchandler(async (req, res) => {
  const getTitle = await Trending.find({}, { title: 1 });
  const titles = getTitle.map((article) => article.title);

  const trendingAtricles = [];

  for (let i = 0; i < 10; i++) {
    const newarticle = await Article.findOne({ title: titles[i] });
    if (newarticle) {
      trendingAtricles.push(newarticle);
    }
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        trendingAtricles,
        "Sucessfully got trending articles!!!"
      )
    );
});

export { getTrending };
