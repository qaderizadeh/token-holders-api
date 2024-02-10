import { Request, Response } from "express";
import { accounts } from "../services";

export async function find(req: Request, res: Response) {
  const data = await accounts.find(req.query);
  res.setHeader("X-Total-Count", data?.count);
  res.json(data?.rows);
}

export async function findOne(req: Request, res: Response) {
  const data = await accounts.findOne(req.params.id);
  res.json(data);
}

export async function create(req: Request, res: Response) {
  const data = await accounts.create(req.body);
  res.json(data);
}

export async function update(req: Request, res: Response) {
  const data = await accounts.update({
    ...req.body,
    ...req.params,
  });
  res.json(data);
}
