import { object, string, TypeOf, number } from "zod";
const payload = {
  body: object({
    num: number({
      required_error: "Ad number is required",
    }),
  }),
};

const params = {
  params: object({
    id: string({
      required_error: "industryId is required",
    }),
  }),
};

export const createIndustrySchema = object({
  ...payload,
});

export const updateIndustrySchema = object({
  ...payload,
  ...params,
});

export const deleteIndustrySchema = object({
  ...params,
});

export const getIndustrySchema = object({
  ...params,
});

export type CreateIndustryInput = TypeOf<typeof createIndustrySchema>;
export type UpdateIndustryInput = TypeOf<typeof updateIndustrySchema>;
export type ReadIndustryInput = TypeOf<typeof getIndustrySchema>;
export type DeleteIndustryInput = TypeOf<typeof deleteIndustrySchema>;
