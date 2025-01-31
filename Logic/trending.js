import "dotenv/config";
import { Groq } from "groq-sdk";
import { NewArticle } from "../models/newArticle.model.js";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const getArticleTitles = async () => {
  const articles = await NewArticle.find({}, { title: 1 });
  const titles = articles.map((article) => article.title);
  const rankTrendingNews = async (titles) => {
    const prompt = `
  Analyze the following news headlines and score each from 1 to 10 based on trendiness, relevance, and impact.
  Return ONLY a JSON array in this format (without extra text):
  [
    { "title": "Winter session of federal parliament tomorrow", "score": 9 },
    { "title": "Maoist Center to reject ordinances", "score": 8 }
  ]
  News Titles:
  ${titles}
  `;
    try {
      const response = await groq.chat.completions.create({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });
      const jsonString = response.choices[0].message.content.trim();
      if (!jsonString.startsWith("[") || !jsonString.endsWith("]")) {
        throw new Error("Invalid JSON response from Groq.");
      }
      const result = JSON.parse(jsonString);
      result.sort((a, b) => b.score - a.score);
      const topTrending = result.slice(0, 7);
      console.log("Top 7 Trending Articles:");
      console.table(topTrending);
    } catch (error) {
      console.error("Error fetching data from Groq:", error);
    }
  };

  // Run ranking function
  rankTrendingNews(articles);
};

export default getArticleTitles;
