import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export default (schema: object) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = Joi.object(schema).unknown(true).validate(req);

    if (error) throw { status: 400, message: error.details.pop()?.message };

    Object.assign(req, value);

    next();
  };
