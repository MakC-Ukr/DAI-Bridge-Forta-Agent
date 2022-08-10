import {
  BlockEvent,
  Finding,
  HandleBlock,
  getEthersProvider,
  ethers,
  Initialize,
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
import provideHandleBlock_OP from "./agent-l2-op";
import provideHandleBlock_L1 from "./agent-l1";
import { NetworkManager } from "forta-agent-tools";

interface NetworkData {
  findingsArrayFunc: HandleBlock;
}

const data: Record<number, NetworkData> = {
  1: {
    findingsArrayFunc: provideHandleBlock_L1.handleBlock
  },
  10: {
    findingsArrayFunc: provideHandleBlock_OP.handleBlock
  },
  42161:{
    findingsArrayFunc: provideHandleBlock_ARB.handleBlock
  }
};


const networkManagerCurr = new NetworkManager(data);
export const provideInitialize = (
  networkManager: NetworkManager<NetworkData>,
  provider: ethers.providers.Provider
): Initialize => {
  return async () => {
    await networkManager.init(provider);
  };
};

export function provideHandleBlock(): HandleBlock {
  return networkManagerCurr.get("findingsArrayFunc");
}

export default {
  initialize : provideInitialize(networkManagerCurr, getEthersProvider()),
  handleBlock: provideHandleBlock(),
};
