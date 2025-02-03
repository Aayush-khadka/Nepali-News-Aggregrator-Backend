import puppeteer from "puppeteer-core";
import { Article } from "../models/article.model.js";
import { NewArticle } from "../models/newArticle.model.js";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import chromium from "@sparticuz/chromium-min";

dotenv.config(); 
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function scrapeKathmanduPost() {
  const urlNames = [
    "art-culture",
    "opinion",
    "sports",
    "money",
    "valley",
    "politics",
    "national",
  ];

  await NewArticle.deleteMany({});

  let executablePath;
  try {
    executablePath = await chromium.executablePath(
      "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar"
    );
  } catch (error) {
    console.error("Failed to fetch Chromium executable path:", error);
    return;
  }

  for (const category of urlNames) {
    console.log(`Started Scraping The Category: ${category}`);

    const url = `https://kathmandupost.com/${category}`;

    let browser;
    try {
      browser = await puppeteer.launch({
        executablePath,
        args: chromium.args,
        headless: chromium.headless,
        defaultViewport: chromium.defaultViewport,
      });

      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "domcontentloaded" });

      const links = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll(
            ".block--morenews article.article-image div.image.image-sm.image-220.pull-right a"
          )
        ).map((link) => link.href);
      });

      console.log(`Total Links Found in ${category} Category: ${links.length}`);

      for (const articleUrl of links) {
        const newPage = await browser.newPage();
        await newPage.goto(articleUrl, { waitUntil: "domcontentloaded" });

        const article = await newPage.evaluate(() => {
          const paragraphs = document.querySelectorAll(
            ".subscribe--wrapperx section.story-section p"
          );
          return paragraphs.length
            ? Array.from(paragraphs)
                .map((p) => p.textContent.trim())
                .join("\n")
            : "No Article Text Found";
        });

        const author = await newPage.evaluate(() => {
          const findAuthor = document.querySelector(
            ".page-detail--content.clearfix H5.text-capitalize a"
          );
          return findAuthor
            ? {
                authorName: findAuthor.textContent.trim(),
                authorLink: findAuthor.href,
              }
            : {
                authorName: "No Author Found",
                authorLink: "No Author Link Found",
              };
        });

        const articleTitle = await newPage.evaluate(() => {
          const title = document.querySelector(".col-sm-8 h1");
          return title ? title.textContent.trim() : "No Title Found";
        });

        const tag = await newPage.evaluate(() => {
          const articleTag = document.querySelector(".col-sm-8 h4");
          return articleTag ? articleTag.textContent.trim() : "No Tag Found";
        });

        const subArticleTitle = await newPage.evaluate(() => {
          const title = document.querySelector(".title-sub");
          return title ? title.textContent.trim() : "No Subtitle Found";
        });

        const publishedTimes = await newPage.evaluate(() => {
          return Array.from(document.querySelectorAll(".updated-time")).map(
            (time) => time.textContent.trim()
          );
        });

        const articleImg = await newPage.evaluate(() => {
          const img = document.querySelector(".col-sm-8 img.img-responsive");
          return img
            ? img.src
            : "https://res.cloudinary.com/dbdyrmfbc/image/upload/v1738399320/qxh5ezn8rcalsj2cwalw.jpg";
        });

        const existingArticle = await Article.findOne({ title: articleTitle });

        if (existingArticle) {
          console.log("Article is Already Scraped!");
          continue;
        }

        let fullResponse = "";

        try {
          const chatCompletion = await groq.chat.completions.create({
            messages: [
              {
                role: "user",
                content:
                  "Can you provide a brief, high-quality summary of this article in 2-3 sentences, highlighting the main points?",
              },
              {
                role: "assistant",
                content: `<think>\nOkay, so the user is asking for a summary of this article in 2-3 sentences. They want it to be high-quality and highlight the main points. First, I need to read through the article carefully to understand what's going on. ${article} `,
              },
            ],
            model: "deepseek-r1-distill-llama-70b",
            temperature: 0.6,
            max_completion_tokens: 4096,
            top_p: 0.95,
            stream: true,
            stop: null,
          });

          for await (const chunk of chatCompletion) {
            fullResponse += chunk.choices[0]?.delta?.content || "";
          }
        } catch (error) {
          console.error("Failed to generate AI summary:", error);
        }

        const aiSummary =
          fullResponse.split("</think>")[1]?.trim() || "No Summary Available";

        try {
          await Article.create({
            title: articleTitle,
            subTitle: subArticleTitle,
            authorName: author.authorName,
            authorProfileLink: author.authorLink,
            articleLink: articleUrl,
            articleImage: articleImg,
            publishedTime: publishedTimes[0] || "No Published Time Found",
            updatedTime: publishedTimes[1] || "No Updated Time Found",
            updatedPlace: publishedTimes[2] || "No Updated Place Found",
            articleText: article,
            summary: aiSummary,
            tag: tag,
            source: "The Kathmandu Post",
          });

          console.log("Article inserted!");

          await NewArticle.create({
            title: articleTitle,
            source: "The Kathmandu Post",
            tag: tag,
          });
        } catch (error) {
          console.error("Failed to insert article:", error);
        }

        await newPage.close();
      }
    } catch (error) {
      console.error(`Error in scraping category ${category}:`, error);
    } finally {
      if (browser) {
        await browser.close();
      }
    }

    console.log(`Finished Scraping The Category: ${category}`);
  }
}
