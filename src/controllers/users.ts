import { Request, Response } from "express";
import { users } from "../services";

export async function find(req: Request, res: Response) {
  // if (res.locals.user.username !== "admin") req.query.id = res.locals.user.id;
  const data = await users.find(req.query);
  res.setHeader("X-Total-Count", data?.count);
  res.json(data?.rows);
}

export async function findOne(req: Request, res: Response) {
  if (
    res.locals.user.username !== "admin" &&
    req.params.id.toString() !== res.locals.user.id.toString()
  )
    throw { status: 403, message: "forbidden" };
  const data = await users.findOne(req.params.id);
  res.json(data);
}

export async function create(req: Request, res: Response) {
  const data = await users.create(req.body);
  res.json(data);
}

export async function update(req: Request, res: Response) {
  if (res.locals.user.username !== "admin") {
    req.body = { password: req.body.password };
    req.params.id = res.locals.user.id;
  }
  const data = await users.update({
    ...req.body,
    ...req.params,
  });
  res.json(data);
}

export async function login(req: Request, res: Response) {
  const data = await users.login(req.body);
  res.json(data);
}
