import { Request, Response } from "express";
import { transfers } from "../services";

export async function find(req: Request, res: Response) {
  const data = await transfers.find(req.query);
  res.setHeader("X-Total-Count", data?.count);
  res.json(data?.rows);
}

export async function findOne(req: Request, res: Response) {
  const data = await transfers.findOne(req.params.id);
  res.json(data);
}

export async function create(req: Request, res: Response) {
  const data = await transfers.create(req.body);
  res.json(data);
}

export async function update(req: Request, res: Response) {
  const data = await transfers.update({
    ...req.body,
    ...req.params,
  });
  res.json(data);
}
