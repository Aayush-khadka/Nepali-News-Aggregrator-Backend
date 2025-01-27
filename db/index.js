import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const Connect_Db = async () => {
  console.log("MONGO_URL:", process.env.MONGO_URL);
  try {
    const ConnectionINstance = await mongoose.connect(
      `${process.env.MONGO_URL}/${DB_NAME}`
    );
    console.log(
      `CONNECTED TO DATABASE  DB HOST: ${ConnectionINstance.connection.host}`
    );
  } catch (error) {
    console.error("ERROR:", error);
    process.exit(1);
  }
};

export default Connect_Db;
