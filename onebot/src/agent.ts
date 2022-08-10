import {
  BlockEvent,
  Finding,
  HandleBlock,
  getEthersProvider,
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
import  provideHandleBlock_OP from "./agent-l2-op";
import  provideHandleBlock_L1  from "./agent-l1";
import { NetworkManager } from "forta-agent-tools";

interface NetworkData {
  findingsArrayFunc: Function;
}


// const data: Record<number, NetworkData> = {
//   // ChainID 1
//   1: {
//     findingsArrayFunc: provideHandleBlock_L1
//   },
//   10: {
//     findingsArrayFunc: provideHandleBlock_OP
//   },
//   42161:{
//     findingsArrayFunc: provideHandleBlock_ARB
//   }
// };

export function provideHandleBlock(
  daiL1Address: string,
  erc20Abi: any[],
  l1EscrowAddressArb: string,
  l1EscrowAddressOp: string,
  apiUrl: string,
  headers: {},
  daiL2Address: string
): HandleBlock {
  // return async (blockEvent: BlockEvent) => {
    return provideHandleBlock_L1.handleBlock;
    // let provider: JsonRpcProvider = getEthersProvider();
    // const networkManager = new NetworkManager(data);
    // await networkManager.init(provider);

    // let findings: Finding[] = [];

    // if (currChainId.toString() === "1") {
    //   findings = await provideHandleBlock_L1(
    //     daiL1Address,
    //     erc20Abi,
    //     l1EscrowAddressArb,
    //     l1EscrowAddressOp,
    //     apiUrl,
    //     headers
    //   );
    // } else if (currChainId.toString() === "10") {
    //   findings = await provideHandleBlock_OP(erc20Abi, daiL2Address, blockEvent);
    // } else if (currChainId.toString() === "42161") {
    //   findings = await provideHandleBlock_ARB(
    //     erc20Abi,
    //     daiL2Address,
    //     blockEvent
    //   );
    // }

    // return findings;
  // };
}

export default {
  handleBlock: provideHandleBlock(
    DAI_L1_ADDRESS,
    ERC20_ABI,
    L1_ESCROW_ADDRESS_ARB,
    L1_ESCROW_ADDRESS_OP,
    API_URL,
    HEADERS,
    DAI_L2_ADDRESS
  ),
};
