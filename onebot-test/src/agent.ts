import {
  BlockEvent,
  Finding,
  HandleBlock,
  getEthersProvider,
  ethers,
  Initialize
} from "forta-agent";

import provideHandleBlock_L2 from "./agent-l2";
import provideHandleBlock_L1 from "./agent-l1";
import { NetworkManager } from "forta-agent-tools";

export interface NetworkData {
  findingsArrayFunc: HandleBlock;
}

const data: Record<number, NetworkData> = {
  1: {
    findingsArrayFunc: provideHandleBlock_L1.handleBlock,
  },
  10: {
    findingsArrayFunc: provideHandleBlock_L2.handleBlock,
  },
  42161: {
    findingsArrayFunc: provideHandleBlock_L2.handleBlock,
  },
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

export const provideHandleBlock = (networkManagerCurr: NetworkManager<NetworkData>  ): HandleBlock => {
  let handler: HandleBlock;

  const delayedHandlerBuilder = (blockEvent: BlockEvent): Promise<Finding[]> => {
    handler = networkManagerCurr.get("findingsArrayFunc");
    return handler(blockEvent);
  };

  const wrapper = (blockEvent: BlockEvent): Promise<Finding[]> => {
    return handler(blockEvent);
  };

  handler = delayedHandlerBuilder;
  return wrapper;
};

export default {
  initialize: provideInitialize(networkManagerCurr, getEthersProvider()),
  handleBlock: provideHandleBlock(networkManagerCurr),
};
