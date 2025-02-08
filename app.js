import express from "express";
import cors from "cors";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//routes import
import articles from "./routes/articles.routes.js";
import categories from "./routes/categories.routes.js";
import bySource from "./routes/bySource.routes.js";
import search from "./routes/search.routes.js";

//routes Declaration
app.use("/api/v1/articles", articles);
app.use("/api/v1/category", categories);
app.use("/api/v1/by-source/", bySource);
app.use("/api/v1/search", search);

export default app;
