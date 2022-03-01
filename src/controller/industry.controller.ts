import { Request, Response } from "express";
import {
  CreateIndustryInput,
  UpdateIndustryInput,
} from "../schema/industry.schema";
import {
  createIndustry,
  deleteIndustry,
  findAndUpdateIndustry,
  findIndustry,
} from "../service/industry.service";

export async function createIndustryHandler(
  req: Request<{}, {}, CreateIndustryInput["body"]>,
  res: Response
) {
  const body = req.body;
  const industry = await createIndustry({ ...body });

  return res.status(201).send(industry);
}

export async function updateIndustryHandler(
  req: Request<UpdateIndustryInput["params"]>,
  res: Response
) {
  const industryId = req.params.id;

  // Checks if id is valid object id
  if (!industryId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.sendStatus(404);
  }

  const update = req.body;

  const industry = await findIndustry({ _id: industryId });

  if (!industry) {
    return res.sendStatus(404);
  }

  const updatedIndustry = await findAndUpdateIndustry(
    { _id: industryId },
    update,
    {
      new: true,
    }
  );

  return res.status(200).send(updatedIndustry);
}

export async function getIndustryHandler(req: Request, res: Response) {
  const industry = await findIndustry({});

  if (!industry) {
    return res.sendStatus(404);
  }

  return res.send(industry);
}

export async function deleteIndustryHandler(
  req: Request<UpdateIndustryInput["params"]>,
  res: Response
) {
  const industryId = req.params.id;

  // Checks if id is valid object id
  if (!industryId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.sendStatus(404);
  }

  const industry = await findIndustry({ _id: industryId });

  if (!industry) {
    return res.sendStatus(404);
  }

  await deleteIndustry({ industryId });

  return res.sendStatus(200);
}
