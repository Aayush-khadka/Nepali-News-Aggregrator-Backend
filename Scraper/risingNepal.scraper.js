import puppeteer, { JSHandle } from "puppeteer";
import { Article } from "../models/article.model.js";

export async function scrapeRisingNepal() {
  const urlNames = [
    "national",
    "politics",
    "society",
    "science-tech",
    "business",
    "editorial",
    "health",
    "sports",
    "life-and-art",
    "world",
  ];
  for (let j = 0; j < urlNames.length; j++) {
    const url = `https://risingnepaldaily.com/categories/${urlNames[j]}`;

    const browser = await puppeteer.launch();
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
        return img ? img.src : "No Image Found";
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
            tag: "Politics",
            source: "The Rising Nepal",
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

    console.log(`Finished Scraping Category: ${urlNames[j]}`);

    await browser.close();
  }
}
