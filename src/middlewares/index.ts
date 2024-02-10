import express, { Application } from "express";
import cors from "cors";
// import json from "./json";
import user from "./user";
import log from "./log";
import page from "./page";
import admin from "./admin";
import auth from "./auth";
import error from "./error";
import validator from "./validator";

export function init(app: Application) {
  app.use(express.static("public"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));
  app.use(cors());
  // app.use(json);
  app.use(log);
  app.use(page);
  app.use(user);
}

export { auth, admin, error, validator };
