import Joi from "joi";

export const find = {
  query: {
    _start: Joi.number().integer().min(0).default(0),
    _end: Joi.number().integer().min(1).default(10),
    _sort: Joi.string().default("id"),
    _order: Joi.valid("ASC", "DESC").default("DESC"),
    q: Joi.string(),
  },
};
