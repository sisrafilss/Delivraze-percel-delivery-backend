import { NextFunction, Response } from "express";

const createUser = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  next();
};

export const UserController = {
  createUser,
};
