import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import createServer from "../utils/server";
import mongoose from "mongoose";
import {
  createIndustry,
  deleteAllIndustrys,
} from "../service/industry.service";
import { createAdminUser, createUser } from "../service/user.service";
import { UserDocument } from "../models/user.model";

const app = createServer();

export const industryPayload = {
  num: 1000,
};

describe("industry", () => {
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

  describe("get industrys route", () => {
    describe("given industrys does not exist", () => {
      it("should return a 404", async () => {
        await deleteAllIndustrys();
        const { statusCode } = await supertest(app)
          .get(`/api/v1/bransch`)
          .set({ "x-api-key": user.api_key, Origin: user.host });

        expect(statusCode).toBe(404);
      });
    });

    describe("given industrys does exist", () => {
      it("should return a 200 status and the industry", async () => {
        // @ts-ignore
        await deleteAllIndustrys();
        const industry = await createIndustry(industryPayload);

        const { body, statusCode } = await supertest(app)
          .get(`/api/v1/bransch`)
          .set({ "x-api-key": user.api_key, Origin: user.host });

        expect(statusCode).toBe(200);

        expect(body._id).toBe(industry._id.toString());
      });
    });
  });

  describe("post industry route", () => {
    describe("given the user is not admin", () => {
      it("should return a 403", async () => {
        const nonAuthUser = await createUser({ host: "localhost:1337" });

        await supertest(app)
          .post(`/api/v1/bransch`)
          .send({
            num: industryPayload.num,
          })
          .set({ "x-api-key": nonAuthUser.api_key, Origin: nonAuthUser.host })
          .expect(403);
      });
    });

    describe("given the user is admin", () => {
      it("should return a 201 status and the industry", async () => {
        const { body, statusCode } = await supertest(app)
          .post(`/api/v1/bransch`)
          .send(industryPayload)
          .set({ "x-api-key": user.api_key, Origin: user.host });

        expect(statusCode).toBe(201);
        expect(body.num).toEqual(industryPayload.num);
      });
    });
  });

  describe("put industry route", () => {
    describe("given the user is not admin", () => {
      it("should return a 403", async () => {
        const nonAuthUser = await createUser({ host: "localhost:1337" });
        const industry = await createIndustry(industryPayload);

        await supertest(app)
          .put(`/api/v1/bransch/${industry._id}`)
          .send({
            num: industry.num + 10,
          })
          .set({ "x-api-key": nonAuthUser.api_key, Origin: nonAuthUser.host })
          .expect(403);
      });
    });

    describe("given the user is admin and the industry does not exist", () => {
      it("should return a 404", async () => {
        const industryId = "AAAAAAAAAAAAAAAAAAAAAAAA";

        await supertest(app)
          .put(`/api/v1/bransch/${industryId}`)
          .send({
            num: industryPayload.num,
          })
          .set({ "x-api-key": user.api_key, Origin: user.host })
          .expect(404);
      });
    });

    describe("given the user is admin and the industry does exist", () => {
      it("should return a 200 status and the industry", async () => {
        const industry = await createIndustry(industryPayload);

        const { body, statusCode } = await supertest(app)
          .put(`/api/v1/bransch/${industry._id}`)
          .send({
            num: industry.num + 10,
          })
          .set({ "x-api-key": user.api_key, Origin: user.host });

        expect(statusCode).toBe(200);
        expect(body.num).toBe(industry.num + 10);
      });
    });
  });

  describe("delete industry route", () => {
    describe("given the user is not admin", () => {
      it("should return a 403", async () => {
        const nonAuthUser = await createUser({ host: "localhost:1337" });
        const industry = await createIndustry(industryPayload);

        await supertest(app)
          .delete(`/api/v1/bransch/${industry._id}`)
          .set({ "x-api-key": nonAuthUser.api_key, Origin: nonAuthUser.host })
          .expect(403);
      });
    });

    describe("given the user is admin and the industry does not exist", () => {
      it("should return a 404", async () => {
        const industryId = "AAAAAAAAAAAAAAAAAAAAAAAA";

        await supertest(app)
          .delete(`/api/v1/bransch/${industryId}`)
          .set({ "x-api-key": user.api_key, Origin: user.host })
          .expect(404);
      });
    });

    describe("given the user is admin", () => {
      it("should return a 200 status and the industry", async () => {
        const industry = await createIndustry(industryPayload);

        await supertest(app)
          .delete(`/api/v1/bransch/${industry._id}`)
          .set({ "x-api-key": user.api_key, Origin: user.host })
          .expect(200);
      });
    });
  });
});
