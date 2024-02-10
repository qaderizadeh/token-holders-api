import dotenv from "dotenv";
import express from "express";
import "express-async-errors";

dotenv.config();

import { init as middlewaresInit } from "./middlewares";
import routes from "./routes";

const PORT = process.env.PORT;

const app = express();

middlewaresInit(app);
routes(app);

const server = app.listen(PORT, function () {
  console.log(`App is listening on port ${PORT}...`);
});
