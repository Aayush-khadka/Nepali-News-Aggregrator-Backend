import puppeteer from "puppeteer";
import { Article } from "../models/article.model.js";
import chromium from "@sparticuz/chromium-min";
import { NewArticle } from "../models/newArticle.model.js";
import Groq from "groq-sdk";
import dotenv from "dotenv";

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
  for (let j = 0; j < urlNames.length; j++) {
    console.log(`Started Scraping The Category : ${urlNames[j]} `);

    const url = `https://kathmandupost.com/${urlNames[j]}`;
    const executablePath = await chromium.executablePath(
      "https://github.com/Sparticuz/chromium/releases/download/v132.0.0/chromium-v132.0.0-pack.tar"
    );
    const browser = await puppeteer.launch({
      executablePath,

      args: chromium.args,
      headless: chromium.headless,
      defaultViewport: chromium.defaultViewport,
    });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "domcontentloaded" });

    const links = await page.evaluate(() => {
      const articleLinks = document.querySelectorAll(
        ".block--morenews article.article-image div.image.image-sm.image-220.pull-right a"
      );
      return Array.from(articleLinks).map((link) => link.href);
    });

    console.log(`Total Links Found In ${urlNames[j]} Category`, links.length);

    for (let i = 0; i < links.length; i++) {
      const articleUrl = links[i];

      const newPage = await browser.newPage();
      await newPage.goto(articleUrl, { waitUntil: "domcontentloaded" });

      const article = await newPage.evaluate(() => {
        const paragraphs = document.querySelectorAll(
          ".subscribe--wrapperx section.story-section p"
        );
        if (paragraphs.length === 0) {
          return "No Article Text Found";
        }
        return Array.from(paragraphs)
          .map((p) => p.textContent.trim())
          .join("\n");
      });

      const author = await newPage.evaluate(() => {
        const findAuthor = document.querySelector(
          ".page-detail--content.clearfix H5.text-capitalize a"
        );

        if (findAuthor) {
          return {
            authorName: findAuthor.textContent.trim(),
            authorlink: findAuthor.href,
          };
        } else {
          return {
            authorName: "No Author Found",
            authorlink: "No Author Link Found",
          };
        }
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
        const publishedTimes = document.querySelectorAll(".updated-time");
        if (publishedTimes.length === 0) {
          return ["No Published Time Found"];
        }
        return Array.from(publishedTimes).map((time) =>
          time.textContent.trim()
        );
      });

      const articelImg = await newPage.evaluate(() => {
        const img = document.querySelector(".col-sm-8 img.img-responsive");
        return img
          ? img.src
          : "https://res.cloudinary.com/dbdyrmfbc/image/upload/v1738399320/qxh5ezn8rcalsj2cwalw.jpg";
      });

      const findArticle = await Article.find({ title: articleTitle });

      if (findArticle.length > 0) {
        console.log("Article is Already Scraped!!!");
        break;
      }
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content:
              "Can you provide a brief, high-quality summary of this article in 2-3 sentences, highlighting the main points? ",
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

      let fullResponse;
      for await (const chunk of chatCompletion) {
        const content = chunk.choices[0]?.delta?.content || "";
        fullResponse += content;
      }
      const aiSummary = fullResponse.split("</think>")[1]?.trim();

      if (findArticle.length === 0) {
        try {
          await Article.create({
            title: articleTitle,
            subTitle: subArticleTitle,
            authorName: author.authorName,
            authorProfileLink: author.authorlink,
            articleLink: links[i],
            articleImage: articelImg,
            publishedTime: publishedTimes[0],
            updatedTime: publishedTimes[1],
            updatedPlace: publishedTimes[2],
            articleText: article,
            summary: aiSummary,
            tag: tag,
            source: "The Kathmandu Post",
          });

          console.log("Article inserted!!!");

          await NewArticle.create({
            title: articleTitle,
            source: "The Kathmandu Post",
            tag: tag,
          });
        } catch (error) {
          console.error("Failed to insert article!!!", error);
        }
      } else {
        console.log("Article is Already Scraped!!!");
        break;
      }

      await newPage.close();
    }

    console.log(`Finished Scraping The Category : ${urlNames[j]}`);

    await browser.close();
  }
}
