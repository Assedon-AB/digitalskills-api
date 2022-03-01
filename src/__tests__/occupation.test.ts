import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import createServer from "../utils/server";
import mongoose from "mongoose";
import {
  createOccupation,
  deleteAllOccupations,
} from "../service/occupation.service";
import { createAdminUser, createUser } from "../service/user.service";
import { UserDocument } from "../models/user.model";

const app = createServer();

export const occupationPayload = {
  name: "Front-end developer",
};

describe("occupation", () => {
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

  describe("get occupation route", () => {
    describe("given the occupation does not exist", () => {
      it("should return a 404", async () => {
        const occupationId = "AAAAAAAAAAAAAAAAAAAAAAAA";

        const { statusCode } = await supertest(app)
          .get(`/api/v1/yrken/${occupationId}`)
          .set({ "x-api-key": user.api_key, Origin: user.host });

        expect(statusCode).toBe(404);
      });
    });

    describe("given the occupation does exist", () => {
      it("should return a 200 status and the product", async () => {
        // @ts-ignore
        const occupation = await createOccupation(occupationPayload);

        const { body, statusCode } = await supertest(app)
          .get(`/api/v1/yrken/${occupation._id}`)
          .set({ "x-api-key": user.api_key, Origin: user.host });

        expect(statusCode).toBe(200);

        expect(body._id).toEqual(occupation._id.toString());
      });
    });
  });

  describe("get occupations route", () => {
    describe("given occupations does not exist", () => {
      it("should return a empty array", async () => {
        await deleteAllOccupations();
        const { body, statusCode } = await supertest(app)
          .get(`/api/v1/yrken`)
          .set({ "x-api-key": user.api_key, Origin: user.host });

        expect(statusCode).toBe(200);
        expect(body).toEqual([]);
      });
    });

    describe("given occupations does exist", () => {
      it("should return a 200 status and the occupation", async () => {
        // @ts-ignore
        await deleteAllOccupations();
        const occupation = await createOccupation(occupationPayload);

        const { body, statusCode } = await supertest(app)
          .get(`/api/v1/yrken`)
          .set({ "x-api-key": user.api_key, Origin: user.host });

        expect(statusCode).toBe(200);

        expect(body[0]._id).toBe(occupation._id.toString());
      });
    });
  });

  describe("post occupation route", () => {
    describe("given the user is not admin", () => {
      it("should return a 403", async () => {
        const nonAuthUser = await createUser({ host: "localhost:1337" });

        await supertest(app)
          .post(`/api/v1/yrken`)
          .send({
            name: occupationPayload.name,
          })
          .set({ "x-api-key": nonAuthUser.api_key, Origin: nonAuthUser.host })
          .expect(403);
      });
    });

    describe("given the user is admin", () => {
      it("should return a 201 status and the occupation", async () => {
        const { body, statusCode } = await supertest(app)
          .post(`/api/v1/yrken`)
          .send(occupationPayload)
          .set({ "x-api-key": user.api_key, Origin: user.host });

        expect(statusCode).toBe(201);
        expect(body.name).toEqual(occupationPayload.name);
      });
    });
  });

  describe("put occupation route", () => {
    describe("given the user is not admin", () => {
      it("should return a 403", async () => {
        const nonAuthUser = await createUser({ host: "localhost:1337" });
        const occupation = await createOccupation(occupationPayload);

        await supertest(app)
          .put(`/api/v1/yrken/${occupation._id}`)
          .send({
            name: occupation.name + "test",
          })
          .set({ "x-api-key": nonAuthUser.api_key, Origin: nonAuthUser.host })
          .expect(403);
      });
    });

    describe("given the user is admin and the occupation does not exist", () => {
      it("should return a 404", async () => {
        const occupationId = "AAAAAAAAAAAAAAAAAAAAAAAA";

        await supertest(app)
          .put(`/api/v1/yrken/${occupationId}`)
          .send({
            name: occupationPayload.name,
            description: "",
          })
          .set({ "x-api-key": user.api_key, Origin: user.host })
          .expect(404);
      });
    });

    describe("given the user is admin and the occupation does exist", () => {
      it("should return a 200 status and the occupation", async () => {
        const occupation = await createOccupation(occupationPayload);

        const { body, statusCode } = await supertest(app)
          .put(`/api/v1/yrken/${occupation._id}`)
          .send({
            name: occupation.name + "test",
            description: "",
          })
          .set({ "x-api-key": user.api_key, Origin: user.host });

        expect(statusCode).toBe(200);
        expect(body.name).toBe(occupation.name + "test");
      });
    });
  });

  describe("delete occupation route", () => {
    describe("given the user is not admin", () => {
      it("should return a 403", async () => {
        const nonAuthUser = await createUser({ host: "localhost:1337" });
        const occupation = await createOccupation(occupationPayload);

        await supertest(app)
          .delete(`/api/v1/yrken/${occupation._id}`)
          .set({ "x-api-key": nonAuthUser.api_key, Origin: nonAuthUser.host })
          .expect(403);
      });
    });

    describe("given the user is admin and the occupation does not exist", () => {
      it("should return a 404", async () => {
        const occupationId = "AAAAAAAAAAAAAAAAAAAAAAAA";

        await supertest(app)
          .delete(`/api/v1/yrken/${occupationId}`)
          .set({ "x-api-key": user.api_key, Origin: user.host })
          .expect(404);
      });
    });

    describe("given the user is admin", () => {
      it("should return a 200 status and the occupation", async () => {
        const occupation = await createOccupation(occupationPayload);

        await supertest(app)
          .delete(`/api/v1/yrken/${occupation._id}`)
          .set({ "x-api-key": user.api_key, Origin: user.host })
          .expect(200);
      });
    });
  });
});
