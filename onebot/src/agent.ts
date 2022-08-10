import {
  BlockEvent,
  Finding,
  HandleBlock,
  getEthersProvider,
  ethers,
  Initialize,
  FindingType,
  FindingSeverity,
} from "forta-agent";
import {
  DAI_L1_ADDRESS,
  ERC20_ABI,
  L1_ESCROW_ADDRESS_ARB,
  L1_ESCROW_ADDRESS_OP,
  API_URL,
  HEADERS,
  DAI_L2_ADDRESS,
} from "./constants";
import axios from "axios";
import { JsonRpcProvider } from "@ethersproject/providers";
import provideHandleBlock_ARB from "./agent-l2-arb";
import provideHandleBlock_L1 from "./agent-l1";


export function provideHandleBlock(): HandleBlock {
  
  return async (_: BlockEvent) => {
    let provider: JsonRpcProvider = getEthersProvider();
    let currChainId = (await provider._networkPromise).chainId;

    let findings: Finding[] = [];

    if (currChainId.toString() === "1") {
      findings = await provideHandleBlock_L1;
    }
    // else if (currChainId.toString() === "10") {
    //   findings = await provideHandleBlock_OP;
    // }
    else if (currChainId.toString() === "42161") {
      findings = await provideHandleBlock_ARB;
    }

    return findings;
  };
}

export default {
  handleBlock: provideHandleBlock(),
};
