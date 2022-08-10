const DAI_L1_ADDRESS: string = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const L1_ESCROW_ADDRESS_OP: string =
  "0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65";
const L1_ESCROW_ADDRESS_ARB: string =
  "0xA10c7CE4b876998858b1a9E12b10092229539400";
const API_URL: string = "https://api.forta.network/graphql";
const ERC20_ABI: any[] = [
  "function balanceOf(address) view returns (uint)",
  "function totalSupply() view returns (uint)",
];

const DAI_L2_ADDRESS = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";

function QUERY_API(botId: string, chainId: string) {
  let ret: string = `query recentAlerts {
    alerts(
      input: {
        first: 1
        createdSince: 60000000
        bots: [
          "`;
  ret = ret + botId;
  ret =
    ret +
    `"
    ]
  chainId: `;
  ret = ret + chainId;
  ret =
    ret +
    `}
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

  return ret;
}
// const QUERY_OP: string = `query recentAlerts {
//   alerts(
//     input: {
//       first: 1
//       bots: [
//         "0xc33cfbe2c914e3d3c760ed46e8a546a3e3ccaa263a9a4e357bd5b7d877b49e9e"
//       ]
//       chainId: 10
//     }
//   ) {
//     pageInfo {
//       hasNextPage
//     }
//     alerts {
//       createdAt
//       name
//       protocol
//       metadata
//     }
//   }
// }
// `;

const QUERY_ARB: string = `query recentAlerts {
  alerts(
    input: {
      first: 1
      bots: [
        "0xc33cfbe2c914e3d3c760ed46e8a546a3e3ccaa263a9a4e357bd5b7d877b49e9e"
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
  QUERY_ARB,
  HEADERS,
  API_URL,
  DAI_L2_ADDRESS,
  QUERY_API,
};
