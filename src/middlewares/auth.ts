import { Request, Response, NextFunction } from "express";
export default (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.user) throw { status: 403, message: "forbidden" };
  next();
};
