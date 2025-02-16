import { APIError } from "groq-sdk";
import { Article } from "../models/article.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asyncHandler.js";

const getNewsletter = asynchandler(async (req, res) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newOneWeekAgo = oneWeekAgo.toISOString().split("T");
  const olddate = newOneWeekAgo[0];

  const today = new Date();
  const newtoday = today.toISOString().split("T");
  const datetoday = newtoday[0];

  try {
    const articles = await Article.find(
      {
        publishedTime: { $gte: olddate, $lte: datetoday },
        tag: { $in: ["national", "politics", "world", "sports"] },
      },
      { title: 1, articleText: 1, publishedTime: 1, tag: 1 }
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          articles,
          "Successfully fetched the data from a week ago!"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new APIError(500, "Failed to get the articles!"));
  }
});

export { getNewsletter };
