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
  "function totalSupply() view returns (uint)"
];

const DAI_L2_ADDRESS = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";

const QUERY_OP: string = `query recentAlerts {
  alerts(
    input: {
      first: 1
      bots: [
        "0xda07e20f41b66467c8e16dbfda9ed047570a4dd43becf760d54db866695427ca"
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
      bots: [
        "0xda07e20f41b66467c8e16dbfda9ed047570a4dd43becf760d54db866695427ca"
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
  DAI_L2_ADDRESS,
};
