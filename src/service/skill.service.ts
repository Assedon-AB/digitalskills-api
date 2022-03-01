import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import SkillModel, { SkillDocument } from "../models/skill.model";

export async function createSkill(
  input: DocumentDefinition<
    Omit<SkillDocument, "createdAt" | "updatedAt" | "productId">
  >
) {
  return SkillModel.create(input);
}

export async function findSkills(
  query: FilterQuery<SkillDocument>,
  projection: any,
  options: QueryOptions = { lean: true }
) {
  return SkillModel.find(query, projection, options).sort({ num: -1 });
}

export async function findSkill(
  query: FilterQuery<SkillDocument>,
  options: QueryOptions = { lean: true }
) {
  return SkillModel.findOne(query, {}, options);
}

export async function findAndUpdateSkill(
  query: FilterQuery<SkillDocument>,
  update: UpdateQuery<SkillDocument>,
  options: QueryOptions
) {
  return SkillModel.findOneAndUpdate(query, update, options);
}

export async function deleteSkill(query: FilterQuery<SkillDocument>) {
  return SkillModel.deleteOne(query);
}

export async function deleteAllSkills() {
  return SkillModel.deleteMany({});
}
