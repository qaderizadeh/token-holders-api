import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../models";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = (req.get("Authorization") || "").split(" ").pop() || "";
    const { id } = jwt.verify(token, process.env.JWT_SECRET || "") as any;
    res.locals.user = await User.findByPk(id, { raw: true });
  } catch (e) {}

  next();
};
