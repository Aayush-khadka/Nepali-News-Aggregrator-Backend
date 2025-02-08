import { Article } from "../models/article.model.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getArticles = asynchandler(async (req, res) => {
  const page  =  parseInt(req.query.page)||1;
  const limit  =  parseInt(req.query.limit)||10;
  const articles = {}
 articles.results =  await Article.find({}).sort({ scraptedAt: -1 }).skip((page-1)*limit).limit(limit).exec() ;

 const totalDocuments = await Article.countDocuments()

if(page*limit<totalDocuments){

  articles.next = {
    page:page+1,
    limit: limit
  }
}
  if(page < 1){
    articles.previous = {
      page:page> 1 ? page-1 : null,
      limit:limit
    }
  }
  if (!articles.results || articles.results.length === 0) {
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
