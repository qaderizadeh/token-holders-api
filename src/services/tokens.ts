import { Identifier } from "sequelize";
import QueryString from "qs";
import { Network, Token } from "../models";
import { crawler } from "./";
import { erc20 } from "./";

export async function find(data: {
  [x: string]:
    | string
    | string[]
    | QueryString.ParsedQs
    | QueryString.ParsedQs[]
    | undefined;
}) {
  const { _end, _order, _sort, _start, ...query } = data;
  return await Token.findAndCountAll({
    where: query,
    offset: +(_start || 0),
    limit: +(_end || 0) - +(_start || 0),
    order: [[_sort as string, _order as string]],
    raw: true,
  });
}

export async function findOne(id: Identifier, userId: number | null = null) {
  const token = await Token.findByPk(id);
  if (!token) throw { status: 404, message: "token not found" };
  return token;
}

export async function create(data: {
  [x: string]: string | string[] | undefined;
}) {
  const network = await Network.findByPk(data.networkId as Identifier);
  const { name, symbol, decimals } = await erc20.getToken(
    network?.dataValues.url,
    data.address as string,
  );
  data.name = name;
  data.symbol = symbol;
  data.decimals = decimals.toString();
  const token = await Token.create(data);
  await crawler.initTokenHandler(token.dataValues.id);
  return token;
}

export async function update(data: { [x: string]: string }) {
  await Token.update(data, { where: { id: data.id } });
  return await findOne(data.id);
}
