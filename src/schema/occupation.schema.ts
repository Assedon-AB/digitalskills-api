import { object, string, TypeOf } from "zod";
const payload = {
  body: object({
    name: string({
      required_error: "Name is required",
    }),
  }),
};

const params = {
  params: object({
    id: string({
      required_error: "occupationId is required",
    }),
  }),
};

export const createOccupationSchema = object({
  ...payload,
});

export const updateOccupationSchema = object({
  ...payload,
  ...params,
});

export const deleteOccupationSchema = object({
  ...params,
});

export const getOccupationSchema = object({
  ...params,
});

export type CreateOccupationInput = TypeOf<typeof createOccupationSchema>;
export type UpdateOccupationInput = TypeOf<typeof updateOccupationSchema>;
export type ReadOccupationInput = TypeOf<typeof getOccupationSchema>;
export type DeleteOccupationInput = TypeOf<typeof deleteOccupationSchema>;
