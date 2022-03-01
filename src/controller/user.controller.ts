import { Request, Response } from "express";
import { CreateUserInput } from "../schema/user.schema";
import { createUser } from "../service/user.service";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  const body = req.body;
  const user = await createUser({ host: body.host });

  return res.status(201).render("dashboard", user);
}
