import { Request, Response, NextFunction } from "express";
export default async (
  err: { status: number; message: string },
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!err?.status) console.log(err);
  res.status(err?.status || 500).json(err);
  next();
};
