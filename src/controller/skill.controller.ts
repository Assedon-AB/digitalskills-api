import { Request, Response } from "express";
import { CreateSkillInput, UpdateSkillInput } from "../schema/skill.schema";
import {
  createSkill,
  deleteSkill,
  findAndUpdateSkill,
  findSkill,
  findSkills,
} from "../service/skill.service";

export async function createSkillHandler(
  req: Request<{}, {}, CreateSkillInput["body"]>,
  res: Response
) {
  const body = req.body;
  const skill = await createSkill({ ...body });

  return res.status(201).send(skill);
}

export async function updateSkillHandler(
  req: Request<UpdateSkillInput["params"]>,
  res: Response
) {
  const skillId = req.params.id;

  // Checks if id is valid object id
  if (!skillId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.sendStatus(404);
  }

  const update = req.body;

  const skill = await findSkill({ _id: skillId });

  if (!skill) {
    return res.sendStatus(404);
  }

  const updatedSkill = await findAndUpdateSkill({ _id: skillId }, update, {
    new: true,
  });

  return res.status(200).send(updatedSkill);
}

export async function getSkillsHandler(_: Request, res: Response) {
  const skills = await findSkills(
    {},
    { jobs: 0, skills: 0, geos: 0, employers: 0, traits: 0 }
  );

  if (!skills) {
    return res.sendStatus(404);
  }

  return res.send(skills);
}

export async function getSkillHandler(
  req: Request<UpdateSkillInput["params"]>,
  res: Response
) {
  const skillId = req.params.id;

  // Checks if id is valid object id
  if (!skillId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.sendStatus(404);
  }

  const skill = await findSkill({ _id: skillId });

  if (!skill) {
    return res.sendStatus(404);
  }

  return res.send(skill);
}

export async function deleteSkillHandler(
  req: Request<UpdateSkillInput["params"]>,
  res: Response
) {
  const skillId = req.params.id;

  // Checks if id is valid object id
  if (!skillId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.sendStatus(404);
  }

  const skill = await findSkill({ _id: skillId });

  if (!skill) {
    return res.sendStatus(404);
  }

  await deleteSkill({ skillId });

  return res.sendStatus(200);
}
