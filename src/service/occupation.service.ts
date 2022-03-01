import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import OccupationModel, {
  OccupationDocument,
} from "../models/occupation.model";

export async function createOccupation(
  input: DocumentDefinition<
    Omit<OccupationDocument, "createdAt" | "updatedAt" | "productId">
  >
) {
  return OccupationModel.create(input);
}

export async function findOccupations(
  query: FilterQuery<OccupationDocument>,
  projection: any,
  options: QueryOptions = { lean: true }
) {
  return OccupationModel.find(query, projection, options).sort({ num: -1 });
}

export async function findOccupation(
  query: FilterQuery<OccupationDocument>,
  options: QueryOptions = { lean: true }
) {
  return OccupationModel.findOne(query, {}, options);
}

export async function findAndUpdateOccupation(
  query: FilterQuery<OccupationDocument>,
  update: UpdateQuery<OccupationDocument>,
  options: QueryOptions
) {
  return OccupationModel.findOneAndUpdate(query, update, options);
}

export async function deleteOccupation(query: FilterQuery<OccupationDocument>) {
  return OccupationModel.deleteOne(query);
}

export async function deleteAllOccupations() {
  return OccupationModel.deleteMany({});
}
