import { Application } from "express";
import accounts from "./accounts";
import networks from "./networks";
import tokens from "./tokens";
import transfers from "./transfers";
import users from "./users";
import { error } from "../middlewares";

export default function routes(app: Application) {
  app.use("/accounts", accounts);
  app.use("/networks", networks);
  app.use("/tokens", tokens);
  app.use("/transfers", transfers);
  app.use("/users", users);
  app.use(error);
}
