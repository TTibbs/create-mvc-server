import { Request, Response, NextFunction } from 'express';
import { selectUsers } from "../models/users-models";

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await selectUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};
