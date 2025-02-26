import "dotenv/config";
import OpenAI from "openai";
import { Article } from "../models/article.model.js";
import { CategoryNewsletter } from "../models/category.newsletter.model.js";
import { Newsletter } from "../models/newsletter.model.js";

const openai = new OpenAI({
  baseURL: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_KEY,
  defaultHeaders: { "api-key": process.env.AZURE_OPENAI_KEY },
});

const generateCategoryNewsletter = async () => {
  const categories = [
    "national",
    "politics",
    "world",
    "sports",
    "money",
    "health",
    "valley",
    "science-technology",
    "opinion",
    "art-culture",
  ];

  await CategoryNewsletter.deleteMany({});
  console.log("==================================================");
  console.log("Deleted The Previous NewsLetter!!!");
  console.log("==================================================");

  const today = new Date();
  const dayOfWeek = today.getDay();

  let olddate;
  if (dayOfWeek === 3) {
    olddate = new Date();
    olddate.setDate(today.getDate() - 4);
  } else if (dayOfWeek === 6) {
    olddate = new Date();
    olddate.setDate(today.getDate() - 3);
  } else {
    console.error("This script should only run on Wednesdays or Saturdays.");
    process.exit(1);
  }

  const olddateString = olddate.toISOString().split("T")[0];
  const todayString = today.toISOString().split("T")[0];

  for (const category of categories) {
    const articles = await Article.find(
      {
        publishedTime: { $gte: olddateString, $lte: todayString },
        tag: { $in: [category] },
      },
      { title: 1, summary: 1, _id: 0 }
    );

    if (articles.length === 0) continue;

    const prompt = `Task: Write a weekly recap for the ${category} section of our newsletter using the provided article titles and summaries.

Guidelines:

    Select the five most important stories from the past week. If multiple articles cover the same topic, merge them into a single, well-structured summary.
    The recap should have a title and be written in paragraph format rather than a list.
    The text should flow naturally and be easy to read. Each section should be standalone, as it will be combined with other categories.
    Ensure the output has a clear separation between the title and the content so it can be split later.
    Do not include any formatting, metadata, or extra elements—just the newsletter content.
    Don't even say "This is the weekly recap of this category" in the beginning—just the main content only.

Input:
Category: ${category}
Articles (titles and summaries):
${JSON.stringify(articles, null, 2)}

Now, generate the newsletter section in a concise and engaging style with a title, followed by well-structured paragraphs.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });

      const newsletterContent = response.choices[0].message.content.trim();
      const currentCategory = `${category}`;

      await CategoryNewsletter.create({
        newsletter: newsletterContent,
        category: currentCategory,
      });

      await Newsletter.create({
        newsletter: newsletterContent,
        category: currentCategory,
        date: todayString,
      });

      console.log(`Category Newsletter inserted for ${currentCategory}`);
      console.log("=".repeat(25));
    } catch (error) {
      console.error(`Error generating newsletter for ${category}:`, error);
    }
  }
};

export { generateCategoryNewsletter };
