const CHAIN_ID_BOT = "10";
const DAI_L2_ADDRESS = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

export { DAI_L2_ADDRESS, ERC20_ABI, CHAIN_ID_BOT };
