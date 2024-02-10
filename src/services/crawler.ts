import AsyncLock from "async-lock";
import BigNumber from "bignumber.js";
import { erc20 } from "./";
import { Token, Network, Transfer, Account } from "../models";

const lock = new AsyncLock();

export async function run() {
  const tokens = await Token.findAll({ include: [{ model: Network }] });
  for (const token of tokens) {
    const lastTransfer = await Transfer.findOne({
      where: { tokenId: token.dataValues.id },
      order: [["block", "DESC"]],
    });

    erc20.listen({
      url: token.dataValues.network.url,
      contractAddress: token.dataValues.address,
      options: {
        fromBlock: lastTransfer?.dataValues.block || token.dataValues.block,
      },
      event: "Transfer",
      callback: (event: any) => transferHandler(event, token.dataValues.id),
    });

    lock.acquire("tokenId:" + token.dataValues.id, (done) =>
      accountHandler(token.dataValues.id).finally(() => done()),
    );
  }
}

async function transferHandler(event: any, tokenId: any) {
  try {
    await Transfer.create({
      from: event.returnValues.from.toLowerCase(),
      to: event.returnValues.to.toLowerCase(),
      value: new BigNumber(event.returnValues.value)
        .toFixed()
        .padStart(78, "0"),
      hash: event.transactionHash.toLowerCase(),
      block: event.blockNumber,
      log: event.logIndex,
      tokenId: tokenId,
    });

    lock.acquire("tokenId:" + tokenId, (done) =>
      accountHandler(tokenId).finally(() => done()),
    );
  } catch (e) {}
}

async function accountHandler(tokenId: any) {
  const transfers = await Transfer.findAll({
    where: { tokenId, checked: false },
  });
  for (const transfer of transfers) {
    const fromAccount = await Account.findOne({
      where: {
        address: transfer.dataValues.from,
        tokenId: transfer.dataValues.tokenId,
      },
    });

    if (fromAccount) {
      const newValue = new BigNumber(fromAccount.dataValues.value)
        .minus(new BigNumber(transfer.dataValues.value))
        .toFixed()
        .padStart(78, "0");

      Account.update(
        { value: newValue },
        { where: { id: fromAccount.dataValues.id } },
      );
    }

    let toAccount = await Account.findOne({
      where: {
        address: transfer.dataValues.to,
        tokenId: transfer.dataValues.tokenId,
      },
    });

    if (!toAccount) {
      if (
        transfer.dataValues.to != "0x0000000000000000000000000000000000000000"
      )
        toAccount = await Account.create({
          tokenId: transfer.dataValues.tokenId,
          address: transfer.dataValues.to.toLowerCase(),
          value: new BigNumber(transfer.dataValues.value)
            .toFixed()
            .padStart(78, "0"),
        });
    } else {
      const newValue = new BigNumber(toAccount.dataValues.value)
        .plus(new BigNumber(transfer.dataValues.value))
        .toFixed()
        .padStart(78, "0");

      Account.update(
        { value: newValue },
        { where: { id: toAccount.dataValues.id } },
      );
    }

    await Transfer.update(
      { checked: true },
      { where: { id: transfer.dataValues.id } },
    );
  }
}

export async function initTokenHandler(tokenId: any) {
  const token = await Token.findByPk(tokenId, {
    include: [{ model: Network }],
  });
  if (!token) return;
  erc20.listen({
    url: token.dataValues.network.url,
    contractAddress: token.dataValues.address,
    options: { fromBlock: token.dataValues.block },
    event: "Transfer",
    callback: (event: any) => transferHandler(event, token.dataValues.id),
  });
}
