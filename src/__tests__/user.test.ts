import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import createServer from "../utils/server";
import * as UserService from "../service/user.service";
import mongoose from "mongoose";

const app = createServer();

export const userPayload = {
  host: "http://localhost:1337",
};

export const userResponse = {
  host: "http://localhost:1337",
  api_key: "test-api-key",
  is_admin: false,
  usage: [],
};

describe("user", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("user registration", () => {
    describe("with missing host", () => {
      it("should return a 400 and Host is required", async () => {
        const { body, statusCode } = await supertest(app).post(`/api-nyckel`);

        expect(body[0].message).toBe("Host is required");
        expect(statusCode).toBe(400);
      });
    });

    describe("with valid host", () => {
      it("should return 201 and a api_key page", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          // @ts-ignore
          .mockReturnValueOnce(userResponse);

        const { statusCode, text } = await supertest(app)
          .post("/api-nyckel")
          .send(userPayload)
          .set({ "Content-Type": "application/json" });

        expect(text).toMatch(/value="test-api-key"/);
        expect(statusCode).toBe(201);

        expect(createUserServiceMock).toHaveBeenCalledWith(userPayload);
      });
    });
  });
});
