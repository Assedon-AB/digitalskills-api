import { Request, Response, NextFunction } from "express";

import { findUser, updateUser } from "../service/user.service";
const MAX = process.env.API_MAX || 500;

const validateKey = async (req: Request, res: Response, next: NextFunction) => {
  let host = req.headers.origin;
  let api_key = req.header("x-api-key");
  let account = await findUser({ host, api_key });

  if (account) {
    let today = new Date().toISOString().split("T")[0];
    let usageIndex = account.usage.findIndex(
      (day: { date: string; count: number }) => day.date == today
    );
    const usageCopy = account.usage.slice();

    if (usageIndex >= 0) {
      if (account.usage[usageIndex].count >= MAX) {
        res.status(429).send({
          error: {
            code: 429,
            message: "Max API calls exceeded.",
          },
        });
      } else {
        usageCopy[usageIndex].count++;
        updateUser({ _id: account._id }, { usage: usageCopy }, {});
        next();
      }
    } else {
      usageCopy.push({ date: today, count: 1 });
      updateUser({ _id: account._id }, { usage: usageCopy }, {});
      next();
    }
  } else {
    res
      .status(401)
      .send({ error: { code: 401, message: "Missing or invalid API key" } });
  }
};

const checkAuthorized = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let host = req.headers.origin;
  let api_key = req.header("x-api-key"); //version 3 using a header
  let account = await findUser({ host, api_key });

  if (account) {
    if (account.is_admin) {
      next();
    } else {
      res
        .status(403)
        .send({ error: { code: 403, message: "You're not allowed." } });
    }
  } else {
    res
      .status(401)
      .send({ error: { code: 401, message: "Missing or invalid API key" } });
  }
};

export { validateKey, checkAuthorized };
