import amqplib from "amqplib";
import BigNumber from "bignumber.js";
import { erc20 } from "./";
import { Token, Network, Transfer, Account } from "../models";

let conn: amqplib.Connection;

export async function run() {
  try {
    conn = await amqplib.connect(process.env.QUEUE_CONNECTION_STRING || "");

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

  const ch1 = await conn.createChannel();
  await ch1.assertQueue(queue);
  await ch1.prefetch(1);

  ch1.consume(queue, async (msg) => {
    if (msg !== null) {
      await transferHandler(msg.content.toString());

      ch1.ack(msg);
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
    callback: (event: any) =>
      eventHandler(event, token.dataValues.id, conn, queue),
  });
}

async function eventHandler(
  event: any,
  tokenId: any,
  conn: any,
  queue: string,
) {
  try {
    const ch2 = await conn.createChannel();

    ch2.sendToQueue(
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
    if (transfer.from != "0x0000000000000000000000000000000000000000")
      fromAccount = await Account.create({
        tokenId: transfer.tokenId,
        address: transfer.from,
        value: "-" + new BigNumber(transfer.value).toFixed().padStart(77, "0"),
      });
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
  }

  let toAccount = await Account.findOne({
    where: {
      address: transfer.to,
      tokenId: transfer.tokenId,
    },
  });

  if (!toAccount) {
    if (transfer.to != "0x0000000000000000000000000000000000000000")
      toAccount = await Account.create({
        tokenId: transfer.tokenId,
        address: transfer.to,
        value: transfer.value,
      });
  } else {
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
  }

  await Transfer.create(transfer);
}
