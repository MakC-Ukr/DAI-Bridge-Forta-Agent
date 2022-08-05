import {
  BlockEvent,
  Finding,
  HandleBlock,
  FindingSeverity,
  getJsonRpcUrl,
  FindingType,
} from "forta-agent";
var ethers = require("ethers");
import {
  DAI_L1_ADDRESS,
  ERC20_ABI,
  L1_ESCROW_ADDRESS_ARB,
  L1_ESCROW_ADDRESS_OP,
  API_URL,
  QUERY_OP,
  QUERY_ARB,
  HEADERS,
} from "./constants";
import axios from "axios";
import { JsonRpcProvider } from "@ethersproject/providers";
import { apiCallL1, findingPusherL1 } from "./helperL1";

export function provideHandleBlock(
  DaiL1Address: string,
  erc20Abi: any[],
  l1EscrowAddressOp: string,
  l1EscrowAddressArb: string,
  apiUrl: string,
  queryOp: string,
  queryArb: string,
  headers: {}
): HandleBlock {
  return async (_: BlockEvent) => {
    const findings: Finding[] = [];
    let provider: JsonRpcProvider = new ethers.providers.JsonRpcProvider(
      getJsonRpcUrl()
    );
    let currChainId = (await provider._networkPromise).chainId;

    if (currChainId == 1) {
      let DAI_L1 = new ethers.Contract(DaiL1Address, erc20Abi, provider);
      for (let i = 0; i < 2; i++) {
        const chainName = i === 0 ? "Optimism" : "Arbitrum";
        let escrowBal =
          parseFloat(
            await DAI_L1.balanceOf(
              i === 0 ? l1EscrowAddressOp : l1EscrowAddressArb
            )
          ) / Math.pow(10, 18);
        let flag = false;
        let L2_metadata = await apiCallL1(
          i,
          apiUrl,
          queryArb,
          queryOp,
          headers
        );

        if (parseFloat(L2_metadata["totalSupplyDai"]) <= escrowBal) flag = true;

        if (flag) {
          findingPusherL1(
            i,
            findings,
            chainName,
            escrowBal,
            L2_metadata["totalSupplyDai"].toString(),
            L2_metadata["chainId"]
          );
        }
      }
    }
    return findings;
  };
}

export default {
  handleBlock: provideHandleBlock(
    DAI_L1_ADDRESS,
    ERC20_ABI,
    L1_ESCROW_ADDRESS_OP,
    L1_ESCROW_ADDRESS_ARB,
    API_URL,
    QUERY_OP,
    QUERY_ARB,
    HEADERS
  ),
};
