import amqplib from "amqplib";
import BigNumber from "bignumber.js";
import { Op } from "sequelize";
import { erc20 } from "./";
import { Token, Network, Transfer, Account } from "../models";

const open = amqplib.connect(process.env.QUEUE_CONNECTION_STRING || "");

async function getChannel(): Promise<amqplib.Channel> {
  const conn = await open;

  return conn.createChannel();
}

export async function run() {
  try {
    const tokens = await Token.findAll();

    for (const token of tokens) {
      await tokenHandler(token.dataValues.id);
    }
  } catch (e) {
    console.log(e);
  }
}

export async function tokenHandler(tokenId: any) {
  const token = await Token.findOne({
    where: { id: tokenId },
    include: [{ model: Network }],
  });

  if (!token) throw Error("token not found");

  const queue = "token:" + token.dataValues.id;

  const ch = await getChannel();

  await ch.assertQueue(queue);

  await ch.prefetch(1);

  ch.consume(queue, async (msg) => {
    if (msg !== null) {
      await transferHandler(msg.content.toString());

      ch.ack(msg);
    } else {
      console.log("Consumer cancelled by server");
    }
  });

  const lastTransfer = await Transfer.findOne({
    where: { tokenId: token.dataValues.id },
    order: [["block", "DESC"]],
  });

  await erc20.listen({
    url: token.dataValues.network.url,
    address: token.dataValues.address,
    options: {
      fromBlock: lastTransfer?.dataValues.block || token.dataValues.block,
    },
    event: "Transfer",
    callback: (event: any) => eventHandler(event, token.dataValues.id, queue),
  });
}

async function eventHandler(event: any, tokenId: any, queue: string) {
  try {
    const ch = await getChannel();

    await ch.assertQueue(queue);

    ch.sendToQueue(
      queue,
      Buffer.from(
        JSON.stringify({
          from: event.returnValues.from.toLowerCase(),
          to: event.returnValues.to.toLowerCase(),
          value: new BigNumber(event.returnValues.value)
            .toFixed()
            .padStart(78, "0"),
          hash: event.transactionHash.toLowerCase(),
          block: Number(event.blockNumber),
          log: Number(event.logIndex),
          tokenId: tokenId,
        }),
      ),
    );
  } catch (e) {
    console.log(e);
  }
}

async function transferHandler(msg: string) {
  const transfer = JSON.parse(msg);
  let newHolder = false;
  let fromNewValue = "0";
  let toNewValue = "0";

  if (
    await Transfer.count({
      where: {
        tokenId: transfer.tokenId,
        hash: transfer.hash,
        log: transfer.log,
      },
    })
  )
    return;

  let fromAccount = await Account.findOne({
    where: {
      address: transfer.from,
      tokenId: transfer.tokenId,
    },
  });

  if (!fromAccount) {
    if (transfer.from != "0x0000000000000000000000000000000000000000") {
      fromAccount = await Account.create({
        tokenId: transfer.tokenId,
        address: transfer.from,
        value: "-" + new BigNumber(transfer.value).toFixed().padStart(77, "0"),
      });

      fromNewValue =
        "-" + new BigNumber(transfer.value).toFixed().padStart(77, "0");
    }
  } else {
    const newValueBN = new BigNumber(fromAccount.dataValues.value).minus(
      new BigNumber(transfer.value),
    );

    const newValue = newValueBN.isGreaterThanOrEqualTo(0)
      ? newValueBN.toFixed().padStart(78, "0")
      : "-" + newValueBN.abs().toFixed().padStart(77, "0");

    await Account.update(
      { value: newValue },
      { where: { id: fromAccount.dataValues.id } },
    );

    fromNewValue = newValue;
  }

  let toAccount = await Account.findOne({
    where: {
      address: transfer.to,
      tokenId: transfer.tokenId,
    },
  });

  if (!toAccount) {
    if (transfer.to != "0x0000000000000000000000000000000000000000") {
      toAccount = await Account.create({
        tokenId: transfer.tokenId,
        address: transfer.to,
        value: transfer.value,
      });

      newHolder = true;

      toNewValue = transfer.value;
    }
  } else {
    if (toAccount.dataValues.value == 0) newHolder = true;

    const newValueBN = new BigNumber(toAccount.dataValues.value).plus(
      new BigNumber(transfer.value),
    );

    const newValue = newValueBN.isGreaterThanOrEqualTo(0)
      ? newValueBN.toFixed().padStart(78, "0")
      : "-" + newValueBN.abs().toFixed().padStart(77, "0");

    Account.update(
      { value: newValue },
      { where: { id: toAccount.dataValues.id } },
    );

    toNewValue = newValue;
  }

  transfer.fromRank =
    1 +
    (await Account.count({
      where: { tokenId: transfer.tokenId, value: { [Op.gt]: fromNewValue } },
    }));

  transfer.toRank =
    1 +
    (await Account.count({
      where: { tokenId: transfer.tokenId, value: { [Op.gt]: toNewValue } },
    }));

  transfer.totalHolder = await Account.count({
    where: {
      tokenId: transfer.tokenId,
      value: { [Op.ne]: "0".padStart(78, "0") },
    },
  });

  transfer.newHolder = newHolder;

  await Transfer.create(transfer);
}
