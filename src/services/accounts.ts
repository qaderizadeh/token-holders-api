import { Identifier, Op } from "sequelize";
import QueryString from "qs";
import { Account } from "../models";

export async function find(data: {
  [x: string]:
    | string
    | string[]
    | QueryString.ParsedQs
    | QueryString.ParsedQs[]
    | undefined;
}) {
  const { _end, _order, _sort, _start, value_ne, ...query } = data;
  return await Account.findAndCountAll({
    where: { ...query, ...(value_ne ? { value: { [Op.ne]: value_ne } } : {}) },
    offset: +(_start || 0),
    limit: +(_end || 0) - +(_start || 0),
    order: [[_sort as string, _order as string]],
    raw: true,
  });
}

export async function findOne(id: Identifier, userId: number | null = null) {
  const account = await Account.findByPk(id);
  if (!account) throw { status: 404, message: "account not found" };
  account.dataValues.rank =
    1 +
    (await Account.count({
      where: {
        tokenId: account.dataValues.tokenId,
        value: { [Op.gt]: account.dataValues.value },
      },
    }));
  return account;
}

export async function create(data: {
  [x: string]: string | string[] | undefined;
}) {
  return await Account.create(data);
}

export async function update(data: { [x: string]: string }) {
  await Account.update(data, { where: { id: data.id } });
  return await findOne(data.id);
}
