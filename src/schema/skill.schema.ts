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
      required_error: "skillId is required",
    }),
  }),
};

export const createSkillSchema = object({
  ...payload,
});

export const updateSkillSchema = object({
  ...payload,
  ...params,
});

export const deleteSkillSchema = object({
  ...params,
});

export const getSkillSchema = object({
  ...params,
});

export type CreateSkillInput = TypeOf<typeof createSkillSchema>;
export type UpdateSkillInput = TypeOf<typeof updateSkillSchema>;
export type ReadSkillInput = TypeOf<typeof getSkillSchema>;
export type DeleteSkillInput = TypeOf<typeof deleteSkillSchema>;
