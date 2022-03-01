import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import IndustryModel, { IndustryDocument } from "../models/industry.model";

export async function createIndustry(
  input: DocumentDefinition<
    Omit<IndustryDocument, "createdAt" | "updatedAt" | "productId">
  >
) {
  return IndustryModel.create(input);
}

export async function findIndustry(
  query: FilterQuery<IndustryDocument>,
  options: QueryOptions = { lean: true }
) {
  return IndustryModel.findOne(query, {}, options);
}

export async function findAndUpdateIndustry(
  query: FilterQuery<IndustryDocument>,
  update: UpdateQuery<IndustryDocument>,
  options: QueryOptions
) {
  return IndustryModel.findOneAndUpdate(query, update, options);
}

export async function deleteIndustry(query: FilterQuery<IndustryDocument>) {
  return IndustryModel.deleteOne(query);
}

export async function deleteAllIndustrys() {
  return IndustryModel.deleteMany({});
}
