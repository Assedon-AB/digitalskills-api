import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import UserModel, { UserDocument } from "../models/user.model";

export async function createUser(
  input: DocumentDefinition<
    Omit<
      UserDocument,
      "createdAt" | "updatedAt" | "is_admin" | "api_key" | "usage"
    >
  >
) {
  return UserModel.create(input);
}

export async function createAdminUser(
  input: DocumentDefinition<
    Omit<
      UserDocument,
      "createdAt" | "updatedAt" | "api_key" | "usage" | "is_admin"
    >
  >
) {
  return UserModel.create({ ...input, is_admin: true });
}

export async function findUser(
  query: FilterQuery<UserDocument>,
  options: QueryOptions = { lean: true }
) {
  return UserModel.findOne(query, {}, options);
}

export async function findUsers(
  query: FilterQuery<UserDocument>,
  options: QueryOptions = { lean: true }
) {
  return UserModel.find();
}

export async function updateUser(
  query: FilterQuery<UserDocument>,
  update: UpdateQuery<UserDocument>,
  options: QueryOptions
) {
  return UserModel.updateOne(query, update, options);
}
