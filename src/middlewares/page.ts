import { Request, Response, NextFunction } from "express";
export default (req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
  res.setHeader("X-Total-Count", "1");
  next();
};
