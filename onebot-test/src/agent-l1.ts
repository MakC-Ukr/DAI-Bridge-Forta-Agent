import { Finding, getEthersProvider, ethers, HandleBlock, BlockEvent } from "forta-agent";
import {
  QUERY_API,
  DAI_L1_ADDRESS,
  ERC20_ABI,
  L1_ESCROW_ADDRESS_ARB,
  L1_ESCROW_ADDRESS_OP,
  API_URL,
  HEADERS,
  CURR_BOT_ID,
  getFindingL1,
} from "./constants";
import axios from "axios";
import { JsonRpcProvider } from "@ethersproject/providers";

class Fetcher {
  getAlertData(apiUrl: string, querySent: string, headers: {}) {
    async function func(apiUrl: string, querySent: string, headers: {}) {
      const resp = await axios.post(
        apiUrl,
        {
          query: querySent,
        },
        { headers: headers }
      );

      const alerts: [] = resp["data"]["data"]["alerts"]["alerts"];
      if (alerts.length === 0) {
        return { totalSupplyDai: -1 };
      }
      return resp["data"]["data"]["alerts"]["alerts"][0]["metadata"];
    }
    return func(apiUrl, querySent, headers);
  }
}

export function provideHandleBlock_L1(
  daiL1Address: string,
  erc20Abi: any[],
  l1EscrowAddressArb: string,
  l1EscrowAddressOp: string,
  apiUrl: string,
  fetcher: Fetcher,
  headers: {},
  provider: JsonRpcProvider
): HandleBlock {
  const chainSpecificQueryData: { l1EscrowAddress: string; chainId: string; chainName: string }[] = [
    {
      l1EscrowAddress: l1EscrowAddressOp,
      chainId: "10",
      chainName: "Optimism",
    },
    {
      l1EscrowAddress: l1EscrowAddressArb,
      chainId: "42161",
      chainName: "Arbitrum",
    },
  ];

  return async (blockEvent: BlockEvent) => {
    let currBlockTimeStamp = blockEvent.block.timestamp.toString();
    currBlockTimeStamp += "000"; // converting timestamp to milliseconds
    let findings: Finding[] = [];
    let DAI_L1 = new ethers.Contract(daiL1Address, erc20Abi, provider);

    for (let i = 0; i <= chainSpecificQueryData.length - 1; i++) {
      let currData: { l1EscrowAddress: string; chainId: string; chainName: string } = chainSpecificQueryData[i];
      let L1_escrowBal = parseFloat(
        await DAI_L1.balanceOf(currData.l1EscrowAddress, { blockTag: blockEvent.blockNumber })
      );
      let l2_metadata = (
        await fetcher.getAlertData(apiUrl, QUERY_API(CURR_BOT_ID, currData.chainId, currBlockTimeStamp), headers)
      )["totalSupplyDai"];
      if (l2_metadata != -1 && L1_escrowBal < l2_metadata) {
        findings.push(getFindingL1(L1_escrowBal.toString(), l2_metadata.toString(), currData.chainName));
      }
    }
    return findings;
  };
}

export default {
  handleBlock: provideHandleBlock_L1(
    DAI_L1_ADDRESS,
    ERC20_ABI,
    L1_ESCROW_ADDRESS_ARB,
    L1_ESCROW_ADDRESS_OP,
    API_URL,
    new Fetcher(),
    HEADERS,
    getEthersProvider()
  ),
};
