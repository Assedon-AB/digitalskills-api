import { object, string, TypeOf } from "zod";
const payload = {
  body: object({
    host: string({
      required_error: "Host is required",
    }),
  }),
};

export const createUserSchema = object({
  ...payload,
});

export type CreateUserInput = TypeOf<typeof createUserSchema>;
