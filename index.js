import dotenv from "dotenv";
import Connect_Db from "./db/index.js";
import { scrapeKathmanduPost } from "./Scraper/kathmanduPost.scraper.js";
import app from "./app.js";
dotenv.config();
Connect_Db()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server Listening at : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("ERROR IN DATABASE: ", err);
  });

scrapeKathmanduPost()
  .then(() => {
    console.log("Finished Scraping !!!");
  })
  .catch((err) => {
    console.log("ERROR IN SCRAPING ", err);
  });
