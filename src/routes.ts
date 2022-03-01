import { Express, Request, Response } from "express";
import { validateKey, checkAuthorized } from "./middleware/apikeys";
import validateResource from "./middleware/validateResource";
import { createUserSchema } from "./schema/user.schema";
import {
  createSkillSchema,
  getSkillSchema,
  deleteSkillSchema,
  updateSkillSchema,
} from "./schema/skill.schema";

import {
  createSkillHandler,
  updateSkillHandler,
  getSkillHandler,
  deleteSkillHandler,
  getSkillsHandler,
} from "./controller/skill.controller";
import { createUserHandler } from "./controller/user.controller";

import {
  createOccupationSchema,
  getOccupationSchema,
  deleteOccupationSchema,
  updateOccupationSchema,
} from "./schema/occupation.schema";

import {
  createOccupationHandler,
  updateOccupationHandler,
  getOccupationHandler,
  deleteOccupationHandler,
  getOccupationsHandler,
} from "./controller/occupation.controller";

import {
  createIndustrySchema,
  getIndustrySchema,
  deleteIndustrySchema,
  updateIndustrySchema,
} from "./schema/industry.schema";

import {
  createIndustryHandler,
  updateIndustryHandler,
  getIndustryHandler,
  deleteIndustryHandler,
} from "./controller/industry.controller";

import { findUsers, createAdminUser } from "./service/user.service";

function routes(app: Express) {
  app.get("/", (_: Request, res: Response) => {
    res.render("index");
  });

  app.get("/api-nyckel", (_: Request, res: Response) => {
    res.render("dashboard");
  });

  app.get("/users", async (_: Request, res: Response) => {
    const users = await findUsers({}, {});
    res.send(users);
  });

  app.post(
    "/api-nyckel",
    validateResource(createUserSchema),
    createUserHandler
  );

  app.get("/api/v1/", validateKey, (_: Request, res: Response) => {
    res.status(200).send({
      api_name: "digitalspetskompetens-api",
      api_version: "1.0.0",
      api_released: "2022-03-31",
      api_documentation: "/dokumentation",
      api_status: "active",
    });
  });

  app.get("/api/v1/kompetenser", validateKey, getSkillsHandler);

  app.get(
    "/api/v1/kompetenser/:id",
    validateKey,
    getSkillHandler,
    validateResource(getSkillSchema)
  );

  app.post(
    "/api/v1/kompetenser",
    [validateKey, checkAuthorized, validateResource(createSkillSchema)],
    createSkillHandler
  );

  app.put(
    "/api/v1/kompetenser/:id",
    [validateKey, checkAuthorized, validateResource(updateSkillSchema)],
    updateSkillHandler
  );

  app.delete(
    "/api/v1/kompetenser/:id",
    [validateKey, checkAuthorized, validateResource(deleteSkillSchema)],
    deleteSkillHandler
  );

  app.get("/api/v1/yrken", validateKey, getOccupationsHandler);

  app.get(
    "/api/v1/yrken/:id",
    validateKey,
    getOccupationHandler,
    validateResource(getOccupationSchema)
  );

  app.post(
    "/api/v1/yrken",
    [validateKey, checkAuthorized, validateResource(createOccupationSchema)],
    createOccupationHandler
  );

  app.put(
    "/api/v1/yrken/:id",
    [validateKey, checkAuthorized, validateResource(updateOccupationSchema)],
    updateOccupationHandler
  );

  app.delete(
    "/api/v1/yrken/:id",
    [validateKey, checkAuthorized, validateResource(deleteOccupationSchema)],
    deleteOccupationHandler
  );

  app.get("/api/v1/bransch", validateKey, getIndustryHandler);

  app.post(
    "/api/v1/bransch",
    [validateKey, checkAuthorized, validateResource(createIndustrySchema)],
    createIndustryHandler
  );

  app.put(
    "/api/v1/bransch/:id",
    [validateKey, checkAuthorized, validateResource(updateIndustrySchema)],
    updateIndustryHandler
  );

  app.delete(
    "/api/v1/bransch/:id",
    [validateKey, checkAuthorized, validateResource(deleteIndustrySchema)],
    deleteIndustryHandler
  );
}

export default routes;
