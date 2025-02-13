import { Article } from "../models/article.model.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getPolitics = asynchandler(async (req, res) => {
  const articles = await Article.find({ tag: "politics" }).sort({
    scraptedAt: -1,
  });

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
    tag: { $in: ["society", "kathmandu", "Lalitpur", "Bhaktapur"] },
  }).sort({ scraptedAt: -1 });

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
  const articles = await Article.find({
    tag: { $in: ["national", "nation"] },
  }).sort({ scraptedAt: -1 });

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
  const articles = await Article.find({
    tag: { $in: ["science-tech", "science-technology"] },
  }).sort({
    scraptedAt: -1,
  });

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
  const articles = await Article.find({
    tag: { $in: ["money", "business"] },
  }).sort({ scraptedAt: -1 });

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
    tag: { $in: ["editorial", "Editorial", "investigations"] },
  }).sort({ scraptedAt: -1 });

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
  const articles = await Article.find({
    tag: { $in: ["sports"] },
  }).sort({ scraptedAt: -1 });

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
  const articles = await Article.find({
    tag: { $in: ["health", "climate-environment"] },
  }).sort({
    scraptedAt: -1,
  });

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
  const articles = await Article.find({ tag: { $in: ["world"] } }).sort({
    scraptedAt: -1,
  });

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
      $in: ["art-culture", "life-and-art"],
    },
  }).sort({ scraptedAt: -1 });

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
