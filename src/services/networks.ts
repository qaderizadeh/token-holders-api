import { Identifier } from "sequelize";
import QueryString from "qs";
import { Network } from "../models";

export async function find(data: {
  [x: string]:
    | string
    | string[]
    | QueryString.ParsedQs
    | QueryString.ParsedQs[]
    | undefined;
}) {
  const { _end, _order, _sort, _start, ...query } = data;
  return await Network.findAndCountAll({
    where: query,
    offset: +(_start || 0),
    limit: +(_end || 0) - +(_start || 0),
    order: [[_sort as string, _order as string]],
    raw: true,
  });
}

export async function findOne(id: Identifier, userId: number | null = null) {
  const network = await Network.findByPk(id);
  if (!network) throw { status: 404, message: "network not found" };
  return network;
}

export async function create(data: {
  [x: string]: string | string[] | undefined;
}) {
  return await Network.create(data);
}

export async function update(data: { [x: string]: string }) {
  await Network.update(data, { where: { id: data.id } });
  return await findOne(data.id);
}
