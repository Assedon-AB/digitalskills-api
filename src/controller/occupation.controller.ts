import { Request, Response } from "express";
import {
  CreateOccupationInput,
  UpdateOccupationInput,
} from "../schema/occupation.schema";
import {
  createOccupation,
  deleteOccupation,
  findAndUpdateOccupation,
  findOccupation,
  findOccupations,
} from "../service/occupation.service";

export async function createOccupationHandler(
  req: Request<{}, {}, CreateOccupationInput["body"]>,
  res: Response
) {
  const body = req.body;
  const occupation = await createOccupation({ ...body });

  return res.status(201).send(occupation);
}

export async function updateOccupationHandler(
  req: Request<UpdateOccupationInput["params"]>,
  res: Response
) {
  const occupationId = req.params.id;

  // Checks if id is valid object id
  if (!occupationId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.sendStatus(404);
  }

  const update = req.body;

  const skill = await findOccupation({ _id: occupationId });

  if (!skill) {
    return res.sendStatus(404);
  }

  const updatedOccupation = await findAndUpdateOccupation(
    { _id: occupationId },
    update,
    {
      new: true,
    }
  );

  return res.status(200).send(updatedOccupation);
}

export async function getOccupationsHandler(_: Request, res: Response) {
  const occupations = await findOccupations(
    {},
    { jobs: 0, skills: 0, geos: 0, employers: 0, traits: 0 }
  );

  if (!occupations) {
    return res.sendStatus(404);
  }

  return res.send(occupations);
}

export async function getOccupationHandler(
  req: Request<UpdateOccupationInput["params"]>,
  res: Response
) {
  const skillId = req.params.id;

  // Checks if id is valid object id
  if (!skillId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.sendStatus(404);
  }

  const skill = await findOccupation({ _id: skillId });

  if (!skill) {
    return res.sendStatus(404);
  }

  return res.send(skill);
}

export async function deleteOccupationHandler(
  req: Request<UpdateOccupationInput["params"]>,
  res: Response
) {
  const skillId = req.params.id;

  // Checks if id is valid object id
  if (!skillId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.sendStatus(404);
  }

  const skill = await findOccupation({ _id: skillId });

  if (!skill) {
    return res.sendStatus(404);
  }

  await deleteOccupation({ skillId });

  return res.sendStatus(200);
}
