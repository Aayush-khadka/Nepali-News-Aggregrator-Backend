import dotenv from "dotenv";
import Connect_Db from "./db/index.js";
import getTrending from "./Logic/trending.js";
import { scrapeKathmanduPost } from "./Scraper/kathmanduPost.scraper.js";
import { scrapeRisingNepal } from "./Scraper/risingNepal.scraper.js";
import app from "./app.js";
import cron from "node-cron";
import { generateCategoryNewsletter } from "./Logic/newsletter.js";
import { sendNewsletter } from "./newsletter/generate.newsletter.js";
import cors from "cors"; // Import CORS
dotenv.config();
// Enable CORS
app.use(
  cors({
    origin: "https://thesamachar.vercel.app", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow only necessary methods
    credentials: true, // Allow cookies if needed
  })
);
Connect_Db()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server Listening at : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("ERROR IN DATABASE: ", err);
  });

cron.schedule(
  "0 7 * * 3,6",
  async () => {
    console.log(
      `Running scheduled newsletter job at ${new Date().toISOString()}`
    );

    generateCategoryNewsletter()
      .then(() => {
        sendNewsletter();
        console.log("Newsletter generated and sent successfully");
      })
      .catch((err) => {
        console.log("ERROR IN Sending NewsLetters ", err);
      });
  },
  {
    scheduled: true,
    timezone: "Asia/Kathmandu", // Adjust timezone as needed
  }
);

// Your existing immediate execution for testing (can be commented out in production)
// generateCategoryNewsletter()
// .then(()=>{
//  sendNewsletter();
// })
// .catch((err)=>{
//   console.log("ERROR IN Sending NewsLetters ", err);
// })

// scrapeKathmanduPost()
//   .then(() => {
//     console.log("Finished Scraping The Kathmandu Post!!!");
//     scrapeRisingNepal()
//       .then(() => {
//         console.log("Finished Scraping The Rising Nepal: !!!");
//         getTrending();
//       })
//       .catch((err) => {
//         console.log("ERROR IN SCRAPING The Rising Nepal: ", err);
//       });
//   })
//   .catch((err) => {
//     console.log("ERROR IN SCRAPING The Kathmandu Post ", err);
//   });
