import createServer from "./utils/server";
import logger from "./utils/logger";
import connect from "./utils/connect";

const port = process.env.PORT || 8080;

const app = createServer();

app.listen(port, async () => {
  try {
    logger.info(`Listening on port ${port}`);
    await connect();
  } catch (err) {
    logger.error(err);
  }
});
