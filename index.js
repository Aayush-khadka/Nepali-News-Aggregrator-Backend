import dotenv from "dotenv";
import Connect_Db from "./db/index.js";
import { scrapeKathmanduPost } from "./Scraper/kathmanduPost.scraper.js";
import { scrapeRisingNepal } from "./Scraper/risingNepal.scraper.js";
import app from "./app.js";

dotenv.config();

Connect_Db()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server Listening at : ${process.env.PORT}`);
    });

    scrapeRisingNepal()
      .then(() => {
        console.log("Finished Scraping The Rising Nepal !!!");
        scrapeKathmanduPost()
          .then(() => {
            console.log("Finished Scraping The Kathmandu Post !!!");
          })
          .catch((err) => {
            console.log("ERROR IN SCRAPING The Kathmandu Post: ", err);
          });
      })
      .catch((err) => {
        console.log("ERROR IN SCRAPING The Rising Nepal: ", err);
      });
  })
  .catch((err) => {
    console.log("ERROR IN DATABASE: ", err);
  });
