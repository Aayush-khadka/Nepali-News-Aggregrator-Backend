import puppeteer from "puppeteer-core";
import { Article } from "../models/article.model.js";
import { NewArticle } from "../models/newArticle.model.js";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import chromium from "@sparticuz/chromium-min";

dotenv.config();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function scrapeRisingNepal() {
  const urlNames = [
    "life-and-art",
    "world",
    "editorial",
    "health",
    "business",
    "sports",
    "nation",
    "politics",
    "society",
    "science-tech",
  ];

  let executablePath;
  try {
    executablePath = await chromium.executablePath(
      "https://github.com/Sparticuz/chromium/releases/download/v132.0.0/chromium-v132.0.0-pack.tar"
    );
  } catch (error) {
    console.error("Failed to fetch Chromium executable path:", error);
    return;
  }

  for (const category of urlNames) {
    console.log(`Started Scraping Category: ${category}`);

    const url = `https://risingnepaldaily.com/categories/${category}`;

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
            ".blog-box-layout11.mb-5.w-100 div.item-img a"
          )
        ).map((link) => link.href);
      });

      console.log(`Total Links Found in ${category} Category: ${links.length}`);

      for (const articleUrl of links) {
        const newPage = await browser.newPage();
        await newPage.goto(articleUrl, { waitUntil: "domcontentloaded" });

        const article = await newPage.evaluate(() => {
          const paragraphs = document.querySelectorAll(".blog-details p");
          return paragraphs.length
            ? Array.from(paragraphs)
                .map((p) => p.textContent.trim())
                .join("\n")
            : "No Article Text Found";
        });

        const title = await newPage.evaluate(() => {
          const articleTitle = document.querySelector(
            ".col-lg-12.text-center.mb-4 h1"
          );
          return articleTitle
            ? articleTitle.textContent.trim()
            : "Title Not Found";
        });

        const articleImg = await newPage.evaluate(() => {
          const img = document.querySelector(".blog-banner img");
          return img
            ? img.src
            : "https://res.cloudinary.com/dbdyrmfbc/image/upload/v1738399320/qxh5ezn8rcalsj2cwalw.jpg";
        });

        const publishedTime = await newPage.evaluate(() => {
          const publishedTime = document.querySelector(".mr-3.font-size-16");
          return publishedTime
            ? publishedTime.textContent.trim()
            : "No Published Time Found";
        });

        const author = await newPage.evaluate(() => {
          const articleAuthor = document.querySelector(
            ".col-12.d-flex.align-items-center.share-inline-block.mb-4 span.mr-3.text-black.fw-medium.ml-2.font-size-16"
          );
          return articleAuthor
            ? articleAuthor.textContent.trim()
            : "Unknown Author";
        });

        const authorLink = await newPage.evaluate(() => {
          const articleAuthorLink = document.querySelector(
            ".col-12.d-flex.align-items-center.share-inline-block.mb-4 a.d-flex.align-items-center"
          );
          return articleAuthorLink
            ? articleAuthorLink.href
            : "No Author Link Found";
        });

        const existingArticle = await Article.findOne({ title: title });

        if (existingArticle) {
          console.log("Article is Already Scraped! Skipping...");
          await newPage.close();
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
            title: title,
            subTitle: "NO SUBTITLE",
            authorName: author,
            authorProfileLink: authorLink,
            articleLink: articleUrl,
            articleImage: articleImg,
            publishedTime: publishedTime,
            updatedTime: "NOT FOUND",
            updatedPlace: "NOT FOUND",
            articleText: article,
            summary: aiSummary,
            tag: category,
            source: "The Rising Nepal",
          });

          console.log(" Article inserted!");

          await NewArticle.create({
            title: title,
            source: "The Rising Nepal",
            tag: category,
          });
        } catch (error) {
          console.error("Failed to insert article:", error);
        }

        await newPage.close();
      }
    } catch (error) {
      console.error(` Error in scraping category ${category}:`, error);
    } finally {
      if (browser) {
        await browser.close();
      }
    }

    console.log(` Finished Scraping Category: ${category}`);
  }
}
