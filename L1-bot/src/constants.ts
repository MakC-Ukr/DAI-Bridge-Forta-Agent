const DAI_L1_ADDRESS: string = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const L1_ESCROW_ADDRESS_OP: string =
  "0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65";
const L1_ESCROW_ADDRESS_ARB: string =
  "0xA10c7CE4b876998858b1a9E12b10092229539400";
const API_URL: string = "https://api.forta.network/graphql";
const ERC20_ABI: any[] = [
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

const QUERY_OP: string = `query recentAlerts {
  alerts(
    input: {
      first: 1
      createdSince: 600000
      bots: [
        "0x4ee97e15449fe5c14fd556f2b8a51a41f826f9c8df189d4328e92fa955a703dd"
      ]
      chainId: 10
    }
  ) {
    pageInfo {
      hasNextPage
    }
    alerts {
      createdAt
      name
      protocol
      metadata
    }
  }
}
`;

const QUERY_ARB: string = `query recentAlerts {
  alerts(
    input: {
      first: 1
      createdSince: 600000
      bots: [
        "0xe83234e6d5182610b4165bccb1b0dcf29c4582a18cf0c097bfc1d056edbe07b3"
      ]
      chainId: 42161
    }
  ) {
    pageInfo {
      hasNextPage
    }
    alerts {
      createdAt
      name
      protocol
      metadata
    }
  }
}
`;

const HEADERS: {} = {
  "content-type": "application/json",
};

export {
  DAI_L1_ADDRESS,
  ERC20_ABI,
  L1_ESCROW_ADDRESS_ARB,
  L1_ESCROW_ADDRESS_OP,
  QUERY_OP,
  QUERY_ARB,
  HEADERS,
  API_URL,
};
