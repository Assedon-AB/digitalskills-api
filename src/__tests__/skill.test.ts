import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import createServer from "../utils/server";
import mongoose from "mongoose";
import { createSkill, deleteAllSkills } from "../service/skill.service";
import { createAdminUser, createUser } from "../service/user.service";
import { UserDocument } from "../models/user.model";

const app = createServer();

export const skillPayload = {
  name: "React",
};

describe("skill", () => {
  let user: UserDocument;
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());

    user = await createAdminUser({ host: "localhost:1337" });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("get skill route", () => {
    describe("given the skill does not exist", () => {
      it("should return a 404", async () => {
        const skillId = "AAAAAAAAAAAAAAAAAAAAAAAA";

        const { statusCode } = await supertest(app)
          .get(`/api/v1/kompetenser/${skillId}`)
          .set({ "x-api-key": user.api_key, Origin: user.host });

        expect(statusCode).toBe(404);
      });
    });

    describe("given the skill does exist", () => {
      it("should return a 200 status and the product", async () => {
        // @ts-ignore
        const skill = await createSkill(skillPayload);

        const { body, statusCode } = await supertest(app)
          .get(`/api/v1/kompetenser/${skill._id}`)
          .set({ "x-api-key": user.api_key, Origin: user.host });

        expect(statusCode).toBe(200);

        expect(body._id).toEqual(skill._id.toString());
      });
    });
  });

  describe("get skills route", () => {
    describe("given skills does not exist", () => {
      it("should return a empty array", async () => {
        await deleteAllSkills();
        const { body, statusCode } = await supertest(app)
          .get(`/api/v1/kompetenser`)
          .set({ "x-api-key": user.api_key, Origin: user.host });

        expect(statusCode).toBe(200);
        expect(body).toEqual([]);
      });
    });

    describe("given skills does exist", () => {
      it("should return a 200 status and the skill", async () => {
        // @ts-ignore
        await deleteAllSkills();
        const skill = await createSkill(skillPayload);

        const { body, statusCode } = await supertest(app)
          .get(`/api/v1/kompetenser`)
          .set({ "x-api-key": user.api_key, Origin: user.host });

        expect(statusCode).toBe(200);

        expect(body[0]._id).toBe(skill._id.toString());
      });
    });
  });

  describe("post skill route", () => {
    describe("given the user is not admin", () => {
      it("should return a 403", async () => {
        const nonAuthUser = await createUser({ host: "localhost:1337" });

        await supertest(app)
          .post(`/api/v1/kompetenser`)
          .send({
            name: skillPayload.name,
          })
          .set({ "x-api-key": nonAuthUser.api_key, Origin: nonAuthUser.host })
          .expect(403);
      });
    });

    describe("given the user is admin", () => {
      it("should return a 201 status and the skill", async () => {
        const { body, statusCode } = await supertest(app)
          .post(`/api/v1/kompetenser`)
          .send(skillPayload)
          .set({ "x-api-key": user.api_key, Origin: user.host });

        expect(statusCode).toBe(201);
        expect(body.name).toEqual(skillPayload.name);
      });
    });
  });

  describe("put skill route", () => {
    describe("given the user is not admin", () => {
      it("should return a 403", async () => {
        const nonAuthUser = await createUser({ host: "localhost:1337" });
        const skill = await createSkill(skillPayload);

        await supertest(app)
          .put(`/api/v1/kompetenser/${skill._id}`)
          .send({
            name: skill.name + "test",
          })
          .set({ "x-api-key": nonAuthUser.api_key, Origin: nonAuthUser.host })
          .expect(403);
      });
    });

    describe("given the user is admin and the skill does not exist", () => {
      it("should return a 404", async () => {
        const skillId = "AAAAAAAAAAAAAAAAAAAAAAAA";

        await supertest(app)
          .put(`/api/v1/kompetenser/${skillId}`)
          .send({
            name: skillPayload.name,
          })
          .set({ "x-api-key": user.api_key, Origin: user.host })
          .expect(404);
      });
    });

    describe("given the user is admin and the skill does exist", () => {
      it("should return a 200 status and the skill", async () => {
        const skill = await createSkill(skillPayload);

        const { body, statusCode } = await supertest(app)
          .put(`/api/v1/kompetenser/${skill._id}`)
          .send({
            name: skill.name + "test",
          })
          .set({ "x-api-key": user.api_key, Origin: user.host });

        expect(statusCode).toBe(200);
        expect(body.name).toBe(skill.name + "test");
      });
    });
  });

  describe("delete skill route", () => {
    describe("given the user is not admin", () => {
      it("should return a 403", async () => {
        const nonAuthUser = await createUser({ host: "localhost:1337" });
        const skill = await createSkill(skillPayload);

        await supertest(app)
          .delete(`/api/v1/kompetenser/${skill._id}`)
          .set({ "x-api-key": nonAuthUser.api_key, Origin: nonAuthUser.host })
          .expect(403);
      });
    });

    describe("given the user is admin and the skill does not exist", () => {
      it("should return a 404", async () => {
        const skillId = "AAAAAAAAAAAAAAAAAAAAAAAA";

        await supertest(app)
          .delete(`/api/v1/kompetenser/${skillId}`)
          .set({ "x-api-key": user.api_key, Origin: user.host })
          .expect(404);
      });
    });

    describe("given the user is admin", () => {
      it("should return a 200 status and the skill", async () => {
        const skill = await createSkill(skillPayload);

        await supertest(app)
          .delete(`/api/v1/kompetenser/${skill._id}`)
          .set({ "x-api-key": user.api_key, Origin: user.host })
          .expect(200);
      });
    });
  });
});
