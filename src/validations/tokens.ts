import Joi from "joi";

import { find as defaultFind } from "./defaults";

export const find = {
  query: {
    ...defaultFind.query,
    id: [
      Joi.number().integer().min(1),
      Joi.array().items(Joi.number().integer().min(1)),
    ],
  },
};

export const create = {
  body: {
    address: Joi.string()
      .length(42)
      .lowercase()
      .regex(/\b0x[a-f0-9]{40}\b/)
      .required(),
    networkId: Joi.number().integer().min(1).required(),
  },
};
