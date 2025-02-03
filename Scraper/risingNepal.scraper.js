import puppeteer, { JSHandle } from "puppeteer";
import { Article } from "../models/article.model.js";
import { NewArticle } from "../models/newArticle.model.js";
import Groq from "groq-sdk";
import dotenv from "dotenv";

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
  for (let j = 0; j < urlNames.length; j++) {
    const url = `https://risingnepaldaily.com/categories/${urlNames[j]}`;

    const browser = await puppeteer.launch({
      args: [
        "--use-gl=angle",
        "--use-angle=swiftshader",
        "--single-process",
        "--no-sandbox",
      ],
      headless: true,
    });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "domcontentloaded" });

    const links = await page.evaluate(() => {
      const articleLinks = document.querySelectorAll(
        ".blog-box-layout11.mb-5.w-100 div.item-img a"
      );

      return Array.from(articleLinks).map((link) => link.href);
    });

    console.log(
      `Number of links found in Category: ${urlNames[j]} `,
      links.length
    );

    for (let i = 0; i < links.length; i++) {
      const articleUrl = links[i];

      const newPage = await browser.newPage();
      await newPage.goto(articleUrl, { waitUntil: "domcontentloaded" });

      const article = await newPage.evaluate(() => {
        const paragraphs = document.querySelectorAll(".blog-details p");
        return Array.from(paragraphs)
          .map((p) => p.textContent.trim())
          .join("\n");
      });

      const title = await newPage.evaluate(() => {
        const articleTitle = document.querySelector(
          ".col-lg-12.text-center.mb-4 h1"
        );

        return articleTitle
          ? articleTitle.textContent.trim()
          : "Title Not Found";
      });

      const articelImg = await newPage.evaluate(() => {
        const img = document.querySelector(".blog-banner img");
        return img
          ? img.src
          : "https://res.cloudinary.com/dbdyrmfbc/image/upload/v1738399320/qxh5ezn8rcalsj2cwalw.jpg";
      });
      const publishedTime = await newPage.evaluate(() => {
        const publishedTime = document.querySelector(".mr-3.font-size-16 ");

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
          : "Unable to Find the author";
      });
      const authorLink = await newPage.evaluate(() => {
        const articleAuthorLink = document.querySelector(
          ".col-12.d-flex.align-items-center.share-inline-block.mb-4 a.d-flex.align-items-center "
        );

        return articleAuthorLink
          ? articleAuthorLink.href
          : "Unable to Find the author Link";
      });
      const findArticle = await Article.find({ title: title });

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
            title: title,
            subTitle: "NO SUBTITLE",
            authorName: author,
            authorProfileLink: authorLink,
            articleLink: links[i],
            articleImage: articelImg,
            publishedTime: publishedTime,
            updatedTime: "NOT FOUND",
            updatedPlace: "NOT FOUND",
            articleText: article,
            summary: aiSummary,
            tag: urlNames[j],
            source: "The Rising Nepal",
          });

          console.log("Article inserted!!!");

          await NewArticle.create({
            title: title,
            source: "The Rising Nepal",
            tag: urlNames[j],
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

    console.log(`Finished Scraping Category: ${urlNames[j]}`);

    await browser.close();
  }
}
