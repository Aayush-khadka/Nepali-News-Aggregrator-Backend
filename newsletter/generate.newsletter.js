import { SignupNewsletter } from "../models/signup.newsletter.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import { CategoryNewsletter } from "../models/category.newsletter.model.js";

const sendNewsletter = async () => {
  const users = await SignupNewsletter.find(
    { isVerified: true },
    { interests: 1, email: 1, _id: 0 }
  );

  const subject = "News Letter Trial #10";
  const today = new Date().toISOString().split("T")[0];

  for (let user of users) {
    let politics = "",
      national = "",
      science_technology = "",
      health = "",
      world = "",
      money = "",
      sports = "",
      opinion = "",
      art_culture = "";

    for (let i = 0; i < user.interests.length; i++) {
      const categoryKey = user.interests[i].replace(/-/g, "_");

      const newsletterData = await CategoryNewsletter.findOne(
        { category: user.interests[i] },
        { _id: 0, newsletter: 1 }
      );

      if (newsletterData) {
        if (categoryKey === "politics") politics = newsletterData.newsletter;
        else if (categoryKey === "national")
          national = newsletterData.newsletter;
        else if (categoryKey === "science_technology")
          science_technology = newsletterData.newsletter;
        else if (categoryKey === "health") health = newsletterData.newsletter;
        else if (categoryKey === "world") world = newsletterData.newsletter;
        else if (categoryKey === "money") money = newsletterData.newsletter;
        else if (categoryKey === "sports") sports = newsletterData.newsletter;
        else if (categoryKey === "opinion") opinion = newsletterData.newsletter;
        else if (categoryKey === "art_culture")
          art_culture = newsletterData.newsletter;
      }
    }
    sendEmail(user.email, subject, "newsletter", {
      date: today,

      politics: politics,

      national: national,

      science_technology: science_technology,

      health: health,

      world: world,

      money: money,

      sports: sports,

      opinion: opinion,

      art_culture: art_culture,
      unsubscribeLink: "https://thesamachar.vercel.app/newsletter/unsubscribe",
    });
  }
};

export { sendNewsletter };
