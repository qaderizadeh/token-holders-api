import Web3 from "web3";

const erc20Abi = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
];

export async function getToken(url: string, address: string) {
  const web3 = new Web3(url);
  const contract = new web3.eth.Contract(erc20Abi, address);
  const name = (await contract.methods.name().call()) as string;
  const symbol = (await contract.methods.symbol().call()) as string;
  const decimals = (await contract.methods.decimals().call()) as string;

  return { name, symbol, decimals };
}

export async function listen({
  url,
  address,
  event,
  options = {},
  callback,
}: {
  url: string;
  address: string;
  event: string;
  options: object;
  callback: any;
}) {
  const web3 = new Web3(url);
  const contract = new web3.eth.Contract(erc20Abi, address);
  contract.events[event](options).on("data", callback);
}
