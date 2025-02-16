import mongoose from "mongoose";
import { Article } from "./models/article.model.js";

const MONGO_URI =
  "mongodb+srv://Aayush:Aayushpass123@nepali-news-aggregrator.iexah.mongodb.net/?retryWrites=true&w=majority&appName=Nepali-News-Aggregrator"; // Replace with your actual MongoDB URI

async function deleteAllArticles() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected successfully!");

    const result = await Article.deleteMany({});
    console.log(`Deleted ${result.deletedCount} articles.`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  } catch (error) {
    console.error("Error deleting articles:", error);
  }
}

deleteAllArticles();
