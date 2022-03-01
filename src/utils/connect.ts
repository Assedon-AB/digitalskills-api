import mongoose from "mongoose";
import logger from "./logger";

async function connect() {
  const dbUri = process.env.DB_URI || "mongodb://localhost:27017/digspec2";

  try {
    await mongoose.connect(dbUri);
    logger.info("DB connected");
  } catch (error) {
    logger.error("Could not connect to db");
    process.exit(1);
  }
}

export default connect;
