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
  DAI_L2_ADDRESS,
} from "./constants";
import axios from "axios";
import { JsonRpcProvider } from "@ethersproject/providers";
import {
  apiCallL1,
  findingPusherL1,
  findingPusher_OP,
  findingPusher_ARB,
} from "./helperL1";

export function provideHandleBlock(
  DaiL1Address: string,
  erc20Abi: any[],
  l1EscrowAddressOp: string,
  l1EscrowAddressArb: string,
  apiUrl: string,
  queryOp: string,
  queryArb: string,
  headers: {},
  daiL2Address: string
): HandleBlock {
  return async (blockEvent: BlockEvent) => {
    const findings: Finding[] = [];
    let provider: JsonRpcProvider = new ethers.providers.JsonRpcProvider(
      getJsonRpcUrl()
    );
    let currChainId = (await provider._networkPromise).chainId;

    if (currChainId == 1) {
      try{
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
          if (parseFloat(L2_metadata["totalSupplyDai"]) > escrowBal) flag = true;
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
      catch(err:any)
      {
        findings.push(
          Finding.fromObject({
            name: err.toString(),
            description:
              "some error called",
            alertId: "DAI_ERR",
            severity: FindingSeverity.Low,
            type: FindingType.Info,
            metadata: {}
          }
          )
        );
      }
    } else if (currChainId == 10) {
      let DAI_L2 = new ethers.Contract(daiL2Address, erc20Abi, provider);
      let L2_totalSupply = parseFloat(await DAI_L2.totalSupply());
      L2_totalSupply /= Math.pow(10, 18);
      findingPusher_OP(findings, blockEvent, L2_totalSupply);
    } else if (currChainId == 42161) {
      let DAI_L2 = new ethers.Contract(daiL2Address, erc20Abi, provider);
      let L2_totalSupply = parseFloat(await DAI_L2.totalSupply());
      L2_totalSupply /= Math.pow(10, 18);
      findingPusher_ARB(findings, blockEvent, L2_totalSupply);
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
    HEADERS,
    DAI_L2_ADDRESS
  ),
};
