import { Identifier, Op } from "sequelize";
import QueryString from "qs";
import { Transfer } from "../models";

export async function find(data: {
  [x: string]:
    | string
    | string[]
    | QueryString.ParsedQs
    | QueryString.ParsedQs[]
    | undefined;
}) {
  const { _end, _order, _sort, _start, q, ...query } = data;
  return await Transfer.findAndCountAll({
    where: {
      ...(q
        ? {
            [Op.or]: {
              from: { [Op.like]: `%${q}%` },
              to: { [Op.like]: `%${q}%` },
              value: { [Op.like]: `%${q}%` },
              hash: { [Op.like]: `%${q}%` },
              block: { [Op.like]: `%${q}%` },
              log: { [Op.like]: `%${q}%` },
            },
          }
        : {}),
      ...query,
    },
    offset: +(_start || 0),
    limit: +(_end || 0) - +(_start || 0),
    order: [[_sort as string, _order as string]],
    raw: true,
  });
}

export async function findOne(id: Identifier, userId: number | null = null) {
  const transfer = await Transfer.findByPk(id);
  if (!transfer) throw { status: 404, message: "transfer not found" };
  return transfer;
}

export async function create(data: {
  [x: string]: string | string[] | undefined;
}) {
  return await Transfer.create(data);
}

export async function update(data: { [x: string]: string }) {
  await Transfer.update(data, { where: { id: data.id } });
  return await findOne(data.id);
}
