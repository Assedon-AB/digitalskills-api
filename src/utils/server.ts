import express from "express";
import path from "path";
import routes from "../routes";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "./swagger.json";

function createServer() {
  const app = express();
  app.set("view engine", "pug");
  app.set("views", path.join(__dirname + "/../views"));

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(cors());
  app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

  routes(app);

  return app;
}

export default createServer;
