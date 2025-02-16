import "dotenv/config";
import { Groq } from "groq-sdk";
import { NewArticle } from "../models/newArticle.model.js";
import { Trending } from "../models/trending.model.js";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY2 });

const getArticleTitles = async () => {
  const prevTrendingArticles = await Trending.find({}, { title: 1 });
  const prevTrendingTitles = prevTrendingArticles.map(
    (article) => article.title
  );

  await Trending.deleteMany({}).then(() => {
    console.log("Deleted The Previous Trending List!!!");
  });

  const articles = await NewArticle.find({}, { title: 1, publishedTime: 1 });
  const titles = articles.map((article) => article.title);

  const prompt = `
Analyze the following news headlines and return ONLY a list of the top 10 most trending article titles, ordered by relevance and impact. Do not include any additional text, explanations, or JSON formatting. Just return the titles as a plain list, with no numbering or introductory phrases.

**Prioritization and Selection Criteria:**

1.  **Nepal Focus (Highest Weight):** Prioritize news directly impacting Nepal, its politics, or its national affairs.
2.  **Impact and Urgency:** Favor articles about significant events, accidents, surprising developments, or breaking news.
3.  **Relevance and Timeliness:** Consider the current news cycle and select articles that are most relevant to current discussions and events.
4.  **Category Diversity:** Ensure the final list represents a diverse range of news categories (politics, business, international, etc.). Avoid over-representation of any single category.
5.  **Novelty and Uniqueness:** Avoid including articles with very similar titles or covering the same core story from the same angle. Aim for unique perspectives and developments.
6.  **Trending Potential:** Evaluate each article's potential to generate discussion and interest based on its headline and subject matter.
7.  **Previous Trending Articles (Context):** Consider the following list of previously trending articles. Include them in the new list ONLY if they remain highly relevant and impactful due to ongoing developments or sustained interest try to not include that much unless enough articles are not met.
8. ** News older than 1 days should not make it to the trending**

Previous Trending Titles:
${prevTrendingTitles}

News Titles:
${titles}
`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });
    const titlesString = response.choices[0].message.content.trim();

    const trendingTitles = titlesString
      .split("\n")
      .map((title) => title.trim());

    console.log(trendingTitles);

    const validTrendingTitles = trendingTitles.slice(0, 10);

    const trendingDocs = validTrendingTitles.map((title, index) => ({
      title: title,
      order: index + 1,
    }));

    await Trending.insertMany(trendingDocs);

    await NewArticle.deleteMany({}).then(() => {
      console.log("Deleted all the Titles!!!");
    });

    return trendingTitles;
  } catch (error) {
    console.error("Error fetching data from Groq:", error);
    throw error;
  }
};

export default getArticleTitles;
