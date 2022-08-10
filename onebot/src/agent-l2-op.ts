import {
  BlockEvent,
  Finding,
  HandleBlock,
  FindingSeverity,
  FindingType,
  getEthersProvider,
  ethers,
} from "forta-agent";
import { ERC20_ABI, DAI_L2_ADDRESS } from "./constants";
import { JsonRpcProvider } from "@ethersproject/providers";

let chainSpecificCache: number = 0;

export function provideHandleBlock_OP(erc20Abi: any[], daiL2Address: string) {
  return async (blockEvent: BlockEvent) => {
    let provider: JsonRpcProvider = getEthersProvider();
    const findings: Finding[] = [];

    let DAI_L2 = new ethers.Contract(daiL2Address, erc20Abi, provider);
    let L2_totalSupply = parseFloat(await DAI_L2.totalSupply());

    if (chainSpecificCache != L2_totalSupply) {
      findings.push(
        Finding.fromObject({
          name: "(OP)DAI-balance-update",
          description: `Returns the total supply of L2 Optimism DAI tokens`,
          alertId: "OP_DAI_SUPPLY-1",
          severity: FindingSeverity.Low,
          type: FindingType.Info,
          protocol: "MakerDAO",
          metadata: {
            blockNumber: blockEvent.blockNumber.toString(),
            blockHash: blockEvent.blockHash,
            chainId: "10",
            totalSupplyDAI: L2_totalSupply.toString(),
            prevTotalSupply: chainSpecificCache.toString(),
          },
        })
      );
    }

    chainSpecificCache = L2_totalSupply;

    return findings;
  };
}

export default {
  handleBlock: provideHandleBlock_OP(ERC20_ABI, DAI_L2_ADDRESS),
};
