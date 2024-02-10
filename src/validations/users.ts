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

export const login = {
  body: {
    username: Joi.string().required(),
    password: Joi.string().required(),
  },
};
