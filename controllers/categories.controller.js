import { Article } from "../models/article.model.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getPolitics = asynchandler(async (req, res) => {
  const articles = await Article.find({ tag: "Politics" })
    .sort({ scraptedAt: -1 })

  if (!articles || articles.length === 0) {
    throw new ApiError(404, "No articles found with 'Politcs' tag!");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        articles,
        "Successfully retrieved articles with 'Politics' tag!"
      )
    );
});

const getSociety = asynchandler(async (req, res) => {
  const articles = await Article.find({
    tag: { $in: ["society", "Kathmandu", "Lalitpur", "Bhaktapur"] },
  })
    .sort({ scraptedAt: -1 })
   
  if (!articles || articles.length === 0) {
    throw new ApiError(404, "No articles found with that tag!");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        articles,
        "Successfully retrieved articles with that tag!"
      )
    );
});

const getNational = asynchandler(async (req, res) => {
  const articles = await Article.find({ tag: { $in: ["National", "nation"] } })
    .sort({ scraptedAt: -1 })
    
  if (!articles || articles.length === 0) {
    throw new ApiError(404, "No articles found with that tag!");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        articles,
        "Successfully retrieved articles with that tag!"
      )
    );
});

const getScienceAndTech = asynchandler(async (req, res) => {
  const articles = await Article.find({ tag: { $in: ["science-tech"] } })
    .sort({ scraptedAt: -1 })
    
  if (!articles || articles.length === 0) {
    throw new ApiError(404, "No articles found with that tag!");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        articles,
        "Successfully retrieved articles with that tag!"
      )
    );
});

const getBusiness = asynchandler(async (req, res) => {
  const articles = await Article.find({ tag: { $in: ["Money", "business"] } })
    .sort({ scraptedAt: -1 })
    
  if (!articles || articles.length === 0) {
    throw new ApiError(404, "No articles found with that tag!");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        articles,
        "Successfully retrieved articles with that tag!"
      )
    );
});

const getOpinion = asynchandler(async (req, res) => {
  const articles = await Article.find({
    tag: { $in: ["editorial", "Editorial"] },
  })
    .sort({ scraptedAt: -1 })
   
  if (!articles || articles.length === 0) {
    throw new ApiError(404, "No articles found with that tag!");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        articles,
        "Successfully retrieved articles with that tag!"
      )
    );
});

const getSports = asynchandler(async (req, res) => {
  const articles = await Article.find({ tag: { $in: ["sports", "Sports"] } })
    .sort({ scraptedAt: -1 })
    
  if (!articles || articles.length === 0) {
    throw new ApiError(404, "No articles found with that tag!");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        articles,
        "Successfully retrieved articles with that tag!"
      )
    );
});

const getHealth = asynchandler(async (req, res) => {
  const articles = await Article.find({ tag: { $in: ["health"] } })
    .sort({ scraptedAt: -1 })
    
  if (!articles || articles.length === 0) {
    throw new ApiError(404, "No articles found with that tag!");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        articles,
        "Successfully retrieved articles with that tag!"
      )
    );
});
const getWorld = asynchandler(async (req, res) => {
  const articles = await Article.find({ tag: { $in: ["world"] } })
    .sort({ scraptedAt: -1 })
    
  if (!articles || articles.length === 0) {
    throw new ApiError(404, "No articles found with that tag!");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        articles,
        "Successfully retrieved articles with that tag!"
      )
    );
});

const getArtAndCulture = asynchandler(async (req, res) => {
  const articles = await Article.find({
    tag: {
      $in: [
        "Culture & Lifestyle",
        "life-and-art",
        "Movies",
        "Books",
        "Life & Style",
        "Arts",
      ],
    },
  })
    .sort({ scraptedAt: -1 })
 
  if (!articles || articles.length === 0) {
    throw new ApiError(404, "No articles found with that tag!");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        articles,
        "Successfully retrieved articles with that tag!"
      )
    );
});
export {
  getPolitics,
  getNational,
  getBusiness,
  getOpinion,
  getScienceAndTech,
  getSociety,
  getSports,
  getHealth,
  getWorld,
  getArtAndCulture,
};
