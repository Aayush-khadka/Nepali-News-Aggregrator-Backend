import puppeteer from "puppeteer";
import { Article } from "../models/article.model.js";

export async function scrapeKathmanduPost() {
  const urlNames = [
    "national",
    "politics",
    "valley",
    "opinion",
    "money",
    "sports",
    "art-culture",
  ];

  for (let j = 0; j < urlNames.length; j++) {
    console.log(`Started Scraping The Category : ${urlNames[j]} `);

    const url = `https://kathmandupost.com/${urlNames[j]}`;

    const browser = await puppeteer.launch();
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
        return img ? img.src : "No Image Found";
      });

      const findArticle = await Article.find({ title: articleTitle });

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
            tag: tag,
            source: "The Kathmandu Post",
          });

          console.log("Article inserted!!!");
        } catch (error) {
          console.error("Failed to insert article!!!", error);
        }
      } else {
        console.log("Article is Already Scraped!!!");
      }

      await newPage.close();
    }

    console.log(`Finished Scraping The Category : ${urlNames[j]}`);

    await browser.close();
  }
}
