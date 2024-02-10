import { Request, Response } from "express";
import { tokens } from "../services";

export async function find(req: Request, res: Response) {
  const data = await tokens.find(req.query);
  res.setHeader("X-Total-Count", data?.count);
  res.json(data?.rows);
}

export async function findOne(req: Request, res: Response) {
  const data = await tokens.findOne(req.params.id);
  res.json(data);
}

export async function create(req: Request, res: Response) {
  const data = await tokens.create(req.body);
  res.json(data);
}

export async function update(req: Request, res: Response) {
  const data = await tokens.update({
    ...req.body,
    ...req.params,
  });
  res.json(data);
}
