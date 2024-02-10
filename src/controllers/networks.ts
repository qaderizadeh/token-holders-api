import { Request, Response } from "express";
import { networks } from "../services";

export async function find(req: Request, res: Response) {
  const data = await networks.find(req.query);
  res.setHeader("X-Total-Count", data?.count);
  res.json(data?.rows);
}

export async function findOne(req: Request, res: Response) {
  const data = await networks.findOne(req.params.id);
  res.json(data);
}

export async function create(req: Request, res: Response) {
  const data = await networks.create(req.body);
  res.json(data);
}

export async function update(req: Request, res: Response) {
  const data = await networks.update({
    ...req.body,
    ...req.params,
  });
  res.json(data);
}
