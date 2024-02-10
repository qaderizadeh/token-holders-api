import Web3 from "web3";

const erc20Abi = [
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

export async function listen({
  url,
  contractAddress,
  event,
  options = {},
  callback,
}: {
  url: string;
  contractAddress: string;
  event: string;
  options: object;
  callback: any;
}) {
  const web3 = new Web3(url);
  const contract = new web3.eth.Contract(erc20Abi, contractAddress);
  contract.events[event](options).on("data", callback);
}
