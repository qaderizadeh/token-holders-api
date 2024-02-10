import jwt from "jsonwebtoken";
import { randomBytes, pbkdf2Sync } from "crypto";
import { Identifier, Op } from "sequelize";
import QueryString from "qs";
import { User } from "../models";

export async function find(data: {
  [x: string]:
    | string
    | string[]
    | QueryString.ParsedQs
    | QueryString.ParsedQs[]
    | undefined;
}) {
  const { _end, _order, _sort, _start, q, ...query } = data;
  return await User.findAndCountAll({
    where: {
      ...(q
        ? {
            [Op.or]: {
              username: { [Op.like]: `%${q}%` },
              firstName: { [Op.like]: `%${q}%` },
              lastName: { [Op.like]: `%${q}%` },
              phoneNumber: { [Op.like]: `%${q}%` },
              email: { [Op.like]: `%${q}%` },
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

export async function findOne(id: Identifier) {
  const user = await User.findByPk(id);
  if (!user) throw { status: 404, message: "user not found" };
  return user;
}

export async function create(data: {
  [x: string]: string | string[] | undefined;
}) {
  data.passwordSalt = randomBytes(16).toString("hex");
  data.passwordHash = pbkdf2Sync(
    data?.password as string,
    data.passwordSalt,
    1000,
    64,
    `sha512`,
  ).toString(`hex`);
  delete data.password;
  if (!data.lastSettleDate) data.lastSettleDate = new Date().toISOString();
  return await User.create(data);
}

export async function update(data: { [x: string]: string }) {
  if (data.password) {
    data.passwordSalt = randomBytes(16).toString("hex");
    data.passwordHash = pbkdf2Sync(
      data?.password as string,
      data.passwordSalt,
      1000,
      64,
      `sha512`,
    ).toString(`hex`);
    delete data.password;
  }
  await User.update(data, { where: { id: data.id } });
  return await findOne(data.id);
}

export async function login(data: {
  [x: string]: string | string[] | undefined;
}) {
  let user;
  user = await User.findOne({ where: { username: data.username } });
  if (!user) {
    if ((await User.count()) === 0)
      await create({ username: "admin", password: "admin" });
    throw { status: 404, message: "user not found" };
  }
  data.passwordSalt = user.dataValues.passwordSalt;
  data.passwordHash = pbkdf2Sync(
    data?.password as string,
    data.passwordSalt as string,
    1000,
    64,
    `sha512`,
  ).toString(`hex`);
  if (data.passwordHash !== user.dataValues.passwordHash)
    throw { status: 404, message: "password is invalid" };
  const token = jwt.sign(
    { id: user.dataValues.id },
    process.env.JWT_SECRET || "",
    {
      expiresIn: "7d",
    },
  );
  return { token };
}
